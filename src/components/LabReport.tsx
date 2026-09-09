import React from 'react';
import { Activity, ArrowRight, Beaker, CheckSquare, CircleHelp, Droplets, HeartPulse, ShieldCheck, TestTube2 } from 'lucide-react';
import { Patient, TestResult } from '../types/lims_app';

interface LabReportProps {
  patient: Patient;
  signature?: string;
  signedAt?: string;
}

type ProfileGroup = {
  name: string;
  description: string;
  icon: 'heart' | 'thyroid' | 'vitamin' | 'urine' | 'electrolyte' | 'general';
  results: TestResult[];
};

type ParameterEducation = {
  title: string;
  summary: string;
  causeEffect: string;
  symptoms: string[];
  actions: string[];
  icon: ProfileGroup['icon'];
};

const parameterEducation: Record<string, ParameterEducation> = {
  hba1c: {
    title: 'HbA1c',
    summary: 'HbA1c is a blood test performed to measure the average sugar in the blood for the past 2 to 3 months.',
    causeEffect: 'Usually, the symptoms of pre-diabetes can be mild and go unnoticed. HbA1c levels higher than normal may indicate poor control of blood sugars over time.',
    symptoms: ['Cuts or bruises that take longer to heal', 'Fatigue', 'Tingling, pain, or numbness in hands or feet'],
    actions: ['Follow a low carbohydrate or low sugar diet', 'Choose high-fibre foods and regular balanced meals', 'Exercise regularly as advised by your doctor', 'Take prescribed medicines as directed and do not change the dose yourself', 'Monitor blood sugar when recommended', 'Repeat HbA1c testing at the interval advised by your doctor', 'Follow up regularly with your treating doctor'],
    icon: 'heart'
  },
  'ldl cholesterol': {
    title: 'LDL',
    summary: 'LDL cholesterol is a type of cholesterol that can collect inside blood vessels and is often called bad cholesterol.',
    causeEffect: 'As a person ages, bad cholesterol can build up and cause blockages in the blood vessels of the heart or brain, increasing the risk of heart attack or stroke.',
    symptoms: ['No symptoms may be present when LDL cholesterol is high', 'Chest discomfort or shortness of breath should be discussed urgently with a doctor'],
    actions: ['Follow a low cholesterol diet with more vegetables, whole grains, and fibre', 'Limit saturated fats, trans fats, and highly processed foods', 'Increase physical activity as advised', 'Create a healthy weight management plan', 'Take prescribed cholesterol medicines consistently', 'Ask your doctor whether other lipid tests or cardiovascular risk checks are needed', 'Repeat the lipid profile when recommended', 'Consult your doctor about your result'],
    icon: 'heart'
  }
};

const groupDefinitions: Omit<ProfileGroup, 'results'>[] = [
  { name: 'Blood sugar', description: 'Glycemic profile', icon: 'heart' },
  { name: 'Cholesterol', description: 'Lipid profile', icon: 'heart' },
  { name: 'Thyroid profile', description: 'Thyroid function', icon: 'thyroid' },
  { name: 'Vitamins', description: 'Vitamin status', icon: 'vitamin' },
  { name: 'Urinalysis', description: 'Urine screening', icon: 'urine' },
  { name: 'Electrolytes', description: 'Mineral balance', icon: 'electrolyte' },
  { name: 'Other investigations', description: 'Additional results', icon: 'general' }
];

function getGroupIndex(result: TestResult) {
  const name = result.name.toLowerCase();
  if (name.includes('hba1c') || name.includes('glyc') || name.includes('fasting sugar')) return 0;
  if (name.includes('cholesterol') || name.includes('triglyceride') || name.includes('lipid')) return 1;
  if (name.includes('tsh') || name.includes('thyroid') || /^t[34]\b/.test(name)) return 2;
  if (name.includes('vitamin') || name.includes(' b12')) return 3;
  if (name.includes('urine') || name.includes('ketone') || name.includes('protein') || name.includes('pus') || name.includes('gravity') || name === 'rbc') return 4;
  if (name.includes('sodium') || name.includes('chloride') || name.includes('potassium') || name.includes('calcium')) return 5;
  return 6;
}

