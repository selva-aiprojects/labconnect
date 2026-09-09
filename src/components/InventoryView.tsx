import { Activity, AlertTriangle, Boxes, CheckCircle2, FlaskConical, PackageSearch } from 'lucide-react';
import { createInventoryLot } from '../utils/limsCompliance';

const inventoryLots = [
  createInventoryLot('LOT-2048-B', 'Chemistry Reagent', 24, 'available'),
  createInventoryLot('LOT-3302-G', 'PCR Master Mix', 8, 'low-stock'),
  createInventoryLot('LOT-1189-R', 'Serum Control', 0, 'quarantined'),
  createInventoryLot('LOT-9011-Q', 'Buffer Solution', 16, 'available')
];

export function InventoryView() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Inventory & Lot Tracking</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Track reagent stock, lot readiness, and operational consumption across the lab.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 px-3 py-1.5 rounded-xl text-xs text-violet-700 dark:text-violet-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          4 active reagent lots
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Available Units</span>
            <PackageSearch className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{inventoryLots.reduce((sum, item) => sum + (item.status === 'quarantined' ? 0 : item.availableUnits), 0)}</div>
          <p className="mt-1 text-[10px] text-zinc-400">Across active lots</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Low Stock</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{inventoryLots.filter(item => item.status === 'low-stock').length}</div>
          <p className="mt-1 text-[10px] text-zinc-400">Replenishment flagged</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Quarantined</span>
            <Activity className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{inventoryLots.filter(item => item.status === 'quarantined').length}</div>
          <p className="mt-1 text-[10px] text-zinc-400">Requires QA review</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-zinc-400">Ready for Use</span>
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{inventoryLots.filter(item => item.status === 'available').length}</div>
          <p className="mt-1 text-[10px] text-zinc-400">Operationally clear</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Lot Register</span>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2.5 px-3">Lot ID</th>
                <th className="py-2.5 px-3">Reagent</th>
                <th className="py-2.5 px-3">Available</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Updated At</th>
              </tr>
            </thead>
            <tbody className="text-[10px] text-zinc-600 dark:text-zinc-300">
              {inventoryLots.map(item => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 align-top">
                  <td className="py-3 px-3 font-bold text-zinc-800 dark:text-zinc-100">{item.lotId}</td>
                  <td className="py-3 px-3">{item.reagentName}</td>
                  <td className="py-3 px-3">{item.availableUnits} units</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${item.status === 'available' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : item.status === 'low-stock' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' : item.status === 'quarantined' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">{new Date(item.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
