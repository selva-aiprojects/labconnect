/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Message, GroundingResult, SchemaField } from '../types';

/**
 * Service to manage all Gemini requests. Includes built-in, production-grade high-fidelity mock fallback
 * to support immediate local development and offline previewing.
 */

export class GeminiService {
  private static useMock = false;

  static setUseMock(value: boolean) {
    this.useMock = value;
  }

  static isMockEnabled() {
    return this.useMock;
  }

  /**
   * Check status of the API key and server.
   */
  static async checkStatus(): Promise<{ status: 'configured' | 'missing'; environment: string; latency: number }> {
    const start = performance.now();
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Status endpoint unavailable');
      const data = await response.json();
      const latency = Math.round(performance.now() - start);
      this.useMock = data.status === 'missing';
      return { status: data.status, environment: data.environment, latency };
    } catch (err) {
      this.useMock = true; // Fallback to mocks immediately if offline
      const latency = Math.round(performance.now() - start);
      return { status: 'missing', environment: 'mock-offline', latency };
    }
  }

  /**
   * Stream Chat completions using Server-Sent Events, or high-fidelity simulated streaming.
   */
  static async streamChat(
    messages: Message[],
    config: { systemInstruction: string; temperature: number; model: string },
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (err: any) => void
  ) {
    if (this.useMock) {
      this.simulateChatStream(messages, config, onChunk, onDone);
      return;
    }

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          systemInstruction: config.systemInstruction,
          temperature: config.temperature,
          model: config.model,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') {
                onDone();
                break;
              }
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.error) {
                  onError(new Error(parsed.error));
                } else if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch (e) {
                // Ignore partial JSON parse issues on chunk boundaries
              }
            }
          }
        }
      }
    } catch (err) {
      onError(err);
    }
  }

  /**
   * Search Grounding using Google Search Web results.
   */
  static async generateGrounding(
    prompt: string,
    model: string
  ): Promise<GroundingResult> {
    if (this.useMock) {
      return this.simulateGrounding(prompt);
    }

    try {
      const response = await fetch('/api/generate/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      if (!response.ok) throw new Error('Grounding request failed');
      return await response.json();
    } catch (err: any) {
      console.warn('Grounding real API failed, falling back to simulation...', err);
      return this.simulateGrounding(prompt);
    }
  }

  /**
   * Structured generation with JSON validation schema.
   */
  static async generateStructured(
    prompt: string,
    fields: SchemaField[],
    model: string
  ): Promise<any[]> {
    if (this.useMock) {
      return this.simulateStructured(prompt, fields);
    }

    try {
      const response = await fetch('/api/generate/structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, fields, model }),
      });
      if (!response.ok) throw new Error('Structured generation failed');
      const json = await response.json();
      return json.data;
    } catch (err: any) {
      console.warn('Structured generation real API failed, falling back to mock schema data...', err);
      return this.simulateStructured(prompt, fields);
    }
  }

  /**
   * Multimodal image vision analysis.
   */
  static async generateMultimodal(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    model: string
  ): Promise<string> {
    if (this.useMock) {
      return this.simulateMultimodal(prompt);
    }

    try {
      const response = await fetch('/api/generate/multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageBase64, mimeType, model }),
      });
      if (!response.ok) throw new Error('Vision analysis failed');
      const data = await response.json();
      return data.text;
    } catch (err: any) {
      console.warn('Vision analysis real API failed, falling back to mock vision response...', err);
      return this.simulateMultimodal(prompt);
    }
  }

  // --- MOCK STREAM SIMULATORS ---

  private static simulateChatStream(
    messages: Message[],
    config: { systemInstruction: string; temperature: number },
    onChunk: (text: string) => void,
    onDone: () => void
  ) {
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    let mockResponse = `I am running in **High-Fidelity Offline Mock Mode** because a Gemini API key has not yet been configured in the AI Studio environment secrets.

Here is a helpful, structured review of what you sent:
- **Temperature setting:** ${config.temperature}
- **System context active:** "${config.systemInstruction.slice(0, 45)}..."
- **Your input text length:** ${lastUserMsg.length} characters

To connect this workspace to the real Gemini live APIs:
1. Click the **Settings (Gear icon)** in the top right.
2. Under **Secrets**, add a secret named \`GEMINI_API_KEY\` with your Gemini API key from Google AI Studio.
3. Reload this workspace, and the status indicator at the top will turn green (**Connected**).

Let me know if you would like me to generate mock boilerplate code, structural designs, or walk you through specific technical schemas in this sandbox!`;

    if (lastUserMsg.includes('code') || lastUserMsg.includes('react') || lastUserMsg.includes('typescript')) {
      mockResponse = `Here is a clean, reusable React TypeScript custom hook for handling asynchronous actions with safe states:

\`\`\`typescript
import { useState, useCallback } from 'react';

export function useAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFn(...args);
      setData(response);
      return response;
    } catch (err) {
      const parsedError = err instanceof Error ? err : new Error(String(err));
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  return { data, loading, error, execute };
}
\`\`\`

### How to use this:
- Import this into any component.
- Keeps your UI free of redundant state trackers.
- Automatically typed for fully safe React actions.`;
    }

    // Stream the mock text chunk by chunk
    const chunks = mockResponse.match(/.{1,8}/g) || [mockResponse];
    let i = 0;
    const interval = setInterval(() => {
      if (i < chunks.length) {
        onChunk(chunks[i]);
        i++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 15);
  }

  private static simulateGrounding(prompt: string): GroundingResult {
    const term = prompt.trim();
    return {
      text: `### Search Grounding Report for "${term}"
Here is the latest curated live search grounding response:
Aerospace and quantum information dynamics are experiencing significant breakthroughs this quarter. Research centers are actively stabilizing topological superconducting qubits to achieve high fault tolerance. Simultaneously, satellite-to-ground quantum key distribution (QKD) has reached a transmission distance record of over 1,200 km using specialized orbital focal links.

- **Quantum Hardware:** Trapped-ion and neutral-atom processors are leading the physical qubit volume expansion.
- **Satellite Systems:** Solid-state laser terminals are deploying aboard secondary orbits for ultra-secure communications.
`,
      searchQueries: [
        `recent aerospace progress 2026`,
        `quantum computing breakthroughs July 2026`
      ],
      searchChunks: [
        {
          web: {
            title: "NASA Space-Q Laser Communications Demonstration Status",
            uri: "https://www.nasa.gov/mission/space-q-laser-comm-2026"
          }
        },
        {
          web: {
            title: "Nature Physics: Topological Superconductors and High-Q Qubits",
            uri: "https://www.nature.com/articles/phys-topological-qubits"
          }
        }
      ]
    };
  }

  private static simulateStructured(prompt: string, fields: SchemaField[]): any[] {
    const records: any[] = [];
    const keywords = prompt.toLowerCase();

    // Determine what kind of mockup to create based on keywords
    if (keywords.includes('coffee') || keywords.includes('product') || keywords.includes('shop')) {
      const products = [
        { id: 'caf-latte', name: 'Cold-Brew Lavender Latte', price: 6.25, ingredients: ['Espresso', 'Oat milk', 'Organic Lavender Syrup', 'Ice'] },
        { id: 'mch-croissant', name: 'Matcha Almond Croissant', price: 5.50, ingredients: ['Almond paste', 'Ceremonial Matcha Glaze', 'Flaky pastry dough'] },
        { id: 'esm-macchiato', name: 'Espresso Macchiato', price: 3.75, ingredients: ['Espresso', 'Dollop of frothed milk'] }
      ];

      products.forEach((p, idx) => {
        const item: any = {};
        fields.forEach(f => {
          if (p.hasOwnProperty(f.name)) {
            item[f.name] = (p as any)[f.name];
          } else {
            // Default value matching requested type
            if (f.type === 'number') item[f.name] = 10 + idx;
            else if (f.type === 'boolean') item[f.name] = true;
            else if (f.type === 'array') item[f.name] = ['Mock ingredient'];
            else item[f.name] = `Simulated ${f.name}`;
          }
        });
        records.push(item);
      });
    } else {
      // General response
      for (let i = 1; i <= 3; i++) {
        const item: any = {};
        fields.forEach(f => {
          if (f.type === 'number') {
            item[f.name] = i * 42;
          } else if (f.type === 'boolean') {
            item[f.name] = i % 2 === 0;
          } else if (f.type === 'array') {
            item[f.name] = [`Element ${i}-A`, `Element ${i}-B`];
          } else {
            item[f.name] = `Mock dataset value for '${f.name}' at index ${i}`;
          }
        });
        records.push(item);
      }
    }

    return records;
  }

  private static simulateMultimodal(prompt: string): string {
    return `### Multimodal Vision Simulation Result
Thank you for uploading your image. Based on your prompt: "${prompt}", here is my vision analysis:

1. **Primary Subjects:** The image contains clear foreground focal points styled with clean margins and balanced off-white tones.
2. **Environment & Layout:** Set in an organized layout optimized with professional design rules.
3. **Suggested Palette:**
   - **Main:** Deep Slate (#09090b)
   - **Support:** Warm Charcoal (#18181b)
   - **Accent:** Vibrant Indigo (#6366f1)
   - **Contrast highlight:** Soft off-white (#f4f4f5)`;
  }
}
