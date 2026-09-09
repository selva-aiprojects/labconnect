import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ClipboardCheck, ShieldAlert, TrendingUp } from 'lucide-react';
import { advanceDeviationStatus, advanceNonConformanceStatus, closeCapaAction, createCapaAction, createDeviationRecord, createNonConformanceRecord, createQualityIssuesFromResults, createTraceabilityRecord, NonConformanceRecord, QualityIssue } from '../utils/limsCompliance';

const qcResults = [
  { name: 'Hemoglobin', value: '9.5', unit: 'g/dL', flag: 'L' as const, reference: '12-16' },
  { name: 'Creatinine', value: '1.9', unit: 'mg/dL', flag: 'H' as const, reference: '0.7-1.2' },
  { name: 'Sodium', value: '140', unit: 'mmol/L', flag: 'N' as const, reference: '135-145' }
];

const initialDeviations = [
  createDeviationRecord('QC drift observed on analyzer A-12', 'Lab Analyst', 'high', 'West control drifted beyond 2 SD for three consecutive cycles.', 'investigating'),
  createDeviationRecord('B12 result repeats outside control limits', 'QA Reviewer', 'medium', 'Repeat sample confirmation is pending for final interpretation.', 'open'),
  createDeviationRecord('Sample recollection required for serum bilirubin', 'Phlebotomy Lead', 'low', 'Specimen integrity check failed before transit.', 'resolved')
];

const initialCapa = [
  createCapaAction('Recalibrate chemistry analyzer A-12', 'Biomedical Lead', 'Due in 2 days', 'in progress', initialDeviations[0].id),
  createCapaAction('Review specimen rejection protocol', 'Compliance Officer', 'Due in 5 days', 'planned', initialDeviations[1].id),
  createCapaAction('Validate reagent lot variance logs', 'QA Manager', 'Due today', 'escalated', initialDeviations[2].id)
];

const initialTraceability = [
  createTraceabilityRecord('Analyzer A-12', 'LOT-2048-B', 'accepted', 'QA Technician', 'Reagent lot accepted after successful control checks.'),
  createTraceabilityRecord('Analyzer C-07', 'LOT-3302-G', 'quarantined', 'Lab Supervisor', 'Hold pending confirmatory control documentation.'),
  createTraceabilityRecord('Analyzer D-04', 'LOT-1189-R', 'rejected', 'QC Manager', 'Rejected due to failed calibration verification.')
];

