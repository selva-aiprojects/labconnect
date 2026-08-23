/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Binary, Plus, X, RefreshCw, Copy, Check, AlertTriangle } from 'lucide-react';
import { SchemaField } from '../types';

interface SchemaGeneratorProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  fields: SchemaField[];
  onFieldsChange: (fields: SchemaField[]) => void;
  onExecute: () => void;
  isLoading: boolean;
  result: any;
}

export function SchemaGenerator({
  prompt,
  onPromptChange,
  fields,
  onFieldsChange,
  onExecute,
  isLoading,
  result
}: SchemaGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const addField = () => {
    onFieldsChange([...fields, { name: '', type: 'string', description: '' }]);
  };

  const removeField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: 'name' | 'type' | 'description', value: any) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    onFieldsChange(updated);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateAndGenerate = () => {
    const errors: string[] = [];

    if (!prompt.trim()) {
      errors.push('Please describe the context/record type you wish to generate.');
    }

    if (fields.length === 0) {
      errors.push('Please specify at least one target schema column/field.');
    }

    const keys = fields.map(f => f.name.trim());
    
    fields.forEach((f, idx) => {
      if (!f.name.trim()) {
        errors.push(`Field #${idx + 1} is missing a Key/Name.`);
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(f.name.trim())) {
        errors.push(`Field "${f.name}" contains invalid characters. Use alphanumeric keys only (starting with a letter or underscore).`);
      }
      if (!f.description.trim()) {
        errors.push(`Field "${f.name || '#' + (idx + 1)}" is missing a description or generation rule.`);
      }
    });

    const duplicates = keys.filter((item, index) => keys.indexOf(item) !== index);
    if (duplicates.length > 0 && duplicates[0] !== '') {
      errors.push(`Duplicate keys detected: ${Array.from(new Set(duplicates)).join(', ')}.`);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onExecute();
  };

  return (
    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 p-5 space-y-4 flex flex-col justify-between h-full min-h-[500px] shadow-lg">
      <div className="space-y-4">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Binary className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-100">Strict JSON Generator</h3>
            <p className="text-xs text-zinc-500">Enforces deterministic, strictly-typed JSON record arrays</p>
          </div>
        </div>

        {/* Input Prompts */}
        <div className="space-y-1">
          <label htmlFor="schema-context-textarea" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
            Dataset Context Description
          </label>
          <textarea
            id="schema-context-textarea"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., List of 3 high-performance electric mountain bikes under $8000"
            rows={2}
            className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs rounded-xl border border-zinc-800 p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
          />
        </div>

        {/* Dynamic Schema builder list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Schema Fields / Columns</span>
            <button 
              id="btn-add-schema-field"
              onClick={addField}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
            >
              <Plus className="h-4 w-4" /> Add Field
            </button>
          </div>

          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {fields.map((field, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-zinc-950 p-2 rounded-xl border border-zinc-800/80">
                <input 
                  id={`field-name-${idx}`}
                  type="text"
                  value={field.name}
                  placeholder="Key (e.g. price)"
                  onChange={(e) => updateField(idx, 'name', e.target.value)}
                  className="w-1/4 bg-zinc-900 text-[11px] font-mono rounded border border-zinc-800 p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-100"
                />
                
                <select 
                  id={`field-type-${idx}`}
                  value={field.type}
                  onChange={(e) => updateField(idx, 'type', e.target.value)}
                  className="w-1/4 bg-zinc-900 text-[11px] rounded border border-zinc-800 p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-300 font-semibold"
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="array">array</option>
                </select>

                <input 
                  id={`field-description-${idx}`}
                  type="text"
                  value={field.description}
                  placeholder="Rule (e.g. Value in USD)"
                  onChange={(e) => updateField(idx, 'description', e.target.value)}
                  className="flex-1 bg-zinc-900 text-[11px] rounded border border-zinc-800 p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-200"
                />

                <button 
                  id={`btn-remove-field-${idx}`}
                  onClick={() => removeField(idx)}
                  className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-lg"
                  title="Remove column"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Errors Overlay */}
        {validationErrors.length > 0 && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1 font-bold">
              <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>Please resolve schema constraints:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 opacity-90 text-[11px]">
              {validationErrors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
              {validationErrors.length > 3 && <li>And {validationErrors.length - 3} more issue(s)...</li>}
            </ul>
          </div>
        )}

        {/* Results JSON Output preview */}
        {result && (
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">response_dataset.json</span>
              <button
                id="btn-copy-schema-json"
                onClick={handleCopy}
                className="p-1 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />} Copy JSON
              </button>
            </div>
            <pre className="text-[11px] text-indigo-300 overflow-x-auto max-h-[160px] leading-tight font-mono whitespace-pre scrollbar-thin">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>

      {/* Execution Trigger */}
      <button
        id="btn-execute-schema"
        onClick={validateAndGenerate}
        disabled={isLoading || !prompt.trim() || fields.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors cursor-pointer"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
            Generating Structured Schema...
          </>
        ) : (
          <>
            <Binary className="h-4 w-4" />
            Generate Structured Dataset
          </>
        )}
      </button>

    </div>
  );
}
