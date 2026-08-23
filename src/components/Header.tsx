/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Activity, Trash2, RefreshCw, Layers } from 'lucide-react';
import { ApiStatus } from '../types';

interface HeaderProps {
  apiStatus: ApiStatus;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onResetWorkspace: () => void;
  isMockActive: boolean;
}

export function Header({
  apiStatus,
  selectedModel,
  onModelChange,
  onResetWorkspace,
  isMockActive
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 id="app-title" className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Gemini AI Workspace
            </h1>
            <p className="text-xs text-zinc-400 font-medium">High-Fidelity Developer & Creative Suite</p>
          </div>
        </div>

        {/* Right Side: Status, Model Select & Workspace Control */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Real-time Connection Status Indicator */}
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs">
            <span className="relative flex h-2 w-2">
              {apiStatus.status === 'checking' ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              ) : !isMockActive ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                apiStatus.status === 'checking' 
                  ? 'bg-yellow-500' 
                  : !isMockActive 
                    ? 'bg-emerald-500' 
                    : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="font-semibold text-zinc-300">
              {apiStatus.status === 'checking' 
                ? 'Verifying Connection...' 
                : !isMockActive 
                  ? 'Live API Active' 
                  : 'Sandbox Mock Mode'}
            </span>
            {apiStatus.latency !== undefined && (
              <span className="text-zinc-500 border-l border-zinc-800 pl-2 flex items-center gap-1">
                <Activity className="h-3 w-3" /> {apiStatus.latency}ms
              </span>
            )}
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
            <span className="text-zinc-500 font-semibold">Model:</span>
            <select 
              id="model-selector"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-zinc-100 cursor-pointer pr-1 focus:text-indigo-400"
            >
              <option value="gemini-3.5-flash" className="bg-zinc-900 text-zinc-200">gemini-3.5-flash</option>
              <option value="gemini-3.1-pro-preview" className="bg-zinc-900 text-zinc-200">gemini-3.1-pro-preview (Paid)</option>
            </select>
          </div>

          {/* Reset Workspace button */}
          <button 
            id="btn-reset-workspace"
            onClick={onResetWorkspace}
            className="px-3 py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg border border-zinc-800 transition-colors text-xs flex items-center gap-1"
            title="Reset all playground workspaces"
          >
            <Trash2 className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

      </div>

      {/* Mock Sandbox Notification Banner */}
      {isMockActive && (
        <div className="max-w-7xl mx-auto mt-3 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 text-amber-300 px-4 py-2 rounded-lg text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-400 flex-shrink-0 animate-bounce" />
            <span>
              <strong>Local Mock Fallback Active:</strong> Run and test your AI workflows instantly! Add your <code className="bg-zinc-900 px-1 py-0.5 rounded text-indigo-300 font-mono">GEMINI_API_KEY</code> in the AI Studio Settings secrets panel to activate live model execution.
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
