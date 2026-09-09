/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FlaskConical, Check, Play, RefreshCw, Printer, AlertTriangle, HelpCircle, FileText } from 'lucide-react';
import { Patient } from '../types/lims_app';
import { TechnicianRecord } from '../types/technicians';

interface PhlebotomyViewProps {
  patients: Patient[];
  technicians: TechnicianRecord[];
  onCollectSample: (id: string, phlebName: string) => void;
  onPrintBarcode: (id: string, bookingNo: string) => void;
  printedBarcodes: string[];
  isPrinting: string | null;
}

export function PhlebotomyView({ 
  patients, 
  technicians,
  onCollectSample, 
  onPrintBarcode,
  printedBarcodes,
  isPrinting
}: PhlebotomyViewProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [phlebName, setPhlebName] = useState(technicians.find(technician => technician.active)?.name || '');
  
  // Tube draw state guide
  const [drawnTubes, setDrawnTubes] = useState<Record<string, boolean>>({});

  const pendingPatients = patients.filter(p => p.status === 'Pending');
  const activePatient = patients.find(p => p.id === selectedId) || pendingPatients[0];

  // Map panels to CLSI tubes
  const getTubeGuide = (panel: string) => {
    if (panel.includes('CBC')) return { color: 'bg-indigo-600 text-white', label: 'Lavender Tube (EDTA Whole Blood)', steps: 'Invert 8-10 times to prevent clotting.' };
    if (panel.includes('Glucose') || panel.includes('HbA1c')) return { color: 'bg-zinc-400 text-zinc-900', label: 'Gray Tube (Sodium Fluoride)', steps: 'Invert 8 times. Preserves glucose up to 24 hours.' };
    if (panel.includes('Lipid') || panel.includes('Liver')) return { color: 'bg-amber-500 text-white', label: 'Gold Tube (SST Gel Separator)', steps: 'Invert 5 times. Allow to clot for 30 mins before centrifuge.' };
    if (panel.includes('Thyroid') || panel.includes('TSH')) return { color: 'bg-red-600 text-white', label: 'Red Tube (Serum Clot Activator)', steps: 'Invert 5 times. Clots in 30-60 mins.' };
    if (panel.includes('Troponin')) return { color: 'bg-emerald-600 text-white', label: 'Light Green Tube (Lithium Heparin PST)', steps: 'Invert 8-10 times. Spin immediately.' };
    return { color: 'bg-rose-600 text-white', label: 'Yellow Tube (Acid Citrate Dextrose)', steps: 'Invert 8 times.' };
  };

  const handleDrawSpecimen = (id: string) => {
    if (!phlebName.trim()) {
      alert('Please select or specify a collecting phlebotomist.');
      return;
    }
    onCollectSample(id, phlebName);
    setDrawnTubes({});
    alert(`Specimen drawn successfully for Booking #${activePatient.bookingNo}! Specimen barcode printed. Status changed to "In Progress".`);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FlaskConical className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Phlebotomy Specimen Station</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Verify patient identities, review CLSI safety directives, collect blood samples, and print barcodes.</p>
          </div>
        </div>

        {/* Phlebotomist selector */}
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Collector:</span>
          <select 
            value={phlebName}
            onChange={(e) => setPhlebName(e.target.value)}
            className="bg-transparent focus:outline-none text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            {technicians.filter(technician => technician.active).map(technician => <option key={technician.id} value={technician.name}>{technician.name} ({technician.role})</option>)}
          </select>
        </div>
      </div>

      {pendingPatients.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">No Pending Samples</h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs max-w-sm mx-auto">
            All registered patients have had their specimens successfully collected, or there are no active patient records. Register a new patient to begin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Patient Queue (4 of 12) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Specimen Queue ({pendingPatients.length})</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[450px] overflow-y-auto">
              {pendingPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full p-4 text-left block transition-colors cursor-pointer ${
                    activePatient?.id === p.id
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-l-4 border-emerald-500'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-xs">{p.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      p.priority === 'STAT' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                    }`}>{p.priority}</span>
                  </div>
                  <span className="block text-[10px] text-zinc-400 mt-1">ID: {p.bookingNo} &bull; Age: {p.age}</span>
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">{p.testPanel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Collection Panel (8 of 12) */}
          {activePatient && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Patient Core Card */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{activePatient.name}</h3>
                    <p className="text-[10px] text-zinc-400">MRN: {activePatient.bookingNo} &bull; Sex: {activePatient.gender} &bull; Age: {activePatient.age} Yrs</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPrintBarcode(activePatient.id, activePatient.bookingNo)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        printedBarcodes.includes(activePatient.id)
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-white hover:bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {isPrinting === activePatient.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Printer className="h-3.5 w-3.5" />
                      )}
                      <span>Print Label</span>
                    </button>
                  </div>
                </div>

                {/* Draw Specimen Guidelines & Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* CLSI Standard Instruction */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Safety & Specimen Guide</h4>
                    
                    {/* Tube selection badge */}
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full border border-zinc-300 ${getTubeGuide(activePatient.testPanel).color}`} />
                        <span className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200">{getTubeGuide(activePatient.testPanel).label}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                        <strong>Protocol:</strong> {getTubeGuide(activePatient.testPanel).steps}
                      </p>
                    </div>

                    <div className="space-y-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold leading-normal">
                      <p className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Verify double identifier (Full Name + DOB).
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Apply tourniquet maximum 1 minute to prevent hemoconcentration.
                      </p>
                    </div>
                  </div>

                  {/* Order of Draw Checklist */}
                  <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">CLSI Sequence Checklist</h4>
                      <span className="text-[9px] text-[#3c3bb6] font-bold">Standard</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { tube: 'Yellow/Blue', name: 'Coagulation Tube' },
                        { tube: 'SST/Gold/Red', name: 'Serum Tube with Clot Activator' },
                        { tube: 'EDTA/Lavender', name: 'Whole Blood (CBC) Tube' },
                        { tube: 'Gray', name: 'Glycolytic Tube' },
                      ].map((item, index) => {
                        const key = `${activePatient.id}-${index}`;
                        const isChecked = drawnTubes[key] || false;
                        return (
                          <label 
                            key={index} 
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[10px] text-zinc-400 font-mono">#{index+1}</span>
                              <span>{item.name}</span>
                            </span>
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={(e) => setDrawnTubes({ ...drawnTubes, [key]: e.target.checked })}
                              className="rounded border-zinc-300 text-[#3c3bb6] focus:ring-[#3c3bb6] h-4 w-4"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Final Drawer Trigger */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-end">
                  <button
                    onClick={() => handleDrawSpecimen(activePatient.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/10 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Collect & Log Specimen Draw</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
