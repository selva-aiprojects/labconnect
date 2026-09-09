import { useState, type ReactNode } from 'react';
import { FlaskConical, Pencil, Plus, Trash2 } from 'lucide-react';
import { TestMaster } from '../types/testMaster';

type TestMasterViewProps = {
  testMasters: TestMaster[];
  onSaveTestMaster: (record: TestMaster) => void;
  onDeleteTestMaster: (id: string) => void;
};

const blankTestMaster: TestMaster = { id: '', testName: '', department: '', sampleType: '', units: '', referenceRange: '', rate: 0, active: true };

export function TestMasterView({ testMasters, onSaveTestMaster, onDeleteTestMaster }: TestMasterViewProps) {
  const [testMaster, setTestMaster] = useState<TestMaster | null>(null);
  const nextId = (prefix: string, records: Array<{ id: string }>) => `${prefix}-${String(records.length + 1).padStart(4, '0')}`;

  const saveTestMaster = () => {
    if (!testMaster?.testName.trim()) return;
    onSaveTestMaster({ ...testMaster, id: testMaster.id || nextId('TEST', testMasters) });
    setTestMaster(null);
  };

  const input = (value: string, onChange: (value: string) => void, placeholder: string) => <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-950" />;
  const numberInput = (value: number, onChange: (value: number) => void, placeholder: string) => <input type="number" step="0.01" value={value} onChange={event => onChange(parseFloat(event.target.value) || 0)} placeholder={placeholder} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-950" />;

  return <div className="space-y-6">
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Test Master</h2>
      <p className="mt-1 text-[11px] text-zinc-400">Manage diagnostic tests, departments, sample types, units, reference ranges, and rates.</p>
      <div className="mt-4">
        <button type="button" onClick={() => setTestMaster({ ...blankTestMaster })} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white cursor-pointer">
          <Plus className="h-3.5 w-3.5" />Add Test
        </button>
      </div>
    </div>

    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-widest text-zinc-400">
              <th className="px-3 py-2">Test Name</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Sample Type</th>
              <th className="px-3 py-2">Units</th>
              <th className="px-3 py-2">Reference Range</th>
              <th className="px-3 py-2 text-right">Rate</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testMasters.map(record => (
              <tr key={record.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300 font-bold">{record.testName}</td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{record.department}</td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{record.sampleType}</td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">{record.units}</td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300 text-[10px]">{record.referenceRange}</td>
                <td className="px-3 py-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{record.rate.toFixed(2)}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${record.active ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
                    {record.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button type="button" title="Edit" onClick={() => setTestMaster({ ...record })} className="rounded-lg bg-zinc-100 p-2 text-zinc-600 cursor-pointer dark:bg-zinc-800 dark:text-zinc-300">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" title="Delete" onClick={() => onDeleteTestMaster(record.id)} className="rounded-lg bg-rose-50 p-2 text-rose-600 cursor-pointer dark:bg-rose-950/30">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {testMaster && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{testMaster.id ? 'Edit Test' : 'Add Test'}</h3>
            <button type="button" onClick={() => setTestMaster(null)} className="text-zinc-400 cursor-pointer">Close</button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Test Name *</label>
              {input(testMaster.testName, value => setTestMaster({ ...testMaster, testName: value }), 'Test name')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Department</label>
                {input(testMaster.department, value => setTestMaster({ ...testMaster, department: value }), 'Department')}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Sample Type</label>
                {input(testMaster.sampleType, value => setTestMaster({ ...testMaster, sampleType: value }), 'Sample type')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Units</label>
                {input(testMaster.units, value => setTestMaster({ ...testMaster, units: value }), 'Units')}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Reference Range</label>
                {input(testMaster.referenceRange, value => setTestMaster({ ...testMaster, referenceRange: value }), 'Reference range')}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Rate (INR)</label>
              {numberInput(testMaster.rate, value => setTestMaster({ ...testMaster, rate: value }), '0.00')}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Active</label>
              <button type="button" onClick={() => setTestMaster({ ...testMaster, active: !testMaster.active })} className={`h-5 w-10 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${testMaster.active ? 'bg-[#3c3bb6] justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'}`}>
                <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
              </button>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{testMaster.active ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setTestMaster(null)} className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold cursor-pointer">Cancel</button>
            <button type="button" onClick={saveTestMaster} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white cursor-pointer">Save</button>
          </div>
        </div>
      </div>
    )}
  </div>;
}
