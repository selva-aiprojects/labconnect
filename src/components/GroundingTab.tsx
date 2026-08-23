/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, KeyboardEvent } from 'react';
import { Search, Globe, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { GroundingResult } from '../types';

interface GroundingTabProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  onExecute: () => void;
  isLoading: boolean;
  result: GroundingResult | null;
}

export function GroundingTab({
  prompt,
  onPromptChange,
  onExecute,
  isLoading,
  result
}: GroundingTabProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setValidationError('Please enter a query or question to research.');
      return;
    }
    setValidationError(null);
    onExecute();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 p-5 space-y-5 flex flex-col justify-between h-full min-h-[500px] shadow-lg">
      <div className="space-y-4">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-100">Google Search Grounding</h3>
            <p className="text-xs text-zinc-500">Retrieves real-time current events knowledge and citations</p>
          </div>
        </div>

        {/* Input Textarea with Form Validation */}
        <div className="space-y-1.5">
          <label htmlFor="grounding-textarea" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
            Search Prompt / Question
          </label>
          <textarea
            id="grounding-textarea"
            value={prompt}
            onChange={(e) => {
              onPromptChange(e.target.value);
              if (e.target.value.trim()) setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., What are the major outcomes of the latest COP climate summit? or Who won the most recent formula 1 grand prix?"
            rows={3}
            disabled={isLoading}
            className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs rounded-xl border border-zinc-800 p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
          />
          {validationError && (
            <p className="text-[11px] text-rose-400">{validationError}</p>
          )}
        </div>

        {/* Grounding Results Display */}
        {result && (
          <div className="space-y-4 pt-2">
            
            {/* Generated text with citations */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-3 max-h-[300px] overflow-y-auto">
              <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {result.text}
              </div>

              {/* Executed Queries */}
              {result.searchQueries && result.searchQueries.length > 0 && (
                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                    Executed Search Queries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.searchQueries.map((query, idx) => (
                      <span key={idx} className="bg-indigo-950/40 border border-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        "{query}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Web Links */}
              {result.searchChunks && result.searchChunks.length > 0 && (
                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified Grounded Web Sources
                  </span>
                  <div className="space-y-1.5">
                    {result.searchChunks.map((chunk, idx) => {
                      if (!chunk.web) return null;
                      return (
                        <a 
                          key={idx} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block p-2 bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors group/link"
                        >
                          <span className="font-bold text-indigo-400 block truncate flex items-center gap-1">
                            {chunk.web.title} <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </span>
                          <span className="text-[10px] text-zinc-500 block truncate font-mono mt-0.5">{chunk.web.uri}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Execute Research Button */}
      <button
        id="btn-execute-grounding"
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors cursor-pointer"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
            Analyzing with Search Grounding...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Execute Grounded Query
          </>
        )}
      </button>

    </div>
  );
}