function ProfileIcon({ icon }: { icon: ProfileGroup['icon'] }) {
  const props = { size: 24, strokeWidth: 1.7 };
  if (icon === 'urine') return <TestTube2 {...props} />;
  if (icon === 'electrolyte') return <Droplets {...props} />;
  if (icon === 'thyroid') return <Activity {...props} />;
  if (icon === 'vitamin') return <Beaker {...props} />;
  if (icon === 'heart') return <HeartPulse {...props} />;
  return <CircleHelp {...props} />;
}

function resultState(result: TestResult) {
  if (result.flag === 'H' || result.flag === 'A') return 'high';
  if (result.flag === 'L') return 'low';
  return 'normal';
}

function reportStatusFor(patient: Patient, abnormalCount: number) {
  if (patient.reportStatus) return patient.reportStatus;
  if (patient.status === 'Cancelled') return 'CANCELLED';
  if (patient.status === 'Completed') return abnormalCount > 0 ? 'UNDER REVIEW' : 'REVIEWED';
  return 'DRAFT';
}

function ResultTile({ result }: { result: TestResult; key?: React.Key; tileKey?: string }) {
  const state = resultState(result);
  const accent = state === 'normal' ? 'border-emerald-500' : state === 'low' ? 'border-amber-400' : 'border-rose-400';
  const valueColor = state === 'normal' ? 'text-[#164b70]' : state === 'low' ? 'text-amber-700' : 'text-rose-700';
  const stateLabel = state === 'normal' ? 'NORMAL' : state === 'low' ? 'LOW' : result.flag === 'A' ? 'ABNORMAL' : 'HIGH';

  return (
    <div className={`border-l-[5px] ${accent} bg-[#f2f4f5] px-4 py-3.5 min-h-[120px]`}>
      <p className="text-[14px] leading-snug font-semibold text-[#3b6280]">{result.name}</p>
      <p className="mt-2 text-[11px] text-slate-500">Result: <strong className={`ml-1 text-[20px] font-medium ${valueColor}`}>{result.value}</strong> <span className="text-[12px] text-slate-500">{result.unit || ''}</span></p>
      <p className="mt-1 text-[11px] text-slate-500">Range: <span className="text-slate-600">{result.reference || 'See laboratory reference'}</span></p>
      <p className={`mt-2 text-[10px] font-black uppercase tracking-wider ${valueColor}`}>Status: {stateLabel}</p>
    </div>
  );
}

function explanationFor(group: ProfileGroup, results: TestResult[]) {
  const abnormal = results.filter(result => resultState(result) !== 'normal');
  if (abnormal.length === 0) return `Your ${group.description.toLowerCase()} results are within the stated laboratory range.`;
  const names = abnormal.map(result => result.name).join(', ');
  return `${names} ${abnormal.length === 1 ? 'is' : 'are'} outside the stated range. Please review this result with your treating doctor in the context of your health history.`;
}

function educationFor(result: TestResult): ParameterEducation {
  const key = result.name.toLowerCase().replace(/\s+/g, ' ').trim();
  return parameterEducation[key] || {
    title: result.name,
    summary: `${result.name} is a laboratory measurement used together with your symptoms, history, and other results to understand your health.` ,
    causeEffect: `Your result is compared with the laboratory reference range. A result outside that range does not diagnose a condition on its own and should be interpreted by your healthcare professional.`,
    symptoms: ['Many laboratory changes do not cause noticeable symptoms', 'Discuss new or persistent symptoms with your healthcare professional'],
    actions: ['Review this result with your treating doctor', 'Follow the care and follow-up plan recommended for you', 'Keep a record of related symptoms, medicines, and previous results', 'Ask whether repeat testing or additional tests are appropriate', 'Do not start, stop, or change treatment based on this report alone'],
    icon: 'general'
  };
}

