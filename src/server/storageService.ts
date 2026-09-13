/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs/promises';
import path from 'path';
import { Patient } from '../types/lims_app';
import { LabDevice, MASTER_DEVICE_REGISTRY } from '../types/device';
import { DoctorRecord, MASTER_DOCTOR_REGISTRY } from '../types/doctors';
import { TechnicianRecord, MASTER_TECHNICIAN_REGISTRY } from '../types/technicians';
import { TestMaster, MASTER_TEST_REGISTRY } from '../types/testMaster';

const DATA_DIR = path.resolve('.', 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const DEVICES_FILE = path.join(DATA_DIR, 'devices.json');
const DOCTORS_FILE = path.join(DATA_DIR, 'doctors.json');
const TECHNICIANS_FILE = path.join(DATA_DIR, 'technicians.json');
const TEST_MASTERS_FILE = path.join(DATA_DIR, 'test_masters.json');
const BIOBANK_FILE = path.join(DATA_DIR, 'biobank_storage.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('[StorageService] Error creating data directory:', err);
  }
}

// Atomic file write using temporary file
async function writeAtomicJson(filePath: string, data: any) {
  await ensureDataDir();
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}

async function readJsonSafe<T>(filePath: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    // If file doesn't exist, seed with fallback and return
    await writeAtomicJson(filePath, fallback);
    return fallback;
  }
}

// Seed patients
const SEED_PATIENTS: Patient[] = [
  {
    id: '01',
    patientId: 'BML01964',
    name: 'Mr. TEST DUMMY',
    age: 36,
    gender: 'M',
    ageUnitStr: '36 Y 1 M / M',
    bookingNo: 'B-2026-9081',
    bookingDate: '05-May-2025',
    contactNo: '9876543210',
    referralType: 'B2C',
    status: 'Pending',
    phlebotomist: 'Sarah Jenkins',
    apptDttm: '05 May 2025, 11:08 AM',
    testPanel: 'Fasting G.U.J',
    priority: 'Routine',
    billingAmount: 10,
    paymentStatus: 'Paid',
    uhid: 'UHID123456',
    mrn: 'MRN123456',
    registrationDate: '05 May 2025, 11:08 AM',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80',
    billDetails: {
      visitId: '1002789',
      visitDate: '05-05-2025 11:08 AM',
      gross: 10.00,
      discount: 0.00,
      vat: 0.00,
      net: 10.00,
      roundOff: 0.00,
      collected: 10.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 10.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Fasting G.U.J',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'Registered',
        barcodeNo: 'BAR-100278',
        remarks: ''
      }
    ]
  },
  {
    id: '02',
    patientId: 'BML01963',
    name: 'Mr. RAJESH SHARMA',
    age: 46,
    gender: 'M',
    ageUnitStr: '46 Y 5 M / M',
    bookingNo: 'B-2026-4412',
    bookingDate: '05-May-2025',
    contactNo: '9876543210',
    referralType: 'B2C',
    status: 'In Progress',
    phlebotomist: 'Sarah Jenkins',
    apptDttm: '05 May 2025, 11:08 AM',
    testPanel: 'Fasting G.U.J',
    priority: 'Routine',
    billingAmount: 10,
    paymentStatus: 'Paid',
    uhid: 'UHID887766',
    mrn: 'MRN887766',
    registrationDate: '05 May 2025, 11:08 AM',
    billDetails: {
      visitId: '1002790',
      visitDate: '05-05-2025 11:08 AM',
      gross: 10.00,
      discount: 0.00,
      vat: 0.00,
      net: 10.00,
      roundOff: 0.00,
      collected: 10.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 10.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Fasting G.U.J',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'In Progress',
        barcodeNo: 'BAR-4412-01',
        remarks: ''
      }
    ]
  },
  {
    id: '03',
    patientId: 'BML01962',
    name: 'Mrs. LALITHA DEVI',
    age: 52,
    gender: 'F',
    ageUnitStr: '52 Y 2 M / F',
    bookingNo: 'B-2026-4491',
    bookingDate: '05-May-2025',
    contactNo: '9871122334',
    referralType: 'Corporate',
    status: 'In Progress',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 09:30 AM',
    testPanel: 'Complete Blood Count (CBC)',
    priority: 'STAT',
    billingAmount: 250,
    paymentStatus: 'Paid',
    uhid: 'UHID994411',
    mrn: 'MRN994411',
    registrationDate: '05 May 2025, 09:30 AM',
    billDetails: {
      visitId: '1002801',
      visitDate: '05-05-2025 09:30 AM',
      gross: 250.00,
      discount: 0.00,
      vat: 0.00,
      net: 250.00,
      roundOff: 0.00,
      collected: 250.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 250.00,
      doctorName: 'Dr. Sarah Jenkins MD',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Complete Blood Count (CBC)',
        sample: 'Whole Blood (EDTA)',
        department: 'Hematology',
        status: 'In Progress',
        barcodeNo: 'BAR-4491-01',
        remarks: 'STAT analysis requested'
      }
    ]
  },
  {
    id: '04',
    patientId: 'BML01960',
    name: 'Ms. SARAH VANCE',
    age: 28,
    gender: 'F',
    ageUnitStr: '28 Y 8 M / F',
    bookingNo: 'B-2026-1188',
    bookingDate: '05-May-2025',
    contactNo: '9811223344',
    referralType: 'B2C',
    status: 'Completed',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 08:15 AM',
    testPanel: 'Complete Blood Count (CBC)',
    priority: 'Routine',
    billingAmount: 250,
    paymentStatus: 'Paid',
    uhid: 'UHID554433',
    mrn: 'MRN554433',
    registrationDate: '05 May 2025, 08:15 AM',
    collectionDttm: '05 May 2025, 08:22 AM',
    processedDttm: '05 May 2025, 08:50 AM',
    reportedDttm: '05 May 2025, 09:15 AM',
    reportStatus: 'REVIEWED',
    testResults: [
      { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', reference: '12.0 - 16.0', flag: 'N' },
      { name: 'WBC Count', value: '7.2', unit: 'x10^3/uL', reference: '4.0 - 11.0', flag: 'N' },
      { name: 'RBC Count', value: '4.65', unit: 'x10^6/uL', reference: '4.2 - 5.4', flag: 'N' },
      { name: 'Platelets', value: '230', unit: 'x10^3/uL', reference: '150 - 450', flag: 'N' },
      { name: 'MCV', value: '89.0', unit: 'fL', reference: '80 - 100', flag: 'N' },
      { name: 'MCH', value: '29.7', unit: 'pg', reference: '27 - 33', flag: 'N' },
      { name: 'MCHC', value: '33.4', unit: 'g/dL', reference: '31.5 - 36.5', flag: 'N' }
    ],
    servicesList: [
      {
        id: 's1',
        serviceName: 'Complete Blood Count (CBC)',
        sample: 'Whole Blood (EDTA)',
        department: 'Hematology',
        status: 'Completed',
        barcodeNo: 'BAR-1188-01',
        remarks: 'Sample verified'
      }
    ]
  }
];

