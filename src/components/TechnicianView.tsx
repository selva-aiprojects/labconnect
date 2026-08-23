/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Cpu, RefreshCw, Play, CheckCircle2, AlertTriangle, Layers, Database, Sparkles } from 'lucide-react';
import { Patient, Analyzer } from '../types/lims_app';

interface TechnicianViewProps {
  patients: Patient[];
  onCompleteTesting: (id: string, testResults: string) => void;
}

export function TechnicianView({ patients, onCompleteTesting }: TechnicianViewProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [activeAnalyzer, setActiveAnalyzer] = useState<string>('Erba H-560');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logFeed, setLogFeed] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const processingPatients = patients.filter(p => p.status === 'In Progress');
  const activePatient = patients.find(p => p.id === selectedId) || processingPatients[0];

  // Erba Analyzers list
  const analyzers: Analyzer[] = [
    { name: 'Erba XL-200', type: 'Clinical Chemistry Suite', status: 'online', load: 68, reagentLevel: 91 },
    { name: 'Erba XL-640', type: 'High-Throughput Biochemistry', status: 'online', load: 84, reagentLevel: 72 },
    { name: 'Erba H-560', type: '5-Part Hematology System', status: 'online', load: 42, reagentLevel: 88 },
    { name: 'Erba ECL-760', type: 'Automated Coagulation Analyzer', status: 'maintenance', load: 0, reagentLevel: 45 }
  ];

  // Simulated log steps
  const testSteps = [
    'Preparing centrifuge at 3,500 RPM...',
    'Interfacing with LIMS DB... Scanning specimen barcode ID...',
    'Aspirating specimen into reaction cup...',
    'Adding specific Erba reagents for assay panel...',
    'Incubating assay at 37°C controlled temperature...',
    'Performing multi-wavelength photometric sensor sweep...',
    'Compiling clinical analyte measurements against reference controls...',
    'Transmitting verified results via LIMS bidirectional protocol...'
  ];

  const handleStartTesting = (patient: Patient) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setLogFeed(['Initializing Erba Analyzer pipeline...', `Assigning specimen to ${activeAnalyzer}...`]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < testSteps.length) {
        setLogFeed(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${testSteps[step]}`]);
        setProgress(Math.round(((step + 1) / testSteps.length) * 100));
        step++;
      } else {
        clearInterval(interval);
        
        // Formulate clinical results depending on the test panel
        let results = '';
        if (patient.testPanel.includes('CBC')) {
          results = 'Hemoglobin: 14.2 g/dL (Normal: 12.0-16.0) | WBC Count: 6.8 x10^3/uL (Normal: 4.0-11.0) | Platelets: 245 x10^3/uL (Normal: 150-450)';
        } else if (patient.testPanel.includes('Glucose') || patient.testPanel.includes('HbA1c')) {
          results = 'HbA1c: 5.6% (Normal: < 5.7%) | Fasting Plasma Glucose: 92 mg/dL (Normal: 70-100)';
        } else if (patient.testPanel.includes('Lipid') || patient.testPanel.includes('Liver')) {
          results = 'Total Cholesterol: 185 mg/dL (Normal: < 200) | Triglycerides: 142 mg/dL (Normal: < 150) | ALT (SGPT): 24 U/L (Normal: 7-56) | AST (SGOT): 28 U/L (Normal: 10-40)';
        } else {
          results = 'TSH Assay: 2.1 mIU/L (Normal: 0.4-4.0) | Free T4: 1.2 ng/dL (Normal: 0.8-1.8)';
        }

        onCompleteTesting(patient.id, results);
        setLogFeed(prev => [...prev, '✓ Clinical testing sequence completed!', 'Transmission successful. Specimen status changed to "Completed".']);
        setIsProcessing(false);
        alert(`Clinical results synthesized successfully by ${activeAnalyzer} for ${patient.name}!`);
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Block */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#3c3bb6]/5 dark:bg-indigo-950/40 text-[#3c3bb6] dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Analyzer & Testing Bench</h2>
            <p className="text-[11px] text-zinc-400 font-medium font-sans">Manage connected Erba clinical diagnostics, feed specimens, run calibrations, and monitor processing logs.</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1.5 rounded-xl border border-emerald-100/30">
          Hardware Link: Active
        </span>
      </div>

      {/* Grid: Connected Analyzers list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyzers.map(item => (
          <div 
            key={item.name} 
            className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wide">{item.type}</span>
              <span className={`inline-flex h-2 w-2 rounded-full ${
                item.status === 'online' ? 'bg-emerald-500' : item.status === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">{item.name}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-bold text-zinc-500">
                <div>
                  <span className="block text-zinc-400 font-medium">Reagents:</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-300">{item.reagentLevel}%</span>
                </div>
                <div>
                  <span className="block text-zinc-400 font-medium">Duty Load:</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-300">{item.load}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {processingPatients.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">Testing Queue Clear</h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
            There are no specimens currently in "In Progress" status waiting to be fed to the analyzers. Please collect samples first using the Phlebotomy workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* List of specimens to process (4 of 12) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Specimens In-Progress ({processingPatients.length})</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {processingPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (!isProcessing) {
                      setSelectedId(p.id);
                      setLogFeed([]);
                      setProgress(0);
                    }
                  }}
                  disabled={isProcessing}
                  className={`w-full p-4 text-left block transition-all cursor-pointer ${
                    activePatient?.id === p.id
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/10 border-l-4 border-indigo-600'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-950/20'
                  }`}
                >
                  <span className="block font-bold text-zinc-900 dark:text-zinc-100 text-xs">{p.name}</span>
                  <span className="block text-[10px] text-zinc-400 mt-1">Tube: {p.bookingNo} &bull; Panel: {p.testPanel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Interactive Bench (8 of 12) */}
          {activePatient && (
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Assigned Assay</span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{activePatient.testPanel}</h3>
                  <p className="text-[10px] text-zinc-400">Patient: {activePatient.name} &bull; Contact: {activePatient.contactNo}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Analyzer:</span>
                  <select
                    value={activeAnalyzer}
                    onChange={(e) => setActiveAnalyzer(e.target.value)}
                    disabled={isProcessing}
                    className="bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <option value="Erba H-560">Erba H-560 Hematology Suite</option>
                    <option value="Erba XL-200">Erba XL-200 Chemistry Bench</option>
                    <option value="Erba XL-640">Erba XL-640 Chemistry Suite</option>
                  </select>
                </div>
              </div>

              {/* Terminal Log Output */}
              <div className="bg-zinc-950 text-zinc-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed space-y-1.5 min-h-[220px] max-h-[300px] overflow-y-auto shadow-inner border border-zinc-900">
                {logFeed.length === 0 ? (
                  <div className="text-zinc-500 italic h-full flex items-center justify-center py-16">
                    Analyzer idling. Press "Execute Assay Suite" to begin automated chromatography & chemistry.
                  </div>
                ) : (
                  logFeed.map((log, index) => (
                    <div key={index} className={log.startsWith('✓') ? 'text-emerald-400 font-semibold' : 'text-zinc-300'}>
                      {log}
                    </div>
                  ))
                )}
              </div>

              {/* Progress bar */}
              {isProcessing && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 font-mono">
                    <span>Analyzer Duty Cycle:</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Footer controllers */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleStartTesting(activePatient)}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-[#3c3bb6] hover:bg-[#31309c] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-850 dark:disabled:text-zinc-600 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Execute Analyzer Sequence</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
