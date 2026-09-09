import { LimsRole } from './lims';

export type UserStatus = 'active' | 'disabled' | 'locked';

export interface ManagedUser {
  id: string;
  username: string;
  fullName: string;
  role: LimsRole;
  department: string;
  location: string;
  email: string;
  status: UserStatus;
  lastLogin: string;
  mfaEnabled: boolean;
}

export const MASTER_USER_REGISTRY: ManagedUser[] = [
  {
    id: 'USR-0001', username: 'admin_demo', fullName: 'Dr. Alistair Sterling', role: 'Administrator', department: 'Executive Pathology', location: 'Central Hub', email: 'alistair.sterling@cybe.lab', status: 'active', lastLogin: 'Today, 09:14', mfaEnabled: true
  },
  {
    id: 'USR-0002', username: 'reception_demo', fullName: 'Sarah Jenkins', role: 'Receptionist', department: 'Patient Services', location: 'Central Hub', email: 'sarah.jenkins@cybe.lab', status: 'active', lastLogin: 'Today, 08:42', mfaEnabled: true
  },
  {
    id: 'USR-0003', username: 'phleb_demo', fullName: 'Marcus Vance, CPT', role: 'Phlebotomist', department: 'Pre-Analytics', location: 'Central Hub', email: 'marcus.vance@cybe.lab', status: 'active', lastLogin: 'Yesterday, 16:28', mfaEnabled: false
  },
  {
    id: 'USR-0004', username: 'qa_reviewer', fullName: 'Nadia Rahman', role: 'Administrator', department: 'Quality Assurance', location: 'North Branch', email: 'nadia.rahman@cybe.lab', status: 'disabled', lastLogin: '05 Sep 2026, 11:03', mfaEnabled: true
  }
];
