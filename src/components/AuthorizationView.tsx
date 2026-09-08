/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, Check, Award, FileText } from 'lucide-react';
import { Patient } from '../types/lims_app';
import { LabReport } from './LabReport';

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

          {/* Right Panel: Real report preview (8 of 12) */}
          {activePatient && (
            <div className="lg:col-span-8 space-y-5">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Report Preview
                </span>
                <span className="text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 px-2.5 py-1.5 rounded-xl border border-sky-100/30 font-bold">
                  Referral: {activePatient.referralType}
                </span>
              </div>

              <LabReport patient={activePatient} signature={signature} />

              {/* Pathology signature section */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/60 space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Award className="h-4 w-4" /> Physician Certification & Signature
                </h4>
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="text-[10px] text-zinc-400 font-semibold space-y-1">
                    <p>Approved By: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{signature}</span></p>
                    <p>Regulatory Authority: Central Hub Pathology Commission</p>
                    <p className="text-zinc-500">Panel: {activePatient.testPanel} &bull; Analytes: {activePatient.testResults?.length || 0}</p>
                  </div>

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
          )}

        </div>
      )}

    </div>
  );
}
