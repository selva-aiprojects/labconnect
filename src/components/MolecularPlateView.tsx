/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FlaskConical, Activity, CheckCircle2, AlertTriangle, RefreshCw, 
  Layers, Dna, FileText, Sparkles, Sliders, ChevronRight, BarChart3, 
  TrendingUp, Check, ShieldCheck, Microscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomTheme } from '../types/theme';

interface MolecularPlateViewProps {
  currentTheme: CustomTheme;
  darkMode: boolean;
}

interface WellData {
  wellId: string; // e.g. A1, B3
  sampleId: string;
  type: 'Patient' | 'PosControl' | 'NegControl' | 'Standard' | 'Blank';
  target: 'HIV-1 Viral Load' | 'HCV RNA' | 'COVID-19 RdRp' | 'HPV High-Risk';
  ctValue: number | null; // e.g. 21.4
  viralLoadCopies?: number; // e.g. 45,200 copies/mL
  status: 'Positive' | 'Negative' | 'Valid Control' | 'Invalid';
}

export function MolecularPlateView({ currentTheme, darkMode }: MolecularPlateViewProps) {
  const [selectedWell, setSelectedWell] = useState<string>('A1');
  const [activeAssay, setActiveAssay] = useState<string>('HIV-1 Quantitative RT-PCR');
  const [plateRunActive, setPlateRunActive] = useState(false);

  // Generate 96-well grid mock data (Rows A-H, Cols 1-12)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = Array.from({ length: 12 }, (_, i) => i + 1);

  // Sample well database
  const wellsData: Record<string, WellData> = {
    'A1': { wellId: 'A1', sampleId: 'BAR-99014 (Mr. Test Dummy)', type: 'Patient', target: 'HIV-1 Viral Load', ctValue: 22.4, viralLoadCopies: 48500, status: 'Positive' },
    'A2': { wellId: 'A2', sampleId: 'BAR-44919 (Mrs. Lalitha Devi)', type: 'Patient', target: 'HIV-1 Viral Load', ctValue: null, viralLoadCopies: 0, status: 'Negative' },
    'A3': { wellId: 'A3', sampleId: 'BAR-11881 (Ms. Sarah Vance)', type: 'Patient', target: 'HIV-1 Viral Load', ctValue: 28.1, viralLoadCopies: 1240, status: 'Positive' },
    'A4': { wellId: 'A4', sampleId: 'BAR-33441 (Mr. Arun Joshi)', type: 'Patient', target: 'HIV-1 Viral Load', ctValue: null, viralLoadCopies: 0, status: 'Negative' },
    'A11': { wellId: 'A11', sampleId: 'STD-HIGH-10E6', type: 'Standard', target: 'HIV-1 Viral Load', ctValue: 16.2, viralLoadCopies: 1000000, status: 'Valid Control' },
    'A12': { wellId: 'A12', sampleId: 'STD-LOW-10E2', type: 'Standard', target: 'HIV-1 Viral Load', ctValue: 32.8, viralLoadCopies: 100, status: 'Valid Control' },
    'B1': { wellId: 'B1', sampleId: 'POS-CONTROL-LOT-99', type: 'PosControl', target: 'HIV-1 Viral Load', ctValue: 24.0, status: 'Valid Control' },
    'B2': { wellId: 'B2', sampleId: 'NEG-CONTROL-NTC', type: 'NegControl', target: 'HIV-1 Viral Load', ctValue: null, status: 'Valid Control' }
  };

  const activeWellData: WellData = wellsData[selectedWell] || {
    wellId: selectedWell,
    sampleId: `Sample-${selectedWell}`,
    type: 'Patient',
    target: 'HIV-1 Viral Load',
    ctValue: 26.5,
    viralLoadCopies: 3200,
    status: 'Positive'
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* 1. Header Banner */}
      <div 
        className="p-6 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.borderColor,
          color: currentTheme.textColor
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <Dna className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight" style={{ color: currentTheme.textColor }}>
                Molecular Diagnostics & 96-Well Microplate PCR
              </h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-mono">
                Real-Time PCR / Sigmoidal Ct
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: currentTheme.textMutedColor }}>
              Automated 96/384-well plate layout mapping, cycle threshold (Ct) curve analysis, and quantitative viral load computation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeAssay}
            onChange={(e) => setActiveAssay(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none cursor-pointer"
            style={{
              backgroundColor: darkMode ? '#18181b' : '#f8fafc',
              borderColor: currentTheme.borderColor,
              color: currentTheme.textColor
            }}
          >
            <option value="HIV-1 Quantitative RT-PCR">🧬 HIV-1 Quantitative RT-PCR</option>
            <option value="HCV RNA Viral Load">🧬 HCV RNA Qualitative / Quantitative</option>
            <option value="COVID-19 Multiplex RT-PCR">🧬 SARS-CoV-2 (N1/N2/RdRp) Multiplex</option>
            <option value="HPV High-Risk Genotyping">🧬 HPV 16/18 High-Risk Genotyping</option>
          </select>
        </div>
      </div>

      {/* 2. Main 96-Well Microplate & Curve Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Cols: Interactive 96-Well Microplate Layout */}
        <div 
          className="lg:col-span-7 p-6 rounded-3xl border shadow-sm space-y-4"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
              Microplate 96-Well Matrix Map
            </h3>
            
            {/* Color Legend */}
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Positive</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Negative</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Control / Std</span>
            </div>
          </div>

          {/* Microplate 96-Well Graphic */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <div className="min-w-[480px]">
              {/* Column numbers header */}
              <div className="grid grid-cols-13 gap-1 mb-2 text-center text-[10px] font-mono text-zinc-400 font-bold">
                <div></div>
                {cols.map(c => <div key={c}>{c}</div>)}
              </div>

              {/* Rows A through H */}
              {rows.map(r => (
                <div key={r} className="grid grid-cols-13 gap-1 mb-1.5 items-center">
                  <div className="text-center text-[10px] font-mono text-zinc-400 font-bold">{r}</div>
                  {cols.map(c => {
                    const wellKey = `${r}${c}`;
                    const well = wellsData[wellKey];
                    const isSelected = selectedWell === wellKey;

                    let bgClass = 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
                    if (well?.type === 'PosControl' || well?.type === 'Standard') bgClass = 'bg-indigo-600 text-white font-bold';
                    else if (well?.type === 'NegControl') bgClass = 'bg-zinc-400 text-white';
                    else if (well?.status === 'Positive') bgClass = 'bg-rose-500 text-white font-bold';
                    else if (well?.status === 'Negative') bgClass = 'bg-emerald-500 text-white';

                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedWell(wellKey)}
                        className={`h-7 w-7 rounded-full text-[9px] font-mono flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                          isSelected ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-lg' : 'hover:scale-105 opacity-90'
                        }`}
                        title={`Well ${wellKey}: ${well?.sampleId || 'Empty'}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2">
            <span>Thermal Cycler: <strong>QuantStudio 5 Dx (384/96-Well)</strong></span>
            <span>Target Protocol: <strong>FAM / VIC / Cy5 Multiplex</strong></span>
          </div>
        </div>

        {/* Right 5 Cols: Selected Well Details & Sigmoidal Ct Amplification Curve */}
        <div 
          className="lg:col-span-5 p-6 rounded-3xl border shadow-sm space-y-5"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.borderColor }}>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">Selected Well</span>
              <h3 className="text-base font-black" style={{ color: currentTheme.textColor }}>Well {activeWellData.wellId}</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
              activeWellData.status === 'Positive' ? 'bg-rose-100 text-rose-800' :
              activeWellData.status === 'Negative' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {activeWellData.status}
            </span>
          </div>

          {/* Sample Info */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span style={{ color: currentTheme.textMutedColor }}>Sample Barcode:</span>
              <span className="font-bold font-mono">{activeWellData.sampleId}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: currentTheme.textMutedColor }}>Cycle Threshold (Ct):</span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {activeWellData.ctValue ? `${activeWellData.ctValue} cycles` : 'Undetected (>40)'}
              </span>
            </div>
            {activeWellData.viralLoadCopies !== undefined && (
              <div className="flex justify-between">
                <span style={{ color: currentTheme.textMutedColor }}>Quantitative Viral Load:</span>
                <span className="font-black font-mono text-rose-600">
                  {activeWellData.viralLoadCopies.toLocaleString()} copies / mL
                </span>
              </div>
            )}
          </div>

          {/* Real-time Sigmoidal Amplification Curve Simulation */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 font-mono block">
              Sigmoidal Amplification Curve (ΔRn vs Cycle)
            </span>
            
            <div className="h-44 w-full rounded-2xl bg-zinc-950 p-3 flex flex-col justify-between relative border border-zinc-800">
              {/* Threshold line */}
              <div className="absolute top-[52%] left-0 right-0 border-t border-dashed border-amber-500/60 flex items-center justify-end px-2">
                <span className="text-[8px] font-mono text-amber-400 font-bold bg-zinc-950 px-1">Ct Threshold = 0.20 ΔRn</span>
              </div>

              {/* Simulated Sigmoid SVG Curve */}
              <svg className="h-full w-full overflow-visible" viewBox="0 0 300 120">
                {/* Background Grid */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="#27272a" strokeWidth="1" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#27272a" strokeWidth="1" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="#27272a" strokeWidth="1" />

                {activeWellData.status === 'Positive' ? (
                  <path 
                    d="M 10,110 Q 120,110 160,60 T 290,15" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <path 
                    d="M 10,110 L 290,110" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2.5"
                  />
                )}
              </svg>

              <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-1">
                <span>Cycle 1</span>
                <span>Cycle 20</span>
                <span>Cycle 40</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
