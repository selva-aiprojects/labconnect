import { useMemo } from 'react';
import { CheckCircle2, CircleOff, Cpu, Radio, Settings2 } from 'lucide-react';
import { LabDevice } from '../types/device';

interface DeviceMasterViewProps {
  devices: LabDevice[];
  onToggleDevice: (id: string) => void;
}

export function DeviceMasterView({ devices, onToggleDevice }: DeviceMasterViewProps) {
  const activeCount = useMemo(() => devices.filter(device => device.enabled && device.status === 'online').length, [devices]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center"><Settings2 className="h-6 w-6" /></div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Device Integration Master</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Enable only validated devices for specimen routing and result ingestion.</p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400"><Radio className="h-4 w-4" />{activeCount} active devices</span>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20"><span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Master Device Registry</span></div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="text-[9px] uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-zinc-800"><th className="py-2.5 px-3">Device</th><th className="py-2.5 px-3">Protocol / Endpoint</th><th className="py-2.5 px-3">Department</th><th className="py-2.5 px-3">Connection</th><th className="py-2.5 px-3">Mode</th></tr></thead>
            <tbody className="text-[10px] text-zinc-600 dark:text-zinc-300">
              {devices.map(device => (
                <tr key={device.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
                  <td className="py-3 px-3"><div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-sky-500" /><div><div className="font-bold text-zinc-800 dark:text-zinc-100">{device.name}</div><div className="text-[9px] text-zinc-400">{device.id} · {device.serialNumber}</div></div></div></td>
                  <td className="py-3 px-3"><div className="font-bold">{device.protocol}</div><div className="text-[9px] text-zinc-400">{device.endpoint}</div></td>
                  <td className="py-3 px-3">{device.department}</td>
                  <td className="py-3 px-3"><span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${device.status === 'online' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'}`}>{device.status}</span></td>
                  <td className="py-3 px-3"><button type="button" onClick={() => onToggleDevice(device.id)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${device.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>{device.enabled ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleOff className="h-3.5 w-3.5" />}{device.enabled ? 'Enabled' : 'Disabled'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
