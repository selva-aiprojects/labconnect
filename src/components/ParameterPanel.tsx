/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sliders, Shield, Terminal, Binary, Sparkles } from 'lucide-react';
import { SystemPreset } from '../types';

interface ParameterPanelProps {
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  presets: SystemPreset[];
}

export function ParameterPanel({
  temperature,
  onTemperatureChange,
  systemPrompt,
  onSystemPromptChange,
  presets
}: ParameterPanelProps) {
  return (
    <div className="bg-zinc-950/80 px-5 py-3.5 border-b border-zinc-800/60 flex flex-col gap-4 text-xs">
      
      {/* Parameter Sliders */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Sliders className="h-4 w-4 text-zinc-500" /> Model Fine-Tuning
          </span>
          
          <div className="flex items-center gap-3 flex-1 md:flex-initial">
            <span className="text-zinc-400 font-medium min-w-[100px]">Temperature ({temperature})</span>
            <input 
              id="slider-temp"
              type="range" 
              min="0" 
              max="1.5" 
              step="0.1" 
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="flex-1 md:w-44 accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Quick System Preset Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-medium">Role Preset:</span>
          <div className="flex items-center gap-1.5 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            {presets.map((preset) => {
              const isActive = systemPrompt === preset.prompt;
              return (
                <button
                  key={preset.name}
                  id={`preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSystemPromptChange(preset.prompt)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Editable Active System Instructions with Input Validation */}
      <div className="space-y-1.5">
        <label htmlFor="system-instructions" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-zinc-500" /> Current System Context / Behavioral Guidelines
        </label>
        <textarea
          id="system-instructions"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="Enter custom instructions or instructions for your agent..."
          rows={2}
          className="w-full bg-zinc-900/60 text-zinc-200 placeholder-zinc-600 text-xs rounded-xl border border-zinc-800/80 p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
        />
        {systemPrompt.trim().length === 0 && (
          <p className="text-[10px] text-rose-400">Warning: Empty instructions might cause the model to behave less predictably.</p>
        )}
      </div>

    </div>
  );
}
