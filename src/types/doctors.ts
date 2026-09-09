export interface DoctorRecord {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  registrationNumber: string;
  department: string;
  active: boolean;
}

export const MASTER_DOCTOR_REGISTRY: DoctorRecord[] = [
  {
    id: 'DOC-0001',
    name: 'Dr. S.P. Arivarasan',
    qualification: 'MD (Pathology)',
    specialty: 'Clinical Pathology',
    registrationNumber: 'PATH-2026-0001',
    department: 'Pathology',
    active: true
  }
];
