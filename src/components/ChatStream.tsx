/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect, useState, FormEvent, KeyboardEvent } from 'react';
import { MessageSquare, Sparkles, Send, Copy, Check, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface ChatStreamProps {
  messages: Message[];
  input: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  isStreaming: boolean;
  apiKeyMissing: boolean;
}

export function ChatStream({
  messages,
  input,
  onInputChange,
  onSendMessage,
  isStreaming,
  apiKeyMissing
}: ChatStreamProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/10">
      
      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm relative group transition-all duration-200 border ${
                  isUser 
                    ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                    : 'bg-zinc-900/90 text-zinc-100 border-zinc-800/80 rounded-tl-none shadow-md shadow-black/20'
                }`}>
                  
                  {/* Copy Button (Visible on Hover / Focused) */}
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
                      isUser 
                        ? 'bg-indigo-700/60 hover:bg-indigo-700 text-indigo-200 hover:text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                    } opacity-0 group-hover:opacity-100 focus:opacity-100`}
                    title="Copy message to clipboard"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Header metadata label */}
                  <div className={`flex items-center gap-1.5 text-[11px] mb-1.5 font-bold ${
                    isUser ? 'text-indigo-200' : 'text-zinc-400'
                  }`}>
                    {isUser ? (
                      <span>USER WORKSPACE</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" /> GEMINI GENERATION
                      </span>
                    )}
                    <span className="opacity-50 text-[10px] font-normal">&bull; {msg.timestamp}</span>
                  </div>

                  {/* Render content simply or placeholder when empty stream */}
                  <div className="whitespace-pre-wrap leading-relaxed break-words font-sans">
                    {msg.content ? (
                      msg.content
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                        Awaiting streamed blocks...
                      </span>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Submit form */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 backdrop-blur-sm">
        
        {apiKeyMissing && (
          <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span>
              Sandbox notice: Offline mode active. Generated chat responses will use localized mock data fallback.
            </span>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex gap-2 relative items-end">
          <textarea
            id="chat-textarea"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini to build code, outline schemas, or refine algorithms... (Enter to send, Shift+Enter for newline)"
            rows={2}
            disabled={isStreaming}
            className="flex-1 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl border border-zinc-800 p-3.5 pr-12 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none min-h-[50px] transition-all"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-3.5 bottom-3.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-zinc-800 disabled:text-zinc-600"
            title="Stream message"
          >
            {isStreaming ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
