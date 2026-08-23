/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LucideIcon } from 'lucide-react';

export type WorkspaceTab = 'chat' | 'grounding' | 'structured' | 'multimodal';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SystemPreset {
  name: string;
  prompt: string;
  icon: LucideIcon | string; // Handle Lucide icons or dynamic lookup
  description: string;
}

export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
}

export interface GroundingResult {
  text: string;
  searchQueries: string[];
  searchChunks: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
}

export interface ApiStatus {
  status: 'checking' | 'configured' | 'missing';
  environment: string;
  latency?: number;
}
