import { useMemo } from 'react';
import { CheckCircle2, KeyRound, Mail, ShieldCheck, UserCog, UserX } from 'lucide-react';
import { ManagedUser } from '../types/users';

interface UserManagementViewProps {
  users: ManagedUser[];
  onToggleUser: (id: string) => void;
}

const roleStyles: Record<ManagedUser['role'], string> = {
  Administrator: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  Receptionist: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  Phlebotomist: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
};

export function UserManagementView({ users, onToggleUser }: UserManagementViewProps) {
  const activeCount = useMemo(() => users.filter(user => user.status === 'active').length, [users]);
  const mfaCount = useMemo(() => users.filter(user => user.mfaEnabled).length, [users]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><UserCog className="h-6 w-6" /></div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">User Management</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Control identity status, operational roles, access scope, and MFA coverage.</p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-300"><ShieldCheck className="h-4 w-4" />{activeCount} active accounts</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><span className="text-[10px] uppercase font-black text-zinc-400">Registered Users</span><div className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{users.length}</div><p className="mt-1 text-[10px] text-zinc-400">Identity records in registry</p></div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><span className="text-[10px] uppercase font-black text-zinc-400">MFA Protected</span><div className="mt-4 text-3xl font-black text-emerald-600">{mfaCount}</div><p className="mt-1 text-[10px] text-zinc-400">Accounts with second factor</p></div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><span className="text-[10px] uppercase font-black text-zinc-400">Disabled / Locked</span><div className="mt-4 text-3xl font-black text-rose-600">{users.filter(user => user.status !== 'active').length}</div><p className="mt-1 text-[10px] text-zinc-400">Access blocked from operations</p></div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20"><span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Identity & Access Registry</span></div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="text-[9px] uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-zinc-800"><th className="py-2.5 px-3">User</th><th className="py-2.5 px-3">Role / Department</th><th className="py-2.5 px-3">Location</th><th className="py-2.5 px-3">Security</th><th className="py-2.5 px-3">Status</th><th className="py-2.5 px-3">Control</th></tr></thead>
            <tbody className="text-[10px] text-zinc-600 dark:text-zinc-300">
              {users.map(user => (
                <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
                  <td className="py-3 px-3"><div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-black text-indigo-700 dark:text-indigo-300">{user.fullName.split(' ').map(part => part[0]).slice(0, 2).join('')}</div><div><div className="font-bold text-zinc-800 dark:text-zinc-100">{user.fullName}</div><div className="flex items-center gap-1 text-[9px] text-zinc-400"><Mail className="h-3 w-3" />{user.email} · {user.username}</div></div></div></td>
                  <td className="py-3 px-3"><span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${roleStyles[user.role]}`}>{user.role}</span><div className="mt-1 text-[9px] text-zinc-400">{user.department}</div></td>
                  <td className="py-3 px-3">{user.location}</td>
                  <td className="py-3 px-3"><div className="flex items-center gap-1 font-bold">{user.mfaEnabled ? <><KeyRound className="h-3.5 w-3.5 text-emerald-500" /> MFA enabled</> : <><UserX className="h-3.5 w-3.5 text-amber-500" /> MFA pending</>}</div><div className="mt-1 text-[9px] text-zinc-400">Last login: {user.lastLogin}</div></td>
                  <td className="py-3 px-3"><span className={`inline-flex rounded-full px-2 py-0.5 font-bold ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : user.status === 'locked' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>{user.status}</span></td>
                  <td className="py-3 px-3"><button type="button" onClick={() => onToggleUser(user.id)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${user.status === 'active' ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>{user.status === 'active' ? <UserX className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{user.status === 'active' ? 'Disable' : 'Enable'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
