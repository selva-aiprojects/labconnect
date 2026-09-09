import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Cpu, ShieldAlert, Wrench } from 'lucide-react';
import { CalibrationRecord, completeCalibration, createCalibrationRecord } from '../utils/limsCompliance';

const initialCalibrations: CalibrationRecord[] = [
  createCalibrationRecord('ANL-A12', 'Cybe H-560 Chemistry Analyzer', '2026-10-15T00:00:00.000Z', 'QA Technician', 'due-soon', '2026-04-15T00:00:00.000Z'),
  createCalibrationRecord('PCR-B07', 'Molecular PCR Workstation', '2026-09-02T00:00:00.000Z', 'QA Technician', 'overdue', '2026-03-02T00:00:00.000Z'),
  createCalibrationRecord('CEN-C03', 'High-Speed Centrifuge', '2027-01-20T00:00:00.000Z', 'Biomedical Lead', 'calibrated', '2026-07-20T00:00:00.000Z'),
  createCalibrationRecord('BAL-D02', 'Precision Laboratory Balance', '2026-08-28T00:00:00.000Z', 'QA Technician', 'out-of-service', '2026-02-28T00:00:00.000Z')
];

const statusStyles: Record<CalibrationRecord['status'], string> = {
  calibrated: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  'due-soon': 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  overdue: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  'out-of-service': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
};

export function CalibrationView() {
  const [records, setRecords] = useState(initialCalibrations);
  const dueCount = records.filter(record => record.status === 'due-soon' || record.status === 'overdue').length;

  const handleComplete = (record: CalibrationRecord) => {
    const nextDueAt = new Date();
    nextDueAt.setFullYear(nextDueAt.getFullYear() + 1);
    setRecords(previous => previous.map(item => item.id === record.id
      ? completeCalibration(item, nextDueAt.toISOString(), 'Current QA User')
      : item));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center"><Cpu className="h-6 w-6" /></div>
          <div><h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Equipment Calibration</h2><p className="text-[11px] text-zinc-400 font-medium">Control instrument readiness and keep calibration evidence current.</p></div>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60 px-3 py-1.5 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-bold"><AlertTriangle className="h-4 w-4" />{dueCount} attention required</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><span className="text-[10px] uppercase font-black text-zinc-400">Registered Instruments</span><div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{records.length}</div><p className="mt-1 text-[10px] text-zinc-400">Under calibration control</p></div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><span className="text-[10px] uppercase font-black text-zinc-400">Due or Overdue</span><div className="mt-4 text-3xl font-black text-amber-600">{dueCount}</div><p className="mt-1 text-[10px] text-zinc-400">Review before analytical use</p></div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><span className="text-[10px] uppercase font-black text-zinc-400">Operationally Clear</span><div className="mt-4 text-3xl font-black text-emerald-600">{records.filter(record => record.status === 'calibrated').length}</div><p className="mt-1 text-[10px] text-zinc-400">Calibration current</p></div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20"><span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Calibration Register</span></div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="text-[9px] uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-zinc-800"><th className="py-2.5 px-3">Instrument</th><th className="py-2.5 px-3">Status</th><th className="py-2.5 px-3">Last Calibrated</th><th className="py-2.5 px-3">Next Due</th><th className="py-2.5 px-3">Reviewer</th><th className="py-2.5 px-3">Action</th></tr></thead>
            <tbody className="text-[10px] text-zinc-600 dark:text-zinc-300">
              {records.map(record => <tr key={record.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 align-top">
                <td className="py-3 px-3"><div className="font-bold text-zinc-800 dark:text-zinc-100">{record.instrumentName}</div><div className="text-[9px] text-zinc-400">{record.instrumentId}</div></td>
                <td className="py-3 px-3"><span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${statusStyles[record.status]}`}>{record.status}</span></td>
                <td className="py-3 px-3">{new Date(record.lastCalibratedAt).toLocaleDateString()}</td>
                <td className="py-3 px-3">{new Date(record.nextDueAt).toLocaleDateString()}</td>
                <td className="py-3 px-3">{record.reviewer}</td>
                <td className="py-3 px-3">{record.status !== 'calibrated' && record.status !== 'out-of-service' ? <button type="button" onClick={() => handleComplete(record)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" />Complete</button> : record.status === 'out-of-service' ? <span className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-400"><Wrench className="h-3 w-3" />Hold</span> : <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600"><ShieldAlert className="h-3 w-3" />Clear</span>}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}