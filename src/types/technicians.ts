export interface TechnicianRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  employeeNumber: string;
  active: boolean;
}

export const MASTER_TECHNICIAN_REGISTRY: TechnicianRecord[] = [
  { id: 'TECH-0001', name: 'Marcus Vance', role: 'Phlebotomist', department: 'Pre-Analytics', employeeNumber: 'EMP-1021', active: true },
  { id: 'TECH-0002', name: 'Sarah Jenkins', role: 'Sample Coordinator', department: 'Patient Services', employeeNumber: 'EMP-1042', active: true }
];
