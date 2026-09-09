import { useState, type ReactNode } from 'react';
import { Cpu, Pencil, Plus, Stethoscope, Trash2, UserRound } from 'lucide-react';
import { DoctorRecord } from '../types/doctors';
import { TechnicianRecord } from '../types/technicians';
import { DeviceType, LabDevice, DeviceProtocol, DeviceStatus } from '../types/device';

type MasterDataViewProps = {
  doctors: DoctorRecord[];
  technicians: TechnicianRecord[];
  devices: LabDevice[];
  onSaveDoctor: (record: DoctorRecord) => void;
  onDeleteDoctor: (id: string) => void;
  onSaveTechnician: (record: TechnicianRecord) => void;
  onDeleteTechnician: (id: string) => void;
  onSaveDevice: (record: LabDevice) => void;
  onDeleteDevice: (id: string) => void;
};

const blankDoctor: DoctorRecord = { id: '', name: '', qualification: 'MD (Pathology)', specialty: 'Clinical Pathology', registrationNumber: '', department: 'Pathology', active: true };
const blankTechnician: TechnicianRecord = { id: '', name: '', role: 'Medical Laboratory Technician', department: 'Laboratory', employeeNumber: '', active: true };
const blankDevice: LabDevice = { id: '', name: '', manufacturer: '', model: '', deviceType: 'analyzer', department: '', protocol: 'HL7', endpoint: '', serialNumber: '', firmwareVersion: '', status: 'offline', enabled: false, load: 0, reagentLevel: 100, lastSeenAt: 'Not connected' };

export function MasterDataView(props: MasterDataViewProps) {
  const [tab, setTab] = useState<'doctors' | 'technicians' | 'devices'>('doctors');
  const [doctor, setDoctor] = useState<DoctorRecord | null>(null);
  const [technician, setTechnician] = useState<TechnicianRecord | null>(null);
  const [device, setDevice] = useState<LabDevice | null>(null);
  const nextId = (prefix: string, records: Array<{ id: string }>) => `${prefix}-${String(records.length + 1).padStart(4, '0')}`;

  const saveDoctor = () => { if (!doctor?.name.trim()) return; props.onSaveDoctor({ ...doctor, id: doctor.id || nextId('DOC', props.doctors) }); setDoctor(null); };
  const saveTechnician = () => { if (!technician?.name.trim()) return; props.onSaveTechnician({ ...technician, id: technician.id || nextId('TECH', props.technicians) }); setTechnician(null); };
  const saveDevice = () => { if (!device?.name.trim() || !device.serialNumber.trim()) return; props.onSaveDevice({ ...device, id: device.id || nextId('DEV', props.devices) }); setDevice(null); };

  const input = (value: string, onChange: (value: string) => void, placeholder: string) => <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-950" />;
  const actionButton = (label: string, onClick: () => void) => <button type="button" onClick={onClick} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white cursor-pointer"><Plus className="h-3.5 w-3.5" />{label}</button>;
  const tabs = [{ key: 'doctors', label: 'Doctors', icon: Stethoscope }, { key: 'technicians', label: 'Technicians', icon: UserRound }, { key: 'devices', label: 'Machines / Devices', icon: Cpu }] as const;

  return <div className="space-y-6">
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm"><h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Master Data</h2><p className="mt-1 text-[11px] text-zinc-400">Manage doctors, technicians, machines, and devices used by laboratory workflows and reports.</p><div className="mt-4 flex flex-wrap gap-2">{tabs.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => setTab(key)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer ${tab === key ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}><Icon className="h-4 w-4" />{label}</button>)}</div></div>

    {tab === 'doctors' && <Registry title="Doctor Master" addLabel="Add Doctor" onAdd={() => setDoctor({ ...blankDoctor })} columns={['Doctor', 'Qualification', 'Specialty', 'Registration', 'Status']} rows={props.doctors.map(record => [record.name, record.qualification, record.specialty, record.registrationNumber, record.active ? 'Active' : 'Inactive'])} actions={props.doctors.map(record => <Actions onEdit={() => setDoctor({ ...record })} onDelete={() => props.onDeleteDoctor(record.id)} />)} />}
    {tab === 'technicians' && <Registry title="Technician Master" addLabel="Add Technician" onAdd={() => setTechnician({ ...blankTechnician })} columns={['Technician', 'Role', 'Department', 'Employee No.', 'Status']} rows={props.technicians.map(record => [record.name, record.role, record.department, record.employeeNumber, record.active ? 'Active' : 'Inactive'])} actions={props.technicians.map(record => <Actions onEdit={() => setTechnician({ ...record })} onDelete={() => props.onDeleteTechnician(record.id)} />)} />}
    {tab === 'devices' && <Registry title="Machine and Device Master" addLabel="Add Device" onAdd={() => setDevice({ ...blankDevice })} columns={['Device', 'Type', 'Department', 'Serial No.', 'Status']} rows={props.devices.map(record => [record.name, record.deviceType, record.department, record.serialNumber, record.status])} actions={props.devices.map(record => <Actions onEdit={() => setDevice({ ...record })} onDelete={() => props.onDeleteDevice(record.id)} />)} />}

    {doctor && <Modal title={doctor.id ? 'Edit Doctor' : 'Add Doctor'} onClose={() => setDoctor(null)} onSave={saveDoctor}>{input(doctor.name, value => setDoctor({ ...doctor, name: value }), 'Doctor name')}{input(doctor.qualification, value => setDoctor({ ...doctor, qualification: value }), 'Qualification')}{input(doctor.specialty, value => setDoctor({ ...doctor, specialty: value }), 'Specialty')}{input(doctor.registrationNumber, value => setDoctor({ ...doctor, registrationNumber: value }), 'Registration number')}{input(doctor.department, value => setDoctor({ ...doctor, department: value }), 'Department')}</Modal>}
    {technician && <Modal title={technician.id ? 'Edit Technician' : 'Add Technician'} onClose={() => setTechnician(null)} onSave={saveTechnician}>{input(technician.name, value => setTechnician({ ...technician, name: value }), 'Technician name')}{input(technician.role, value => setTechnician({ ...technician, role: value }), 'Role')}{input(technician.department, value => setTechnician({ ...technician, department: value }), 'Department')}{input(technician.employeeNumber, value => setTechnician({ ...technician, employeeNumber: value }), 'Employee number')}</Modal>}
    {device && <Modal title={device.id ? 'Edit Device' : 'Add Device'} onClose={() => setDevice(null)} onSave={saveDevice}>{input(device.name, value => setDevice({ ...device, name: value }), 'Device name')}{input(device.manufacturer, value => setDevice({ ...device, manufacturer: value }), 'Manufacturer')}{input(device.model, value => setDevice({ ...device, model: value }), 'Model')}{input(device.department, value => setDevice({ ...device, department: value }), 'Department')}{input(device.serialNumber, value => setDevice({ ...device, serialNumber: value }), 'Serial number')}{input(device.endpoint, value => setDevice({ ...device, endpoint: value }), 'Endpoint / IP / port')}</Modal>}
  </div>;
}