export interface BiobankStorageItem {
  id: string;
  parentSpecimenBarcode: string;
  aliquotBarcode: string;
  aliquotType: 'Serum' | 'Plasma' | 'Whole Blood' | 'DNA Extract' | 'Buffy Coat';
  volumeUl: number;
  freezerName: string;
  rackId: string;
  boxId: string;
  wellCoordinate: string;
  freezeThawCycles: number;
  storedAt: string;
  storedBy: string;
}

const SEED_BIOBANK: BiobankStorageItem[] = [
  {
    id: 'BIO-001',
    parentSpecimenBarcode: 'BAR-100278',
    aliquotBarcode: 'ALQ-100278-A',
    aliquotType: 'Serum',
    volumeUl: 500,
    freezerName: 'Ultra-Low Freezer -80C (Hub 1)',
    rackId: 'Rack-02',
    boxId: 'Box-A4',
    wellCoordinate: 'C3',
    freezeThawCycles: 0,
    storedAt: '2026-05-05T11:30:00Z',
    storedBy: 'Sarah Jenkins'
  },
  {
    id: 'BIO-002',
    parentSpecimenBarcode: 'BAR-4491-01',
    aliquotBarcode: 'ALQ-4491-A',
    aliquotType: 'Plasma',
    volumeUl: 750,
    freezerName: 'Cryo-Chest -20C (Biochem)',
    rackId: 'Rack-01',
    boxId: 'Box-B1',
    wellCoordinate: 'A1',
    freezeThawCycles: 1,
    storedAt: '2026-05-05T09:45:00Z',
    storedBy: 'Marcus Vance'
  }
];

export class StorageService {
  // Patients
  static async getPatients(): Promise<Patient[]> {
    return readJsonSafe<Patient[]>(PATIENTS_FILE, SEED_PATIENTS);
  }

  static async savePatient(patient: Patient): Promise<Patient[]> {
    const patients = await this.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    let updated: Patient[];
    if (index >= 0) {
      updated = patients.map((p, i) => i === index ? { ...patient } : p);
    } else {
      updated = [patient, ...patients];
    }
    await writeAtomicJson(PATIENTS_FILE, updated);
    return updated;
  }

  static async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const patients = await this.getPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index < 0) return null;
    const updatedPatient: Patient = { ...patients[index], ...updates };
    patients[index] = updatedPatient;
    await writeAtomicJson(PATIENTS_FILE, patients);
    return updatedPatient;
  }

  static async deletePatient(id: string): Promise<boolean> {
    const patients = await this.getPatients();
    const filtered = patients.filter(p => p.id !== id);
    if (filtered.length === patients.length) return false;
    await writeAtomicJson(PATIENTS_FILE, filtered);
    return true;
  }

  // Master Data
  static async getDevices(): Promise<LabDevice[]> {
    return readJsonSafe<LabDevice[]>(DEVICES_FILE, MASTER_DEVICE_REGISTRY);
  }

  static async saveDevices(devices: LabDevice[]): Promise<void> {
    await writeAtomicJson(DEVICES_FILE, devices);
  }

  static async getDoctors(): Promise<DoctorRecord[]> {
    return readJsonSafe<DoctorRecord[]>(DOCTORS_FILE, MASTER_DOCTOR_REGISTRY);
  }

  static async getTechnicians(): Promise<TechnicianRecord[]> {
    return readJsonSafe<TechnicianRecord[]>(TECHNICIANS_FILE, MASTER_TECHNICIAN_REGISTRY);
  }

  static async getTestMasters(): Promise<TestMaster[]> {
    return readJsonSafe<TestMaster[]>(TEST_MASTERS_FILE, MASTER_TEST_REGISTRY);
  }

  // Biobank
  static async getBiobankStorage(): Promise<BiobankStorageItem[]> {
    return readJsonSafe<BiobankStorageItem[]>(BIOBANK_FILE, SEED_BIOBANK);
  }

  static async saveBiobankAliquot(item: BiobankStorageItem): Promise<BiobankStorageItem[]> {
    const current = await this.getBiobankStorage();
    const updated = [item, ...current];
    await writeAtomicJson(BIOBANK_FILE, updated);
    return updated;
  }
}
