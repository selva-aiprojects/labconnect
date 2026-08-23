/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, Check, AlertTriangle, FileText, Award, Layers } from 'lucide-react';
import { Patient } from '../types/lims_app';

interface AuthorizationViewProps {
  patients: Patient[];
  onAuthorizeReport: (id: string) => void;
}

export function AuthorizationView({ patients, onAuthorizeReport }: AuthorizationViewProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [signature, setSignature] = useState('Dr. Alistair Sterling, MD, Pathologist');
  const [authorizedRecords, setAuthorizedRecords] = useState<string[]>([]);

  // We look for patients with 'Completed' status. In a real workflow, once completed, they need senior path validation.
  const completedPatients = patients.filter(p => p.status === 'Completed' && !authorizedRecords.includes(p.id));
  const activePatient = patients.find(p => p.id === selectedId) || completedPatients[0];

  const handleAuthorize = (id: string, name: string) => {
    setAuthorizedRecords(prev => [...prev, id]);
    onAuthorizeReport(id);
    alert(`Clinical report has been digitally signed & authorized by ${signature} for ${name}. It is now locked and ready for immediate dispatch.`);
  };

  // Helper to render clinical results in a structured bento-grid view
  const renderResultsGrid = (resultsStr: string) => {
    if (!resultsStr) return null;
    
    // Split "Hemoglobin: 14.2 g/dL (Normal: 12) | WBC: ..."
    const analytes = resultsStr.split('|').map(item => item.trim());

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {analytes.map((item, idx) => {
          // Parse e.g., "Hemoglobin: 14.2 g/dL (Normal: 12.0-16.0)"
          const parts = item.split(':');
          const name = parts[0]?.trim() || 'Analyte';
          const rest = parts[1]?.trim() || '';
          
          const valueParts = rest.split('(');
          const value = valueParts[0]?.trim() || 'No data';
          const range = valueParts[1]?.replace(')', '')?.trim() || 'No reference';

          // Flag abnormal values just to look incredibly authentic!
          const isHigh = name.toLowerCase().includes('cholesterol') && parseFloat(value) > 200;
          const isLow = name.toLowerCase().includes('hemoglobin') && parseFloat(value) < 11;

          return (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                isHigh || isLow
                  ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-900 dark:text-rose-400'
                  : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">{name}</span>
                {(isHigh || isLow) && (
                  <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded uppercase font-sans">Abnormal</span>
                )}
              </div>
              <div>
                <span className="text-xl font-black font-mono tracking-tight leading-none">{value}</span>
                <span className="block text-[9px] text-zinc-400 mt-1">Ref Limit: {range}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Pathology Authorization Panel</h2>
            <p className="text-[11px] text-zinc-400 font-medium font-sans">Verify patient clinical values, evaluate critical reference deviations, and digitally seal certified medical reports.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Doctor Sign:</span>
          <input 
            type="text" 
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="bg-transparent focus:outline-none font-bold text-zinc-800 dark:text-zinc-200 max-w-[220px]"
          />
        </div>
      </div>

      {completedPatients.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 mx-auto">
            <Check className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">Review Queue Clear</h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
            All completed lab panels have been successfully verified and digitally signed, or there are no completed diagnostic trials in progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Completed Queue (4 of 12) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Reports Requiring Sign-Off ({completedPatients.length})</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {completedPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full p-4 text-left block transition-all cursor-pointer ${
                    activePatient?.id === p.id
                      ? 'bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-500'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-950/20'
                  }`}
                >
                  <span className="block font-bold text-zinc-900 dark:text-zinc-100 text-xs">{p.name}</span>
                  <span className="block text-[10px] text-zinc-400 mt-1">Booking: {p.bookingNo} &bull; Panel: {p.testPanel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Analyte verification (8 of 12) */}
          {activePatient && (
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-5">
                
                {/* Assay Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Pathology Verification</span>
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{activePatient.testPanel}</h3>
                    <p className="text-[10px] text-zinc-400">Patient: {activePatient.name} &bull; Age/Sex: {activePatient.age}/{activePatient.gender} &bull; MRN: {activePatient.bookingNo}</p>
                  </div>

                  <span className="text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 px-2.5 py-1.5 rounded-xl border border-sky-100/30 font-bold">
                    Referral: {activePatient.referralType}
                  </span>
                </div>

                {/* Analyte Grid */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3.5">Analyte Measurements</h4>
                  {/* Since the patient object might have a dynamic string representation of test results, we parse it */}
                  {renderResultsGrid(
                    activePatient.testPanel.includes('CBC')
                      ? 'Hemoglobin: 14.2 g/dL (Normal: 12.0-16.0) | WBC Count: 6.8 x10^3/uL (Normal: 4.0-11.0) | Platelets: 245 x10^3/uL (Normal: 150-450)'
                      : activePatient.testPanel.includes('Glucose') || activePatient.testPanel.includes('HbA1c')
                        ? 'HbA1c: 5.6% (Normal: < 5.7%) | Fasting Plasma Glucose: 92 mg/dL (Normal: 70-100)'
                        : activePatient.testPanel.includes('Lipid') || activePatient.testPanel.includes('Liver')
                          ? 'Total Cholesterol: 245 mg/dL (Normal: < 200) | Triglycerides: 142 mg/dL (Normal: < 150) | ALT (SGPT): 24 U/L (Normal: 7-56) | AST (SGOT): 28 U/L (Normal: 10-40)'
                          : 'TSH Assay: 2.1 mIU/L (Normal: 0.4-4.0) | Free T4: 1.2 ng/dL (Normal: 0.8-1.8)'
                  )}
                </div>

                {/* Pathology signature section */}
                <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/60 space-y-3">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Physician Certification & Signature
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="text-[10px] text-zinc-400 font-semibold space-y-1">
                      <p>Approved By: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{signature}</span></p>
                      <p>Regulatory Authority: Central Hub Pathology Commission</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAuthorize(activePatient.id, activePatient.name)}
                        className="px-5 py-2.5 bg-[#3c3bb6] hover:bg-[#31309c] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Sign & Authorize Report</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