function Registry({ title, addLabel, onAdd, columns, rows, actions }: { title: string; addLabel: string; onAdd: () => void; columns: string[]; rows: string[][]; actions: ReactNode[] }) {
  return <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden"><div className="flex items-center justify-between border-b border-zinc-200/60 p-4 dark:border-zinc-800"><span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">{title}</span>{<button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white cursor-pointer"><Plus className="h-3.5 w-3.5" />{addLabel}</button>}</div><div className="overflow-x-auto p-4"><table className="w-full text-left text-xs"><thead><tr className="border-b text-[10px] uppercase tracking-widest text-zinc-400">{columns.map(column => <th key={column} className="px-3 py-2">{column}</th>)}<th className="px-3 py-2">Actions</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="border-b border-zinc-100 dark:border-zinc-800">{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{cell}</td>)}<td className="px-3 py-3">{actions[index]}</td></tr>)}</tbody></table></div></div>;
}

function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) { return <div className="flex gap-2"><button type="button" title="Edit" onClick={onEdit} className="rounded-lg bg-zinc-100 p-2 text-zinc-600 cursor-pointer dark:bg-zinc-800 dark:text-zinc-300"><Pencil className="h-3.5 w-3.5" /></button><button type="button" title="Delete" onClick={onDelete} className="rounded-lg bg-rose-50 p-2 text-rose-600 cursor-pointer dark:bg-rose-950/30"><Trash2 className="h-3.5 w-3.5" /></button></div>; }

function Modal({ title, children, onClose, onSave }: { title: string; children: ReactNode; onClose: () => void; onSave: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900"><div className="flex items-center justify-between"><h3 className="font-bold">{title}</h3><button type="button" onClick={onClose} className="text-zinc-400 cursor-pointer">Close</button></div><div className="space-y-3">{children}</div><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold cursor-pointer">Cancel</button><button type="button" onClick={onSave} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white cursor-pointer">Save</button></div></div></div>; }
