/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, DragEvent, ChangeEvent } from 'react';
import { Image as ImageIcon, X, RefreshCw, AlertTriangle, HelpCircle } from 'lucide-react';

interface VisionAnalyzerProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  imageBase64: string | null;
  onImageChange: (base64: string | null, mime: string) => void;
  onExecute: () => void;
  isLoading: boolean;
  result: string | null;
}

export function VisionAnalyzer({
  prompt,
  onPromptChange,
  imageBase64,
  onImageChange,
  onExecute,
  isLoading,
  result
}: VisionAnalyzerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = (file: File) => {
    // Validation 1: MIME Type Check
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Unsupported file format. Please upload a valid image (PNG, JPG, WebP).');
      return;
    }

    // Validation 2: Size limit check (max 5MB to preserve stable API payload sizes)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('The selected image is too large. Please select an image smaller than 5MB.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageChange(e.target.result as string, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const executeAnalysis = () => {
    if (!imageBase64) {
      setErrorMessage('Please upload or drag an image into the dropzone first.');
      return;
    }
    setErrorMessage(null);
    onExecute();
  };

  return (
    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 p-5 space-y-4 flex flex-col justify-between h-full min-h-[500px] shadow-lg">
      <div className="space-y-4">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-100">Multimodal Vision</h3>
            <p className="text-xs text-zinc-500">Combines visual context with textual prompts for reasoning</p>
          </div>
        </div>

        {/* Drag-and-Drop Image Box */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5' 
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 hover:bg-zinc-950'
          }`}
        >
          <input 
            id="vision-file-input"
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 w-full cursor-pointer h-full"
          />
          {imageBase64 ? (
            <div className="relative inline-block max-w-full">
              <img 
                src={imageBase64} 
                alt="Uploaded source" 
                className="max-h-32 rounded-lg border border-zinc-800 mx-auto object-cover"
              />
              <button
                id="btn-clear-image"
                onClick={(e) => {
                  e.preventDefault();
                  onImageChange(null, 'image/png');
                }}
                className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1.5 shadow-lg"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <ImageIcon className="h-10 w-10 text-zinc-500 mx-auto animate-pulse" />
              <p className="text-xs text-zinc-300 font-bold">Drag & drop your image here</p>
              <p className="text-[10px] text-zinc-500 font-medium">PNG, JPG, WEBP formats supported (Max 5MB)</p>
            </div>
          )}
        </div>

        {/* Input Text Box */}
        <div className="space-y-1">
          <label htmlFor="vision-prompt-input" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
            Visual Analysis Prompt <HelpCircle className="h-3 w-3 text-zinc-600" title="Instruct the model what specific details to analyze in the visual frame" />
          </label>
          <input
            id="vision-prompt-input"
            type="text"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., Extract code snippet, suggest color palette, find defects..."
            className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs rounded-xl border border-zinc-800 p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Validation / Format Errors */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Vision Analysis Outcomes */}
        {result && (
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 max-h-[180px] overflow-y-auto">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">
              Gemini Vision Reasoner Response
            </span>
            <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
              {result}
            </div>
          </div>
        )}

      </div>

      {/* Trigger Button */}
      <button
        id="btn-execute-vision"
        onClick={executeAnalysis}
        disabled={isLoading || !imageBase64}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors cursor-pointer"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
            Decoding Vision Pixels...
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            Analyze Visual Frame
          </>
        )}
      </button>

    </div>
  );
}