export function LabReport({ patient, signature, signedAt }: LabReportProps) {
  const results = patient.testResults || [];
  const groups = groupDefinitions.map((definition, index) => ({ ...definition, results: results.filter(result => getGroupIndex(result) === index) })).filter(group => group.results.length > 0);
  const abnormalCount = results.filter(result => resultState(result) !== 'normal').length;
  const reportStatus = reportStatusFor(patient, abnormalCount);
  const accessionNo = patient.accessionNo || `ACC-${patient.bookingNo.replace(/[^A-Z0-9]/gi, '')}`;
  const specimenId = patient.specimenId || `SMP-${patient.id.padStart(6, '0')}`;
  const specimenType = patient.specimenType || patient.servicesList?.[0]?.sample || 'Serum';

  return (
    <article className="lab-report overflow-hidden border border-slate-200 bg-white text-slate-700 shadow-sm">
      <header className="border-b-[3px] border-[#164b70] px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center bg-[#164b70] text-white"><ShieldCheck size={22} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#164b70]">Cybe LabConnect</p><h1 className="text-xl font-light tracking-tight text-[#193f55]">Your important parameters</h1></div></div>
            <p className="mt-2 text-xs text-slate-500">A clear summary of your laboratory results</p>
          </div>
          <div className="text-left text-[10px] leading-relaxed text-slate-500 sm:text-right"><p className="font-semibold text-slate-700">Clinical Pathology Laboratory</p><p>Sector A-1, Pathology Hub Lab, Dubai UAE</p><p>Tel: +971 4 000 0000 | lab@cybelabconnect.com</p></div>
        </div>
      </header>

      <section className="grid gap-x-6 gap-y-3 border-b border-slate-200 bg-[#f7f9fa] px-5 py-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="sm:col-span-2"><span className="report-label">Patient</span><strong>{patient.name}</strong></div>
        <div><span className="report-label">Age / sex</span><strong>{patient.ageUnitStr || `${patient.age} Y / ${patient.gender}`}</strong></div>
        <div><span className="report-label">Patient ID</span><strong>{patient.patientId || patient.bookingNo}</strong></div>
        <div><span className="report-label">Accession number</span><strong>{accessionNo}</strong></div>
        <div><span className="report-label">Specimen ID</span><strong>{specimenId}</strong></div>
        <div><span className="report-label">Specimen</span><strong>{specimenType}</strong></div>
        <div><span className="report-label">Sample collected</span><strong>{patient.collectionDttm || patient.apptDttm || 'Not recorded'}</strong></div>
        <div><span className="report-label">Referred by</span><strong>{patient.billDetails?.doctorName || 'Not recorded'}</strong></div>
        <div><span className="report-label">Report status</span><strong className={reportStatus === 'FINAL' || reportStatus === 'REVIEWED' ? 'text-emerald-700' : reportStatus === 'CANCELLED' ? 'text-rose-700' : 'text-amber-700'}>{reportStatus}</strong></div>
        <div><span className="report-label">Report number</span><strong>{patient.bookingNo}</strong></div>
        <div><span className="report-label">Received</span><strong>{patient.receivedDttm || 'Not recorded'}</strong></div>
        <div><span className="report-label">Reported</span><strong>{patient.reportedDttm || signedAt || 'Not recorded'}</strong></div>
      </section>

      <section className="px-5 py-6 sm:px-8">
        <div className="mb-6 flex flex-col gap-1 border-b border-[#164b70] pb-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-[22px] font-light tracking-tight text-[#193f55]">Your important parameters at a glance</h2><p className="mt-1 text-xs text-slate-500">Values are shown with the reference range supplied by the laboratory.</p></div><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#164b70]">{results.length} parameters</span></div>
        {groups.length === 0 ? <div className="border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500">No laboratory results are available for this report yet.</div> : <div className="space-y-6">{groups.map(group => <section key={group.name} className="grid gap-5 border-b border-slate-300 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[150px_1fr]"><div className="flex items-center gap-3 md:flex-col md:justify-start md:gap-2 md:border-r md:border-dashed md:border-slate-400 md:pr-5"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[4px] border-emerald-500 text-emerald-600"><ProfileIcon icon={group.icon} /></div><div className="md:text-center"><h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#164b70]">{group.name}</h3><p className="mt-1 text-[10px] text-slate-400">{group.description}</p></div></div><div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.results.map((result, index) => <ResultTile key={`${result.name}-${index}`} tileKey={`${result.name}-${index}`} result={result} />)}</div><div className="mt-3 flex gap-2 text-[11px] leading-relaxed text-slate-500"><CircleHelp className="mt-0.5 shrink-0 text-[#164b70]" size={15} /><p>{explanationFor(group, group.results)}</p></div></div></section>)}</div>}
      </section>

      {results.length > 0 && <section className="report-explained border-t border-slate-200 px-5 py-6 sm:px-8"><div className="mb-5 border-b border-[#164b70] pb-3"><h2 className="text-[22px] font-light tracking-tight text-[#193f55]">Some of your important parameters explained</h2><p className="mt-1 text-xs text-slate-500">A simple explanation of selected results, possible effects, and useful next steps.</p></div><div className="space-y-6">{results.map((result, index) => { const education = educationFor(result); return <article className="report-explained-item grid gap-5 border-b border-slate-300 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[180px_1fr]" key={`education-${result.name}-${index}`}><div className="flex min-h-32 items-center justify-center bg-[#fff9ef] p-5"><div className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-amber-300 bg-white text-[#164b70]"><ProfileIcon icon={education.icon} /></div></div><div className="grid gap-5 lg:grid-cols-[180px_1fr_1fr]"><div><h3 className="text-[21px] font-medium text-[#164b70]">{education.title}</h3><div className="my-2 h-1 w-8 bg-amber-300" /><p className="text-xs text-slate-500">Result: <strong className="text-lg font-medium text-blue-700">{result.value}</strong> <span>{result.unit || ''}</span></p><p className="mt-1 text-xs text-slate-500">Range: <span className="text-slate-700">{result.reference || 'See laboratory reference'}</span></p></div><div className="text-xs leading-relaxed text-slate-500"><p className="italic">{education.summary}</p><div className="mt-4 flex gap-2"><ArrowRight className="mt-0.5 shrink-0 text-amber-500" size={18} /><div><h4 className="text-sm font-semibold text-slate-800">Cause / Effect of this parameter</h4><p className="mt-1">{education.causeEffect}</p><ul className="mt-3 space-y-1">{education.symptoms.map(symptom => <li className="flex gap-2" key={symptom}><span className="mt-1 h-2 w-2 shrink-0 rounded-full border-2 border-blue-600" />{symptom}</li>)}</ul></div></div></div><div className="text-xs leading-relaxed text-slate-500"><div className="flex items-center gap-2"><h4 className="text-sm font-semibold text-slate-800">What can you do about it?</h4><CheckSquare className="text-amber-500" size={20} /></div><p className="mt-1">Please consult a doctor to advise further.</p><ul className="mt-3 space-y-2">{education.actions.map(action => <li className="flex gap-2" key={action}><span className="mt-1 h-2 w-2 shrink-0 rounded-full border-2 border-blue-600" />{action}</li>)}</ul></div></div></article>; })}</div></section>}

      <footer className="border-t border-slate-200 bg-[#f7f9fa] px-5 py-5 sm:px-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl text-[10px] leading-relaxed text-slate-500"><p>* Reference ranges are laboratory-specific and may vary by age, gender and methodology. This report is electronically generated and valid without a physical signature.</p><p className="mt-2">Please discuss any flagged result with your healthcare professional. This summary does not replace medical advice.</p></div><div className="min-w-48 text-left sm:text-right"><p className="border-b border-slate-400 pb-1 text-xs font-semibold text-slate-700">{signature || 'Dr. Alistair Sterling, MD'}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">Consultant Pathologist</p><p className="mt-2 text-[9px] text-slate-400">Generated: {signedAt || new Date().toLocaleString()}</p></div></div></footer>
    </article>
  );
}
