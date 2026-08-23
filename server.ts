/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it via the Secrets panel in the AI Studio UI.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Helper to format messages into GoogleGenAI Content format
  // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
  const formatMessages = (messages: any[]) => {
    return messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  };

  // API Check Status
  app.get('/api/status', (req, res) => {
    res.json({
      status: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    });
  });

  // API Chat Stream (Server-Sent Events)
  app.post('/api/chat/stream', async (req, res) => {
    const { messages, systemInstruction, temperature, topP, model } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const ai = getGeminiClient();
      const formatted = formatMessages(messages || []);
      
      const responseStream = await ai.models.generateContentStream({
        model: model || 'gemini-3.5-flash',
        contents: formatted,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: temperature !== undefined ? Number(temperature) : undefined,
          topP: topP !== undefined ? Number(topP) : undefined,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Gemini stream error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message || 'An error occurred during generation' })}\n\n`);
      res.end();
    }
  });

  // API Grounding
  app.post('/api/generate/grounding', async (req, res) => {
    const { prompt, model } = req.body;
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: model || 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const searchChunks = groundingMetadata?.groundingChunks || [];
      const searchQueries = groundingMetadata?.webSearchQueries || [];

      res.json({ text, searchChunks, searchQueries });
    } catch (error: any) {
      console.error('Grounding error:', error);
      res.status(500).json({ error: error.message || 'Grounding analysis failed' });
    }
  });

  // API Structured Generation
  app.post('/api/generate/structured', async (req, res) => {
    const { prompt, schemaDescription, fields, model } = req.body;

    if (!prompt || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ error: 'Missing prompt or fields array' });
    }

    try {
      const ai = getGeminiClient();
      const properties: Record<string, any> = {};
      const required: string[] = [];

      fields.forEach((f: any) => {
        let typeVal = Type.STRING;
        if (f.type === 'number') typeVal = Type.NUMBER;
        else if (f.type === 'boolean') typeVal = Type.BOOLEAN;
        else if (f.type === 'array') {
          properties[f.name] = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: f.description || '',
          };
          required.push(f.name);
          return;
        }

        properties[f.name] = {
          type: typeVal,
          description: f.description || '',
        };
        required.push(f.name);
      });

      const response = await ai.models.generateContent({
        model: model || 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: schemaDescription || 'List of generated objects',
            items: {
              type: Type.OBJECT,
              properties,
              required,
            },
          },
        },
      });

      const parsedData = JSON.parse(response.text || '[]');
      res.json({ data: parsedData });
    } catch (error: any) {
      console.error('Structured generation error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate structured data' });
    }
  });

  // API Multimodal (Image Analysis)
  app.post('/api/generate/multimodal', async (req, res) => {
    const { prompt, imageBase64, mimeType, model } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data' });
    }

    try {
      const ai = getGeminiClient();
      // Remove data URL prefix if present (e.g. "data:image/png;base64,")
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/png',
        },
      };

      const textPart = {
        text: prompt || 'Describe this image and identify its main subjects.',
      };

      const response = await ai.models.generateContent({
        model: model || 'gemini-3.5-flash',
        contents: { parts: [imagePart, textPart] },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Multimodal error:', error);
      res.status(500).json({ error: error.message || 'Multimodal analysis failed' });
    }
  });

  // Static Assets or Vite Server Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('.', 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
