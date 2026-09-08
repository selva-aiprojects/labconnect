/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Patient, TestResult } from '../types/lims_app';

interface LabReportProps {
  patient: Patient;
  signature?: string;
  signedAt?: string;
}

export function LabReport({ patient, signature, signedAt }: LabReportProps) {
  const results: TestResult[] = patient.testResults || [];

  const flagLabel = (flag?: TestResult['flag']) => {
    if (flag === 'H') return 'HIGH';
    if (flag === 'L') return 'LOW';
    if (flag === 'A') return 'ABNORMAL';
    return 'N';
  };

  const flagClass = (flag?: TestResult['flag']) => {
    if (flag === 'H' || flag === 'L' || flag === 'A') return 'text-rose-600';
    return 'text-emerald-600';
  };

  return (
    <div className="bg-white text-zinc-900 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Report Header */}
      <div className="px-6 py-5 border-b-4 border-[#3c3bb6]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wide text-[#3c3bb6]">
              Cybe: LabConnect
            </h1>
            <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
              Clinical Pathology Laboratory Report
            </p>
          </div>
          <div className="text-right text-[10px] leading-relaxed text-zinc-600 font-medium">
            <p className="font-sans">Sector A-1, Pathology Hub Lab, Dubai UAE</p>
            <p>Tel: +971 4 000 0000 &bull; lab@cybelabconnect.com</p>
          </div>
        </div>
      </div>

      {/* Patient / Sample Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 px-6 py-4 bg-zinc-50 border-b border-zinc-200 text-[11px]">
        <div className="col-span-2">
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Patient Name</span>
          <span className="font-bold text-zinc-900">{patient.name}</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Age / Sex</span>
          <span className="font-semibold">{patient.ageUnitStr || `${patient.age} Y / ${patient.gender}`}</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Patient ID</span>
          <span className="font-semibold font-mono">{patient.patientId || patient.bookingNo}</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Visit / Booking</span>
          <span className="font-semibold font-mono">{patient.bookingNo}</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Sample / Date</span>
          <span className="font-semibold">{patient.collectionDttm || patient.apptDttm || '—'}</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Referred By</span>
          <span className="font-semibold">{patient.billDetails?.doctorName || '—'}</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Department</span>
          <span className="font-semibold">{patient.servicesList?.[0]?.department || 'Pathology'}</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800">{patient.testPanel}</h2>
        </div>

        {results.length === 0 ? (
          <p className="text-xs text-zinc-400 italic py-6 text-center">
            No laboratory results are available for this report yet.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-100 text-[9px] uppercase tracking-widest text-zinc-500 font-black">
                <th className="px-3 py-2 rounded-l-lg">Investigation</th>
                <th className="px-3 py-2 text-right">Result</th>
                <th className="px-3 py-2 text-center">Flag</th>
                <th className="px-3 py-2 text-center">Unit</th>
                <th className="px-3 py-2 text-right rounded-r-lg">Reference Range</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {results.map((r, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-zinc-100 ${r.flag === 'H' || r.flag === 'L' || r.flag === 'A' ? 'bg-rose-50/60' : ''}`}
                >
                  <td className="px-3 py-2.5 font-semibold text-zinc-800">{r.name}</td>
                  <td className={`px-3 py-2.5 text-right font-mono font-bold ${r.flag === 'H' || r.flag === 'L' || r.flag === 'A' ? 'text-rose-600' : 'text-zinc-900'}`}>
                    {r.value}
                  </td>
                  <td className={`px-3 py-2.5 text-center text-[9px] font-black ${flagClass(r.flag)}`}>
                    {flagLabel(r.flag)}
                  </td>
                  <td className="px-3 py-2.5 text-center text-zinc-500">{r.unit || '—'}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-500">{r.reference || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Interpretation / Remarks */}
      <div className="px-6 pb-4 text-[11px] space-y-3">
        {results.some(r => r.flag === 'H' || r.flag === 'L' || r.flag === 'A') && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5">
            <span className="font-black text-[10px] uppercase tracking-wider text-rose-600 block mb-1">Abnormal Results</span>
            <ul className="list-disc list-inside text-rose-700 space-y-0.5">
              {results
                .filter(r => r.flag === 'H' || r.flag === 'L' || r.flag === 'A')
                .map((r, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{r.name}</span> is {r.flag === 'L' ? 'below' : 'above'} the reference range.
                  </li>
                ))}
            </ul>
          </div>
        )}

        <p className="text-zinc-400 italic">
          * Reference ranges are laboratory-specific and may vary by age, gender and methodology. This report is generated electronically and is valid without signature.
        </p>
      </div>

      {/* Signature */}
      <div className="flex items-end justify-between px-6 py-5 border-t border-zinc-200 mt-2">
        <div className="text-center">
          <div className="w-44 border-b border-zinc-300 pb-1 mb-1">
            <span className="text-[11px] font-bold text-zinc-700">
              {signature || 'Dr. Alistair Sterling, MD'}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Consultant Pathologist</span>
        </div>
        <div className="text-right text-[10px] text-zinc-400 font-medium">
          <p>Report Generated: {signedAt || new Date().toLocaleString()}</p>
          <p className="mt-0.5">Approved by Laboratory Quality Control</p>
        </div>
      </div>
    </div>
  );
}
