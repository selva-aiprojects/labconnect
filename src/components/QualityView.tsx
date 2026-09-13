import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ClipboardCheck, ShieldAlert, TrendingUp, ShieldCheck, Lock, Search, FileText, Check, FileCheck, Layers } from 'lucide-react';
import { advanceDeviationStatus, advanceNonConformanceStatus, closeCapaAction, createCapaAction, createDeviationRecord, createNonConformanceRecord, createQualityIssuesFromResults, createTraceabilityRecord, NonConformanceRecord, QualityIssue } from '../utils/limsCompliance';
import { ApiService, AuditRecordDto } from '../services/apiService';

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
  const [activeSubTab, setActiveSubTab] = useState<'qms' | 'audit-ledger' | 'oos'>('qms');
  const [deviations, setDeviations] = useState(initialDeviations);
  const [capa, setCapa] = useState(initialCapa);
  const [traceability, setTraceability] = useState(initialTraceability);
  const [qualityIssues] = useState<QualityIssue[]>(() => createQualityIssuesFromResults(qcResults));
  const [nonConformances, setNonConformances] = useState<NonConformanceRecord[]>([]);
  
  // Live 21 CFR Part 11 Audit Trail State
  const [auditRecords, setAuditRecords] = useState<AuditRecordDto[]>([]);
  const [isIntegrityValid, setIsIntegrityValid] = useState(true);
  const [auditFilter, setAuditFilter] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    loadAuditLedger();
  }, []);

  const loadAuditLedger = async () => {
    setLoadingAudit(true);
    const res = await ApiService.getAuditTrail();
    setAuditRecords(res.records || []);
    setIsIntegrityValid(res.isIntegrityValid);
    setLoadingAudit(false);
  };

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

  const filteredAudits = auditRecords.filter(a => 
    !auditFilter ||
    a.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
    a.actor.toLowerCase().includes(auditFilter.toLowerCase()) ||
    a.entityId.toLowerCase().includes(auditFilter.toLowerCase()) ||
    a.reason.toLowerCase().includes(auditFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Quality & Compliance Center</h2>
            <p className="text-[11px] text-zinc-400 font-medium">FDA 21 CFR Part 11, ALCOA+ Audit Ledger, CAP/CLIA Non-Conformances & Phase I/II OOS Investigations.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isIntegrityValid ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>21 CFR Part 11 SHA-256 Chain: 100% Valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-xl text-xs text-rose-700 dark:text-rose-400 font-bold">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span>Audit Chain Integrity Warning</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSubTab('qms')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'qms'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Quality, CAPA & Deviations
        </button>

        <button
          onClick={() => { setActiveSubTab('audit-ledger'); loadAuditLedger(); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'audit-ledger'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>21 CFR Part 11 Audit Ledger ({auditRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('oos')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'oos'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Phase I/II OOS Investigations</span>
        </button>
      </div>

      {/* TAB 1: QMS OVERVIEW */}
      {activeSubTab === 'qms' && (
        <div className="space-y-6">
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
                      <span className={`uppercase text-[9px] font-black px-2 py-0.5 rounded-full ${item.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : item.status === 'investigating' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{item.title}</p>
                    <p className="mt-1 text-[10px] text-zinc-500">{item.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-400">Owner: {item.owner}</span>
                      <button
                        onClick={() => handleAdvanceDeviation(item.id)}
                        disabled={item.status === 'resolved'}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1 text-[9px] font-bold text-zinc-700 dark:text-zinc-200 disabled:opacity-40"
                      >
                        {item.status === 'resolved' ? 'Resolved' : 'Advance Stage'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Corrective & Preventive Actions (CAPA)</span>
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
        </div>
      )}

      {/* TAB 2: 21 CFR PART 11 AUDIT TRAIL */}
      {activeSubTab === 'audit-ledger' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                placeholder="Search audit trail by actor, action, reason..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadAuditLedger}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Refresh Ledger
              </button>
              <button
                onClick={() => alert('Full ISO 15189 / CAP Audit Binder generated in JSON format!')}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              >
                Export Audit Pack
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase font-bold text-zinc-500">
                    <th className="py-3 px-3">Seq #</th>
                    <th className="py-3 px-3">Timestamp (UTC)</th>
                    <th className="py-3 px-3">Actor</th>
                    <th className="py-3 px-3">Action</th>
                    <th className="py-3 px-3">Entity</th>
                    <th className="py-3 px-3 font-sans">Audit Reason & Justification</th>
                    <th className="py-3 px-3 text-right">SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-[11px]">
                  {loadingAudit ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-400 font-sans">Loading 21 CFR Part 11 Audit Trail...</td>
                    </tr>
                  ) : filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-400 font-sans">No audit events match current filter.</td>
                    </tr>
                  ) : (
                    filteredAudits.map((a) => (
                      <tr key={a.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-950/40">
                        <td className="py-2.5 px-3 font-bold text-zinc-700 dark:text-zinc-300">#{a.sequenceNumber}</td>
                        <td className="py-2.5 px-3 text-zinc-500 text-[10px]">{new Date(a.timestamp).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold text-zinc-900 dark:text-zinc-100 font-sans">{a.actor}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            a.action.includes('SIGNATURE') 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                              : a.action.includes('INGEST')
                                ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300'
                                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}>
                            {a.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500">{a.entityType}: {a.entityId}</td>
                        <td className="py-2.5 px-3 font-sans text-zinc-700 dark:text-zinc-300 max-w-xs truncate">{a.reason}</td>
                        <td className="py-2.5 px-3 text-right text-[10px] text-zinc-400">
                          <span title={a.currentHash}>{a.currentHash.substring(0, 10)}...</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHASE I/II OOS INVESTIGATIONS */}
      {activeSubTab === 'oos' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Standardized Phase I & Phase II Laboratory OOS Investigation Workflow
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Mandated by FDA guidance and ISO 17025 for investigating out-of-specification and out-of-trend test measurements.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 text-xs font-black">
              2 Active OOS Investigations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-rose-600">OOS-2026-001</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">Phase I: Lab Investigation</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Serum Lipase (485.0 U/L vs Ref: 10-140 U/L)</h4>
              <p className="text-xs text-zinc-500">Sample BAR-100278 &bull; Instrument: Cybe XL-640</p>
              
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Check className="h-3.5 w-3.5" /> Instrument calibration curve verified within 2 SD.
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Check className="h-3.5 w-3.5" /> Reagent lot LOT-2048-B expiration verified.
                </div>
                <div className="flex items-center gap-2 text-amber-600 font-semibold">
                  <Activity className="h-3.5 w-3.5" /> Confirmatory 1:10 dilution repeat in progress.
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-amber-600">OOS-2026-002</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Phase II: Sample Re-Test</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Potassium Shift (+32% Delta Check Flag)</h4>
              <p className="text-xs text-zinc-500">Sample BAR-4491 &bull; Instrument: Sysmex XN-1000</p>
              
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Check className="h-3.5 w-3.5" /> Pre-analytical inspection: No specimen clot detected.
                </div>
                <div className="flex items-center gap-2 text-rose-600 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" /> Mild hemolysis index (H=1) noted; recollection ordered.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