export function QualityView() {
  const [deviations, setDeviations] = useState(initialDeviations);
  const [capa, setCapa] = useState(initialCapa);
  const [traceability, setTraceability] = useState(initialTraceability);
  const [qualityIssues] = useState<QualityIssue[]>(() => createQualityIssuesFromResults(qcResults));
  const [nonConformances, setNonConformances] = useState<NonConformanceRecord[]>([]);

  const handleAdvanceDeviation = (id: string) => {
    setDeviations(current => current.map(item => item.id === id ? advanceDeviationStatus(item) : item));
  };

  const handleCloseCapa = (id: string) => {
    setCapa(current => current.map(item => item.id === id ? closeCapaAction(item) : item));
  };

  const handleCreateNonConformance = (issue: QualityIssue) => {
    if (nonConformances.some(record => record.sourceQualityIssueId === issue.id)) return;

    setNonConformances(current => [
      createNonConformanceRecord(issue.id, issue.title, 'QA Reviewer', issue.severity, 'Hold affected result and repeat the applicable control or specimen review.'),
      ...current
    ]);
  };

  const handleAdvanceNonConformance = (id: string) => {
    setNonConformances(current => current.map(item => item.id === id ? advanceNonConformanceStatus(item) : item));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Quality & Compliance Center</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Monitor QC performance, deviations, and CAPA actions to maintain end-to-end lab integrity.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 px-3 py-1.5 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-bold">
          <TrendingUp className="h-4 w-4" />
          QMS Status: Stable with 2 review flags
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Open QC Flags</span>
            <ClipboardCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{qualityIssues.length}</div>
          <p className="mt-1 text-[10px] text-zinc-400">Abnormal results under review</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Active Deviations</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{deviations.filter(d => d.status !== 'resolved').length}</div>
          <p className="mt-1 text-[10px] text-zinc-400">Pending investigation queue</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">CAPA Due</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">3</div>
          <p className="mt-1 text-[10px] text-zinc-400">This week escalation list</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Sigma / KPI</span>
            <Activity className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">96.8%</div>
          <p className="mt-1 text-[10px] text-zinc-400">Overall process stability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Current QC Flags</span>
          </div>
          <div className="p-4 space-y-3">
            {qualityIssues.map(issue => (
              <div key={issue.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100">{issue.title}</span>
                  <span className="text-[9px] uppercase font-black text-amber-600 dark:text-amber-400">{issue.severity}</span>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">{issue.description}</p>
                <div className="mt-3 text-[9px] text-zinc-400">
                  Status: <span className="font-bold text-zinc-600 dark:text-zinc-200">{issue.status}</span>
                </div>
                <button
                  onClick={() => handleCreateNonConformance(issue)}
                  disabled={nonConformances.some(record => record.sourceQualityIssueId === issue.id)}
                  className="mt-3 w-full rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1.5 text-[9px] font-bold text-rose-700 dark:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {nonConformances.some(record => record.sourceQualityIssueId === issue.id) ? 'Non-Conformance Opened' : 'Open Non-Conformance'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Deviation Register</span>
          </div>
          <div className="p-4 space-y-3">
            {deviations.map(item => (
              <div key={item.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100">{item.id}</span>
                  <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${item.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : item.status === 'investigating' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-zinc-500">{item.title}</p>
                <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-400">
                  <span>Owner: {item.owner}</span>
                  <span>{item.severity}</span>
                </div>
                <button
                  onClick={() => handleAdvanceDeviation(item.id)}
                  disabled={item.status === 'resolved'}
                  className="mt-3 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-[9px] font-bold text-zinc-700 dark:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item.status === 'open' ? 'Advance to investigation' : item.status === 'investigating' ? 'Mark as resolved' : 'Resolved'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Non-Conformance Register</span>
          <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">{nonConformances.filter(item => item.status !== 'resolved').length} active</span>
        </div>
        <div className="p-4 space-y-3">
          {nonConformances.length === 0 ? (
            <p className="text-[10px] text-zinc-500">No non-conformances opened. Create one from a QC flag when containment is required.</p>
          ) : nonConformances.map(item => (
            <div key={item.id} className="rounded-2xl border border-rose-100 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100">{item.id} · {item.title}</span>
                <span className="text-[9px] uppercase font-black text-rose-600 dark:text-rose-400">{item.status}</span>
              </div>
              <p className="mt-2 text-[10px] text-zinc-500">Containment: {item.containment}</p>
              <div className="mt-3 flex items-center justify-between text-[9px] text-zinc-400">
                <span>Owner: {item.owner} · Severity: {item.severity}</span>
                <button
                  onClick={() => handleAdvanceNonConformance(item.id)}
                  disabled={item.status === 'resolved'}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 font-bold text-zinc-700 dark:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item.status === 'open' ? 'Start investigation' : item.status === 'investigating' ? 'Resolve' : 'Resolved'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Corrective & Preventive Actions</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2.5 px-3">CAPA ID</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Due</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-[10px] text-zinc-600 dark:text-zinc-300">
              {capa.map(item => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
                  <td className="py-3 px-3 font-bold text-zinc-800 dark:text-zinc-100">{item.id}</td>
                  <td className="py-3 px-3">{item.title}</td>
                  <td className="py-3 px-3">{item.owner}</td>
                  <td className="py-3 px-3">{item.due}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${item.status === 'escalated' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : item.status === 'in progress' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : item.status === 'closed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleCloseCapa(item.id)}
                        disabled={item.status === 'closed'}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-[9px] font-bold text-zinc-700 dark:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {item.status === 'closed' ? 'Closed' : 'Close CAPA'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Material Traceability</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2.5 px-3">Instrument</th>
                <th className="py-2.5 px-3">Reagent Lot</th>
                <th className="py-2.5 px-3">Reviewer</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Note</th>
              </tr>
            </thead>
            <tbody className="text-[10px] text-zinc-600 dark:text-zinc-300">
              {traceability.map(item => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 align-top">
                  <td className="py-3 px-3 font-bold text-zinc-800 dark:text-zinc-100">{item.instrumentId}</td>
                  <td className="py-3 px-3">{item.reagentLot}</td>
                  <td className="py-3 px-3">{item.reviewer}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${item.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : item.status === 'quarantined' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-[220px]">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
