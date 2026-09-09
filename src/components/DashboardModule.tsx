/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  LogOut, User, Activity, CheckCircle, Database, FileText, FlaskConical, 
  Printer, Plus, Users, BarChart3, Search, Bell, AlertTriangle, 
  Layers, Clock, Filter, Sparkles, Check, RefreshCw, Smartphone,
  Sun, Moon, MapPin, ChevronDown, ChevronLeft, ChevronRight, UserPlus,
  Building2, ClipboardList, ExternalLink, Home, Calendar,
  ShieldCheck, Truck, Menu, X, ShieldAlert, Cpu, Palette, Scale, Dna, Terminal, ClipboardCheck, Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LimsRole } from '../types/lims';
import { Patient, TestResult } from '../types/lims_app';
import { CustomTheme } from '../types/theme';
import { LabDevice, MASTER_DEVICE_REGISTRY, getEnabledDevices } from '../types/device';
import { getStoredThemeForUser, applyThemeToDocument, getFontSizePx } from '../utils/themeUtils';

import { DashboardHome } from './DashboardHome';
import { B2CRegistration } from './B2CRegistration';
import { B2BRegistration } from './B2BRegistration';
import { PhlebotomyView } from './PhlebotomyView';
import { TechnicianView } from './TechnicianView';
import { AuthorizationView } from './AuthorizationView';
import { DispatchView } from './DispatchView';
import { PatientListView } from './PatientListView';
import { PatientDetailsModal } from './PatientDetailsModal';
import { ThemeCustomizerView } from './ThemeCustomizerView';
import { RevenueDashboardView } from './RevenueDashboardView';
import { PortParityView } from './PortParityView';
import { MolecularPlateView } from './MolecularPlateView';
import { QualityView } from './QualityView';
import { InventoryView } from './InventoryView';
import { CalibrationView } from './CalibrationView';
import { DeviceMasterView } from './DeviceMasterView';
import { CybeLogo } from './CybeLogo';

interface DashboardModuleProps {
  username: string;
  role: LimsRole;
  fullName: string;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function createBarcodeSvg(value: string) {
  let x = 12;
  const bars: string[] = [];

  for (const character of value) {
    const bits = character.charCodeAt(0).toString(2).padStart(8, '0');
    for (const bit of bits) {
      const width = bit === '1' ? 3 : 1;
      bars.push(`<rect x="${x}" y="8" width="${width}" height="58" fill="#111827"/>`);
      x += width + 1;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x + 12} 82" width="100%" height="82" role="img" aria-label="Barcode ${value}">${bars.join('')}<text x="${(x + 12) / 2}" y="79" text-anchor="middle" font-family="Arial, sans-serif" font-size="10">${value}</text></svg>`;
}

const INITIAL_PATIENTS: Patient[] = [
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
    consentFormFileName: 'consent_form_signed.pdf',
    billDetails: {
      visitId: '1002789',
      visitDate: '05-05-2025 11:08 AM',
      gross: 10.00,
      discount: 0.00,
      vat: 0.00,
      net: 10.00,
      roundOff: 0.00,
      collected: 0.00,
      due: 0.20,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 10.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Partially Cancelled'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Fasting G.U.J',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'Registered',
        barcodeNo: 'Yet to be processed',
        remarks: ''
      }
    ]
  },
  {
    id: '02',
    patientId: 'BML01963',
    name: 'Mr. TEST DUMMY',
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
    uhid: 'UHID123456',
    mrn: 'MRN123456',
    registrationDate: '05 May 2025, 11:08 AM',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: undefined,
    billDetails: {
      visitId: '1002789',
      visitDate: '05-05-2025 11:08 AM',
      gross: 10.00,
      discount: 0.00,
      vat: 0.00,
      net: 10.00,
      roundOff: 0.00,
      collected: 0.00,
      due: 0.20,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 10.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Partially Cancelled'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Fasting G.U.J',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'Registered',
        barcodeNo: 'Yet to be processed',
        remarks: ''
      }
    ]
  },
  {
    id: '03',
    patientId: 'BML01600',
    name: 'Mr. PARTHA',
    age: 54,
    gender: 'M',
    ageUnitStr: '54 Y / M',
    bookingNo: 'B-2026-1025',
    bookingDate: '05-May-2025',
    contactNo: '9812345678',
    referralType: 'Self',
    status: 'Completed',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 10:30 AM',
    testPanel: 'HbA1c & Fasting Glucose',
    priority: 'Urgent',
    billingAmount: 350,
    paymentStatus: 'Paid',
    uhid: 'UHID992211',
    mrn: 'MRN992211',
    registrationDate: '05 May 2025, 10:30 AM',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: 'consent_partha.pdf',
    billDetails: {
      visitId: '1002801',
      visitDate: '05-05-2025 10:30 AM',
      gross: 350.00,
      discount: 0.00,
      vat: 0.00,
      net: 350.00,
      roundOff: 0.00,
      collected: 350.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 350.00,
      doctorName: 'Self',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'HbA1c Testing',
        sample: 'Whole Blood',
        department: 'Biochemistry',
        status: 'Completed',
        barcodeNo: 'BAR-33212',
        remarks: 'Sample processed'
      }
    ],
    collectionDttm: '05 May 2025, 10:42 AM',
    testResults: [
      { name: 'Fasting Plasma Glucose', value: '92', unit: 'mg/dL', reference: '70 - 100', flag: 'N' },
      { name: 'Post Prandial Glucose', value: '128', unit: 'mg/dL', reference: '80 - 140', flag: 'N' },
      { name: 'HbA1c', value: '5.6', unit: '%', reference: '< 5.7', flag: 'N' }
    ]
  },
  {
    id: '04',
    patientId: 'BML01825',
    name: 'Mrs. ANITA SHARMA',
    age: 38,
    gender: 'F',
    ageUnitStr: '38 Y 7 M / F',
    bookingNo: 'B-2026-8871',
    bookingDate: '05-May-2025',
    contactNo: '9811223344',
    referralType: 'B2C',
    status: 'In Progress',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 11:30 AM',
    testPanel: 'Complete Blood Count (CBC)',
    priority: 'Routine',
    billingAmount: 250,
    paymentStatus: 'Paid',
    uhid: 'UHID887711',
    mrn: 'MRN887711',
    registrationDate: '05 May 2025, 11:30 AM',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: undefined,
    billDetails: {
      visitId: '1002812',
      visitDate: '05-05-2025 11:30 AM',
      gross: 250.00,
      discount: 10.00,
      vat: 0.00,
      net: 240.00,
      roundOff: 0.00,
      collected: 240.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 240.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Complete Blood Count (CBC)',
        sample: 'Whole Blood',
        department: 'Hematology',
        status: 'In Progress',
        barcodeNo: 'BAR-11881',
        remarks: ''
      }
    ]
  },
  {
    id: '05',
    patientId: 'BML01826',
    name: 'Mr. RAMESH KUMAR',
    age: 56,
    gender: 'M',
    ageUnitStr: '56 Y 5 M / M',
    bookingNo: 'B-2026-3029',
    bookingDate: '05-May-2025',
    contactNo: '9877665544',
    referralType: 'Self',
    status: 'Pending',
    phlebotomist: 'Unassigned',
    apptDttm: '05 May 2025, 02:00 PM',
    testPanel: 'Lipid Profile',
    priority: 'Routine',
    billingAmount: 400,
    paymentStatus: 'Paid',
    uhid: 'UHID554433',
    mrn: 'MRN554433',
    registrationDate: '05 May 2025, 02:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: 'consent_ramesh.pdf',
    billDetails: {
      visitId: '1002834',
      visitDate: '05-05-2025 02:00 PM',
      gross: 400.00,
      discount: 0.00,
      vat: 0.00,
      net: 400.00,
      roundOff: 0.00,
      collected: 400.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 400.00,
      doctorName: 'Self',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Lipid Profile',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'Registered',
        barcodeNo: 'Yet to be processed',
        remarks: ''
      }
    ]
  },
  {
    id: '06',
    patientId: 'BML01827',
    name: 'Mrs. LALITHA DEVI',
    age: 33,
    gender: 'F',
    ageUnitStr: '33 Y 10 M / F',
    bookingNo: 'B-2026-5521',
    bookingDate: '05-May-2025',
    contactNo: '9822334455',
    referralType: 'B2B (Apollo)',
    status: 'Completed',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 09:15 AM',
    testPanel: 'Thyroid Panel',
    priority: 'STAT',
    billingAmount: 500,
    paymentStatus: 'Paid',
    uhid: 'UHID112299',
    mrn: 'MRN112299',
    registrationDate: '05 May 2025, 09:15 AM',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: 'consent_lalitha.pdf',
    billDetails: {
      visitId: '1002845',
      visitDate: '05-05-2025 09:15 AM',
      gross: 500.00,
      discount: 50.00,
      vat: 0.00,
      net: 450.00,
      roundOff: 0.00,
      collected: 450.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 450.00,
      doctorName: 'Dr. Amit Patel',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Thyroid Panel',
        sample: 'Serum',
        department: 'Immunology',
        status: 'Completed',
        barcodeNo: 'BAR-44919',
        remarks: 'All parameters normal'
      }
    ],
    collectionDttm: '05 May 2025, 09:27 AM',
    testResults: [
      { name: 'TSH', value: '2.1', unit: 'mIU/L', reference: '0.4 - 4.0', flag: 'N' },
      { name: 'Free T4', value: '1.2', unit: 'ng/dL', reference: '0.8 - 1.8', flag: 'N' },
      { name: 'Free T3', value: '3.1', unit: 'pg/mL', reference: '2.3 - 4.2', flag: 'N' }
    ]
  },
  {
    id: '07',
    patientId: 'BML01828',
    name: 'Mr. SURESH NAIR',
    age: 49,
    gender: 'M',
    ageUnitStr: '49 Y 3 M / M',
    bookingNo: 'B-2026-7788',
    bookingDate: '05-May-2025',
    contactNo: '9844556677',
    referralType: 'Corporate',
    status: 'In Progress',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 10:00 AM',
    testPanel: 'Liver Function Test (LFT)',
    priority: 'Routine',
    billingAmount: 350,
    paymentStatus: 'Paid',
    uhid: 'UHID228833',
    mrn: 'MRN228833',
    registrationDate: '05 May 2025, 10:00 AM',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: undefined,
    billDetails: {
      visitId: '1002856',
      visitDate: '05-05-2025 10:00 AM',
      gross: 350.00,
      discount: 0.00,
      vat: 0.00,
      net: 350.00,
      roundOff: 0.00,
      collected: 350.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 350.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Liver Function Test (LFT)',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'In Progress',
        barcodeNo: 'BAR-55611',
        remarks: ''
      }
    ]
  },
  {
    id: '08',
    patientId: 'BML01829',
    name: 'Mrs. MEENA IYER',
    age: 41,
    gender: 'F',
    ageUnitStr: '41 Y 6 M / F',
    bookingNo: 'B-2026-8811',
    bookingDate: '05-May-2025',
    contactNo: '9855667788',
    referralType: 'B2B (Max Labs)',
    status: 'Completed',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 08:30 AM',
    testPanel: 'Renal Profile',
    priority: 'Routine',
    billingAmount: 380,
    paymentStatus: 'Paid',
    uhid: 'UHID443322',
    mrn: 'MRN443322',
    registrationDate: '05 May 2025, 08:30 AM',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: 'consent_meena.pdf',
    billDetails: {
      visitId: '1002867',
      visitDate: '05-05-2025 08:30 AM',
      gross: 380.00,
      discount: 0.00,
      vat: 0.00,
      net: 380.00,
      roundOff: 0.00,
      collected: 380.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 380.00,
      doctorName: 'Sarah Jenkins',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Renal Profile',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'Completed',
        barcodeNo: 'BAR-66712',
        remarks: 'BUN high'
      }
    ],
    collectionDttm: '05 May 2025, 08:44 AM',
    testResults: [
      { name: 'Urea', value: '52', unit: 'mg/dL', reference: '15 - 45', flag: 'H' },
      { name: 'Creatinine', value: '1.0', unit: 'mg/dL', reference: '0.7 - 1.3', flag: 'N' },
      { name: 'Uric Acid', value: '5.2', unit: 'mg/dL', reference: '3.4 - 7.0', flag: 'N' },
      { name: 'Sodium', value: '139', unit: 'mmol/L', reference: '135 - 145', flag: 'N' },
      { name: 'Potassium', value: '4.2', unit: 'mmol/L', reference: '3.5 - 5.1', flag: 'N' },
      { name: 'Chloride', value: '102', unit: 'mmol/L', reference: '98 - 107', flag: 'N' }
    ]
  },
  {
    id: '09',
    patientId: 'BML01830',
    name: 'Mr. VIJAY REDDY',
    age: 54,
    gender: 'M',
    ageUnitStr: '54 Y 9 M / M',
    bookingNo: 'B-2026-1122',
    bookingDate: '05-May-2025',
    contactNo: '9866778899',
    referralType: 'Corporate',
    status: 'Pending',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 04:00 PM',
    testPanel: 'HbA1c',
    priority: 'Routine',
    billingAmount: 300,
    paymentStatus: 'Paid',
    uhid: 'UHID776655',
    mrn: 'MRN776655',
    registrationDate: '05 May 2025, 04:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: undefined,
    billDetails: {
      visitId: '1002878',
      visitDate: '05-05-2025 04:00 PM',
      gross: 300.00,
      discount: 30.00,
      vat: 0.00,
      net: 270.00,
      roundOff: 0.00,
      collected: 270.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 270.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'HbA1c',
        sample: 'Whole Blood',
        department: 'Biochemistry',
        status: 'Registered',
        barcodeNo: 'Yet to be processed',
        remarks: ''
      }
    ]
  },
  {
    id: '10',
    patientId: 'BML01831',
    name: 'Mrs. POOJA SINGH',
    age: 31,
    gender: 'F',
    ageUnitStr: '31 Y 4 M / F',
    bookingNo: 'B-2026-9900',
    bookingDate: '05-May-2025',
    contactNo: '9877889900',
    referralType: 'B2C',
    status: 'In Progress',
    phlebotomist: 'Sarah Jenkins',
    apptDttm: '05 May 2025, 03:30 PM',
    testPanel: 'Serum Creatinine',
    priority: 'Urgent',
    billingAmount: 180,
    paymentStatus: 'Paid',
    uhid: 'UHID665544',
    mrn: 'MRN665544',
    registrationDate: '05 May 2025, 03:30 PM',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: 'consent_pooja.pdf',
    billDetails: {
      visitId: '1002889',
      visitDate: '05-05-2025 03:30 PM',
      gross: 180.00,
      discount: 0.00,
      vat: 0.00,
      net: 180.00,
      roundOff: 0.00,
      collected: 180.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 180.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Serum Creatinine',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'In Progress',
        barcodeNo: 'BAR-77112',
        remarks: ''
      }
    ]
  },
  {
    id: '11',
    patientId: 'BML01832',
    name: 'Mr. ARUN JOSHI',
    age: 36,
    gender: 'M',
    ageUnitStr: '36 Y 11 M / M',
    bookingNo: 'B-2026-3344',
    bookingDate: '05-May-2025',
    contactNo: '9888990011',
    referralType: 'B2C',
    status: 'Completed',
    phlebotomist: 'Marcus Vance',
    apptDttm: '05 May 2025, 11:00 AM',
    testPanel: 'Electrolyte Panel',
    priority: 'Routine',
    billingAmount: 450,
    paymentStatus: 'Paid',
    uhid: 'UHID112233',
    mrn: 'MRN112233',
    registrationDate: '05 May 2025, 11:00 AM',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: undefined,
    billDetails: {
      visitId: '1002900',
      visitDate: '05-05-2025 11:00 AM',
      gross: 450.00,
      discount: 50.00,
      vat: 0.00,
      net: 400.00,
      roundOff: 0.00,
      collected: 400.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 400.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Electrolyte Panel',
        sample: 'Serum',
        department: 'Biochemistry',
        status: 'Completed',
        barcodeNo: 'BAR-88221',
        remarks: 'Electrolytes within normal range'
      }
    ]
  },
  {
    id: '12',
    patientId: 'BML01833',
    name: 'Mrs. NEHA PATEL',
    age: 33,
    gender: 'F',
    ageUnitStr: '33 Y 5 M / F',
    bookingNo: 'B-2026-2233',
    bookingDate: '05-May-2025',
    contactNo: '9899001122',
    referralType: 'Corporate',
    status: 'Pending',
    phlebotomist: 'Unassigned',
    apptDttm: '05 May 2025, 11:00 AM',
    testPanel: 'Urine Routine',
    priority: 'Routine',
    billingAmount: 150,
    paymentStatus: 'Paid',
    uhid: 'UHID223344',
    mrn: 'MRN223344',
    registrationDate: '05 May 2025, 11:00 AM',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces&q=80',
    consentFormFileName: 'consent_neha.pdf',
    billDetails: {
      visitId: '1002911',
      visitDate: '05-05-2025 11:00 AM',
      gross: 150.00,
      discount: 0.00,
      vat: 0.00,
      net: 150.00,
      roundOff: 0.00,
      collected: 150.00,
      due: 0.00,
      refundedAmount: 0.00,
      cancelledValue: 0.00,
      netPayable: 150.00,
      doctorName: 'Dr. John Doe',
      billStatus: 'Normal'
    },
    servicesList: [
      {
        id: 's1',
        serviceName: 'Urine Routine',
        sample: 'Urine',
        department: 'Biochemistry',
        status: 'Registered',
        barcodeNo: 'Yet to be processed',
        remarks: ''
      }
    ]
  }
];

export function DashboardModule({
  username,
  role,
  fullName,
  onLogout,
  darkMode,
  onToggleDarkMode
}: DashboardModuleProps) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom User Theme state
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(() => getStoredThemeForUser(username));

  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const loaded = getStoredThemeForUser(username);
    setCurrentTheme(loaded);
    applyThemeToDocument(loaded);
  }, [username]);

  const getNavButtonStyle = (menuKey: string) => {
    const isActive = activeMenu === menuKey;
    if (isActive) {
      return {
        backgroundColor: currentTheme.sidebarActiveBg,
        color: currentTheme.sidebarActiveTextColor || '#ffffff',
      };
    }
    return {
      color: currentTheme.sidebarTextColor,
    };
  };
  
  // Shared search query and sample bookings display state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSampleBookings, setShowSampleBookings] = useState(true);
  
  // Custom Tester Role allows changing views instantly for testing
  const [testerRole, setTesterRole] = useState<LimsRole>(role);
  const [devices, setDevices] = useState<LabDevice[]>(MASTER_DEVICE_REGISTRY);
  const enabledDevices = getEnabledDevices(devices);

  const handleToggleDevice = (id: string) => {
    setDevices(current => current.map(device => device.id === id ? { ...device, enabled: !device.enabled } : device));
  };

  // Printed barcodes storage
  const [printedBarcodes, setPrintedBarcodes] = useState<string[]>([]);
  const [isPrinting, setIsPrinting] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected patient for detail modal view
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Reset/Refresh Data
  const handleRefreshDatabase = () => {
    setPatients(INITIAL_PATIENTS);
    setToastMessage("LIMS Database state reset successfully.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Adding patient logic B2C
  const handleAddB2CPatient = (data: Omit<Patient, 'id' | 'bookingNo' | 'bookingDate' | 'status' | 'phlebotomist' | 'apptDttm'>) => {
    const newId = (patients.length + 1).toString().padStart(2, '0');
    const randomBookingNum = Math.floor(1000 + Math.random() * 9000);
    const newPatient: Patient = {
      ...data,
      id: newId,
      bookingNo: `B-2026-${randomBookingNum}`,
      bookingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      status: 'Pending',
      phlebotomist: 'Unassigned',
      apptDttm: 'Scheduled Today'
    };

    setPatients(prev => [newPatient, ...prev]);
    setActiveMenu('dashboard');
    setToastMessage(`Walk-in patient "${data.name}" successfully registered!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Adding patient logic B2B
  const handleAddB2BPatient = (data: Omit<Patient, 'id' | 'bookingNo' | 'bookingDate' | 'status' | 'phlebotomist' | 'apptDttm'>) => {
    const newId = (patients.length + 1).toString().padStart(2, '0');
    const randomBookingNum = Math.floor(1000 + Math.random() * 9000);
    const newPatient: Patient = {
      ...data,
      id: newId,
      bookingNo: `B-2026-${randomBookingNum}`,
      bookingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      status: 'Pending',
      phlebotomist: 'Unassigned',
      apptDttm: 'Scheduled (Pre-Paid Contract)'
    };

    setPatients(prev => [newPatient, ...prev]);
    setActiveMenu('dashboard');
    setToastMessage(`B2B Invoice registered successfully for "${data.name}"!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Specimen drawing logic
  const handleCollectSample = (id: string, phlebName: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'In Progress',
          phlebotomist: phlebName
        };
      }
      return p;
    }));
    handlePrintBarcode(id, patients.find(p => p.id === id)?.bookingNo || 'GEN-BAR');
  };

  // Clinical testing completion
  const handleCompleteTesting = (id: string, testResults: TestResult[]) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Completed',
          testResults
        };
      }
      return p;
    }));
  };

  // Pathology authorization
  const handleAuthorizeReport = (id: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Completed' // report verified status
        };
      }
      return p;
    }));
  };

  // Delete Patient record
  const handleDeletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setToastMessage("Patient record removed from registry.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Print a browser-generated specimen label that can be saved as PDF.
  const handlePrintBarcode = (id: string, bookingNo: string) => {
    const patient = patients.find(p => p.id === id);
    const printWindow = window.open('', '_blank', 'width=520,height=420');
    if (!printWindow) {
      setToastMessage('Please allow pop-ups to print the specimen label.');
      return;
    }

    const barcodeSvg = createBarcodeSvg(bookingNo);
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Specimen Label - ${bookingNo}</title>
          <style>
            @page { size: 100mm 60mm; margin: 0; }
            * { box-sizing: border-box; }
            body { margin: 0; padding: 8mm; width: 100mm; min-height: 60mm; font-family: Arial, Helvetica, sans-serif; color: #111827; }
            .label { border: 1px solid #111827; padding: 10px; }
            .brand { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
            .patient { margin-top: 8px; font-size: 16px; font-weight: 700; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-top: 6px; font-size: 10px; }
            .meta strong { display: block; font-size: 8px; color: #6b7280; text-transform: uppercase; }
            svg { display: block; margin-top: 10px; }
            .footer { margin-top: 4px; font-size: 8px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="brand">Cybe LabConnect | Specimen Label</div>
            <div class="patient">${patient?.name || 'Registered Patient'}</div>
            <div class="meta">
              <div><strong>Patient ID</strong>${patient?.patientId || 'Not recorded'}</div>
              <div><strong>Booking</strong>${bookingNo}</div>
              <div><strong>Panel</strong>${patient?.testPanel || 'Laboratory testing'}</div>
              <div><strong>Sample</strong>${patient?.servicesList?.[0]?.sample || 'Specimen'}</div>
            </div>
            ${barcodeSvg}
            <div class="footer">Scan barcode to retrieve this specimen in LIMS</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    setIsPrinting(id);
    setToastMessage(`Spooling barcode thermal label for MRN: ${bookingNo}...`);
    setTimeout(() => {
      setPrintedBarcodes(prev => [...prev, id]);
      setIsPrinting(null);
      setToastMessage(`SUCCESS: Specimen bar label printed [Code128 & UID: ${bookingNo}].`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  return (
    <div 
      className={`min-h-screen flex font-sans transition-all duration-200`}
      style={{
        backgroundColor: currentTheme.siteBg,
        color: currentTheme.textColor,
        fontSize: getFontSizePx(currentTheme.fontSizeScale)
      }}
    >
      
      {/* Mobile Off-Canvas Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden"
            />

            {/* Slide-In Mobile Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
              style={{
                backgroundColor: currentTheme.sidebarBg,
                color: currentTheme.sidebarTextColor,
                borderColor: currentTheme.borderColor
              }}
            >
              <div>
                {/* Mobile Drawer Header */}
                <div 
                  className="px-4 py-3.5 border-b flex items-center justify-between transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.sidebarHeaderBg || currentTheme.sidebarBg,
                    color: currentTheme.sidebarHeaderTextColor || currentTheme.sidebarTextColor,
                    borderColor: currentTheme.borderColor 
                  }}
                >
                  <div className={`flex items-center flex-1 ${
                    currentTheme.logoPlacement === 'center' ? 'justify-center' :
                    currentTheme.logoPlacement === 'right' ? 'justify-end' : 'justify-start'
                  }`}>
                    <CybeLogo 
                      variant={currentTheme.logoVariant || "full"} 
                      size="md" 
                      textColor={currentTheme.sidebarHeaderTextColor || currentTheme.sidebarTextColor}
                      accentColor={currentTheme.logoAccentColor || currentTheme.primaryColor || '#0284c7'}
                    />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 cursor-pointer ml-2"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="p-4 space-y-5">
                  {/* General Overview */}
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveMenu('dashboard'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'dashboard' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('dashboard')}
                    >
                      <Home className="h-4 w-4 shrink-0" />
                      <span>Dashboard Overview</span>
                    </button>
                  </div>

                  {/* Executive & Financial */}
                  <details open className="group space-y-1.5">
                    <summary className="flex items-center justify-between px-4 mb-1 list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest opacity-60 font-mono" style={{ color: currentTheme.sidebarTextColor }}>
                      Executive Finance
                      <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>

                    <button 
                      onClick={() => { setActiveMenu('revenue-cockpit'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'revenue-cockpit' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('revenue-cockpit')}
                    >
                      <Scale className="h-4 w-4 shrink-0" />
                      <span>Revenue & AR/AP Cockpit</span>
                    </button>
                  </details>

                  {/* Registration Workflows */}
                  <details open className="group space-y-1.5">
                    <summary className="flex items-center justify-between px-4 mb-1 list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest opacity-60 font-mono" style={{ color: currentTheme.sidebarTextColor }}>
                      Registration
                      <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>
                    
                    <button 
                      onClick={() => { setActiveMenu('reg-b2c'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'reg-b2c' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('reg-b2c')}
                    >
                      <UserPlus className="h-4 w-4 shrink-0" />
                      <span>Patient Intake (B2C)</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('reg-b2b'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'reg-b2b' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('reg-b2b')}
                    >
                      <Users className="h-4 w-4 shrink-0" />
                      <span>Company Registry (B2B)</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('patient-list'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'patient-list' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('patient-list')}
                    >
                      <Database className="h-4 w-4 shrink-0" />
                      <span>Patient Database</span>
                    </button>
                  </details>

                  {/* Lab Workflows */}
                  <details open className="group space-y-1.5">
                    <summary className="flex items-center justify-between px-4 mb-1 list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest opacity-60 font-mono" style={{ color: currentTheme.sidebarTextColor }}>
                      Lab Workflow
                      <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>

                    <button 
                      onClick={() => { setActiveMenu('phlebotomy'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'phlebotomy' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('phlebotomy')}
                    >
                      <FlaskConical className="h-4 w-4 shrink-0" />
                      <span>Phlebotomy Station</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('technician'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'technician' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('technician')}
                    >
                      <Cpu className="h-4 w-4 shrink-0" />
                      <span>Hardware Bench</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('port-parity'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'port-parity' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('port-parity')}
                    >
                      <Terminal className="h-4 w-4 shrink-0" />
                      <span>Port Parity & Tape OCR</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('molecular-pcr'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'molecular-pcr' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('molecular-pcr')}
                    >
                      <Dna className="h-4 w-4 shrink-0" />
                      <span>Molecular Microplate PCR</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('authorization'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'authorization' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('authorization')}
                    >
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <span>Pathologist Sign</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('dispatch'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'dispatch' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('dispatch')}
                    >
                      <Truck className="h-4 w-4 shrink-0" />
                      <span>Dispatch Desk</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('quality'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'quality' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('quality')}
                    >
                      <ClipboardCheck className="h-4 w-4 shrink-0" />
                      <span>Quality & Compliance</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('inventory'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'inventory' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('inventory')}
                    >
                      <Database className="h-4 w-4 shrink-0" />
                      <span>Inventory & Lot Tracking</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('calibration'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'calibration' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('calibration')}
                    >
                      <Cpu className="h-4 w-4 shrink-0" />
                      <span>Equipment Calibration</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu('device-master'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'device-master' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('device-master')}
                    >
                      <Settings2 className="h-4 w-4 shrink-0" />
                      <span>Device Integration Master</span>
                    </button>
                  </details>

                  {/* System Settings */}
                  <details open className="group space-y-1.5">
                    <summary className="flex items-center justify-between px-4 mb-1 list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest opacity-60 font-mono" style={{ color: currentTheme.sidebarTextColor }}>
                      Settings
                      <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>

                    <button 
                      onClick={() => { setActiveMenu('theme-customizer'); setMobileMenuOpen(false); }}
                      className={`w-full text-left flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                        activeMenu === 'theme-customizer' ? 'shadow-md font-black' : 'font-semibold'
                      }`}
                      style={getNavButtonStyle('theme-customizer')}
                    >
                      <Palette className="h-4 w-4 shrink-0" />
                      <span>Theme Studio & Colors</span>
                    </button>
                  </details>
                </nav>
              </div>

              {/* Mobile Footer */}
              <div 
                className="p-4 border-t text-center space-y-1"
                style={{ borderColor: currentTheme.borderColor }}
              >
                <span className="text-[10px] font-bold block opacity-70">Cybe: LabConnect Enterprise v4.2</span>
                <span className="text-[9px] block opacity-40">Connected to Central Hub</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 1. Desktop Sidebar Navigation */}
      <aside 
        className={`hidden md:flex border-r flex-col justify-between transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          backgroundColor: currentTheme.sidebarBg,
          color: currentTheme.sidebarTextColor,
          borderColor: currentTheme.borderColor
        }}
      >
        
        {/* Sidebar Logo Header */}
        <div>
          <div 
            className="px-4 py-3.5 border-b flex items-center justify-between min-h-[64px] transition-colors"
            style={{ 
              backgroundColor: currentTheme.sidebarHeaderBg || currentTheme.sidebarBg,
              color: currentTheme.sidebarHeaderTextColor || currentTheme.sidebarTextColor,
              borderColor: currentTheme.borderColor 
            }}
          >
            {sidebarCollapsed ? (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="mx-auto flex items-center justify-center p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <CybeLogo 
                  variant="icon" 
                  size="md" 
                  textColor={currentTheme.sidebarHeaderTextColor || currentTheme.sidebarTextColor} 
                  accentColor={currentTheme.logoAccentColor || currentTheme.primaryColor || '#0284c7'}
                />
              </button>
            ) : (
              <div className="animate-fade-in flex items-center w-full">
                <div className={`flex items-center w-full ${
                  currentTheme.logoPlacement === 'center' ? 'justify-center' :
                  currentTheme.logoPlacement === 'right' ? 'justify-end' : 'justify-start'
                }`}>
                  <CybeLogo 
                    variant={currentTheme.logoVariant || "full"} 
                    size="md" 
                    textColor={currentTheme.sidebarHeaderTextColor || currentTheme.sidebarTextColor} 
                    accentColor={currentTheme.logoAccentColor || currentTheme.primaryColor || '#0284c7'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation group */}
          <nav className={`p-3 space-y-6 ${sidebarCollapsed ? 'px-2' : 'p-4'}`}>
            
            {/* General section */}
            <div className="space-y-1">
              <button
                id="menu-dashboard"
                onClick={() => setActiveMenu('dashboard')}
                title={sidebarCollapsed ? "Dashboard Overview" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'dashboard' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('dashboard')}
              >
                <Home className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Dashboard Overview</span>}
              </button>
            </div>

            {/* Executive & Financial Intelligence */}
            <details open className="group space-y-1.5">
              <summary className={`flex items-center justify-between list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest mb-2 opacity-60 font-mono ${sidebarCollapsed ? 'px-2 justify-center' : 'px-4'}`} style={{ color: currentTheme.sidebarTextColor }}>
                {!sidebarCollapsed && <span>Executive Finance</span>}
                {!sidebarCollapsed && <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />}
              </summary>

              <button 
                id="menu-revenue-cockpit"
                onClick={() => setActiveMenu('revenue-cockpit')}
                title={sidebarCollapsed ? "Revenue & AR/AP Cockpit" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'revenue-cockpit' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('revenue-cockpit')}
              >
                <Scale className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Revenue & AR/AP Cockpit</span>}
              </button>
            </details>

            {/* Registration workflows */}
            <details open className="group space-y-1.5">
              <summary className={`flex items-center justify-between list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest mb-2 opacity-60 font-mono ${sidebarCollapsed ? 'px-2 justify-center' : 'px-4'}`} style={{ color: currentTheme.sidebarTextColor }}>
                {!sidebarCollapsed && <span>Registration</span>}
                {!sidebarCollapsed && <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />}
              </summary>

              <button 
                id="menu-reg-b2c"
                onClick={() => setActiveMenu('reg-b2c')}
                title={sidebarCollapsed ? "Patient Intake (B2C)" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'reg-b2c' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('reg-b2c')}
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Patient Intake (B2C)</span>}
              </button>

              <button 
                id="menu-reg-b2b"
                onClick={() => setActiveMenu('reg-b2b')}
                title={sidebarCollapsed ? "Company Registry (B2B)" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'reg-b2b' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('reg-b2b')}
              >
                <Users className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Company Registry (B2B)</span>}
              </button>

              <button 
                id="menu-patient-list"
                onClick={() => setActiveMenu('patient-list')}
                title={sidebarCollapsed ? "Patient Database" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'patient-list' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('patient-list')}
              >
                <Database className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Patient Database</span>}
              </button>
            </details>

            {/* Clinical lab workflows */}
            <details open className="group space-y-1.5">
              <summary className={`flex items-center justify-between list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest mb-2 opacity-60 font-mono ${sidebarCollapsed ? 'px-2 justify-center' : 'px-4'}`} style={{ color: currentTheme.sidebarTextColor }}>
                {!sidebarCollapsed && <span>Lab Workflow</span>}
                {!sidebarCollapsed && <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />}
              </summary>

              <button 
                id="menu-phlebotomy"
                onClick={() => setActiveMenu('phlebotomy')}
                title={sidebarCollapsed ? "Phlebotomy Station" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'phlebotomy' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('phlebotomy')}
              >
                <FlaskConical className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Phlebotomy Station</span>}
              </button>

              <button 
                id="menu-technician"
                onClick={() => setActiveMenu('technician')}
                title={sidebarCollapsed ? "Hardware Bench" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'technician' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('technician')}
              >
                <Cpu className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Hardware Bench</span>}
              </button>

              <button 
                id="menu-port-parity"
                onClick={() => setActiveMenu('port-parity')}
                title={sidebarCollapsed ? "Port Parity & Tape OCR" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'port-parity' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('port-parity')}
              >
                <Terminal className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Port Parity & Tape OCR</span>}
              </button>

              <button 
                id="menu-molecular-pcr"
                onClick={() => setActiveMenu('molecular-pcr')}
                title={sidebarCollapsed ? "Molecular Microplate PCR" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'molecular-pcr' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('molecular-pcr')}
              >
                <Dna className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Molecular Microplate PCR</span>}
              </button>

              <button 
                id="menu-authorization"
                onClick={() => setActiveMenu('authorization')}
                title={sidebarCollapsed ? "Pathologist Sign" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'authorization' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('authorization')}
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Pathologist Sign</span>}
              </button>

              <button 
                id="menu-dispatch"
                onClick={() => setActiveMenu('dispatch')}
                title={sidebarCollapsed ? "Dispatch Desk" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'dispatch' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('dispatch')}
              >
                <Truck className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Dispatch Desk</span>}
              </button>

              <button 
                id="menu-quality"
                onClick={() => setActiveMenu('quality')}
                title={sidebarCollapsed ? "Quality & Compliance" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'quality' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('quality')}
              >
                <ClipboardCheck className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Quality & Compliance</span>}
              </button>

              <button 
                id="menu-inventory"
                onClick={() => setActiveMenu('inventory')}
                title={sidebarCollapsed ? "Inventory & Lot Tracking" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'inventory' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('inventory')}
              >
                <Database className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Inventory & Lot Tracking</span>}
              </button>

              <button 
                id="menu-calibration"
                onClick={() => setActiveMenu('calibration')}
                title={sidebarCollapsed ? "Equipment Calibration" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'calibration' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('calibration')}
              >
                <Cpu className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Equipment Calibration</span>}
              </button>

              <button 
                id="menu-device-master"
                onClick={() => setActiveMenu('device-master')}
                title={sidebarCollapsed ? "Device Integration Master" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'device-master' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('device-master')}
              >
                <Settings2 className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Device Integration Master</span>}
              </button>
            </details>

            {/* System Settings & Custom Theme */}
            <details open className="group space-y-1.5">
              <summary className={`flex items-center justify-between list-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest mb-2 opacity-60 font-mono ${sidebarCollapsed ? 'px-2 justify-center' : 'px-4'}`} style={{ color: currentTheme.sidebarTextColor }}>
                {!sidebarCollapsed && <span>Settings</span>}
                {!sidebarCollapsed && <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />}
              </summary>

              <button 
                id="menu-theme-customizer"
                onClick={() => setActiveMenu('theme-customizer')}
                title={sidebarCollapsed ? "Theme Studio & Colors" : undefined}
                className={`w-full text-left flex items-center gap-3.5 py-2.5 rounded-xl text-xs sidebar-nav-btn cursor-pointer ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                } ${activeMenu === 'theme-customizer' ? 'shadow-md font-black' : 'font-semibold'}`}
                style={getNavButtonStyle('theme-customizer')}
              >
                <Palette className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Theme Studio & Colors</span>}
              </button>
            </details>

          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div 
          className="p-4 border-t space-y-2"
          style={{ borderColor: currentTheme.borderColor }}
        >
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer border hover:opacity-90 shadow-2xs"
            style={{
              backgroundColor: currentTheme.sidebarHoverBg || 'rgba(255, 255, 255, 0.08)',
              color: currentTheme.sidebarTextColor,
              borderColor: currentTheme.borderColor
            }}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> <span>Collapse Sidebar</span></>}
          </button>
        </div>

      </aside>

      {/* 2. Main Center Body Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <header 
          className="h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors"
          style={{
            backgroundColor: currentTheme.topHeaderBg,
            color: currentTheme.topHeaderTextColor,
            borderColor: currentTheme.borderColor
          }}
        >
          
          {/* Mobile hamburger & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="p-2 -ml-2 rounded-xl text-zinc-600 dark:text-zinc-300 md:hidden hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="md:hidden flex items-center">
              <CybeLogo 
                variant="horizontal" 
                size="sm" 
                textColor={currentTheme.topHeaderTextColor} 
                accentColor={currentTheme.logoAccentColor || currentTheme.primaryColor || '#0284c7'}
              />
            </div>
          </div>

          {/* Top Bar actions (Location, Notifications, Role Swap, User details) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0 whitespace-nowrap">
            
            {/* Interactive Location Dropdown */}
            <div 
              onClick={() => alert('Connected Ingress Node: Cybe Central Diagnostic Hub, Sector A-1 Pathology Division.')}
              className="hidden xl:flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-200/40 dark:border-zinc-850 text-xs cursor-pointer hover:bg-zinc-100/50 shrink-0 whitespace-nowrap"
            >
              <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <div className="shrink-0 whitespace-nowrap">
                <span className="block font-extrabold text-[10px] text-zinc-800 dark:text-zinc-200 leading-none">Central Hub Lab</span>
                <span className="block text-[8px] text-zinc-400 mt-0.5 font-medium">Sector A-1, Pathology</span>
              </div>
              <ChevronDown className="h-3 w-3 text-zinc-400 ml-1 shrink-0" />
            </div>

            {/* Dynamic Role Swapping System (Active View Pill - Aligned horizontally without word wrapping) */}
            <div className="flex items-center gap-1.5 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200/50 dark:border-indigo-800/40 shrink-0 whitespace-nowrap">
              <span className="text-[9px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-extrabold whitespace-nowrap shrink-0">Active View:</span>
              <select
                value={testerRole}
                onChange={(e) => {
                  const r = e.target.value as LimsRole;
                  setTesterRole(r);
                  setToastMessage(`Switched active view session to: ${r}`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="bg-transparent focus:outline-none text-[11px] font-bold text-indigo-700 dark:text-indigo-300 cursor-pointer whitespace-nowrap pr-1"
                title="Change roles instantly to test all workflows!"
              >
                <option value="Receptionist">Receptionist (Walk-in Desk)</option>
                <option value="Phlebotomist">Phlebotomist (Specimen collection)</option>
                <option value="Administrator">Administrator (Senior MD)</option>
              </select>
            </div>

            {/* Notification bell */}
            <button 
              onClick={() => alert('New alerts:\n- Calibration completed on Cybe H-560.\n- Critical sample authorization pending.\n- Specimen 02 updated.')}
              className="relative p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer shrink-0"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-rose-600 text-[8px] text-white font-extrabold flex items-center justify-center border-2 border-white dark:border-zinc-900 leading-none">
                3
              </span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0 mx-0.5" />

            {/* User Profile info */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <div className="h-8.5 w-8.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-100/50 flex items-center justify-center text-[11px] font-black text-indigo-700 dark:text-indigo-400 shrink-0">
                SJ
              </div>
              <div className="hidden sm:block text-left leading-none shrink-0 whitespace-nowrap">
                <span className="block font-extrabold text-[11px] text-zinc-900 dark:text-zinc-50 whitespace-nowrap">{fullName}</span>
                <span className="block text-[9px] text-zinc-400 mt-0.5 whitespace-nowrap">{testerRole}</span>
              </div>
              
              <button 
                id="btn-logout"
                onClick={onLogout} 
                className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer ml-1 shrink-0"
                title="Log out of LIMS"
              >
                <LogOut className="h-4 w-4 shrink-0" />
              </button>
            </div>

          </div>

        </header>

        {/* 3. Render Active workspace content */}
        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {activeMenu === 'dashboard' && (
                <DashboardHome 
                  patients={patients}
                  onNavigate={setActiveMenu}
                  printedBarcodes={printedBarcodes}
                  isPrinting={isPrinting}
                  onPrintBarcode={handlePrintBarcode}
                  onRefresh={handleRefreshDatabase}
                  onSelectPatient={setSelectedPatient}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showSampleBookings={showSampleBookings}
                  setShowSampleBookings={setShowSampleBookings}
                />
              )}

              {activeMenu === 'revenue-cockpit' && (
                <RevenueDashboardView 
                  currentTheme={currentTheme}
                  darkMode={darkMode}
                />
              )}

              {activeMenu === 'reg-b2c' && (
                <B2CRegistration 
                  patients={patients}
                  onRegister={handleAddB2CPatient}
                  onCancel={() => setActiveMenu('dashboard')}
                />
              )}

              {activeMenu === 'reg-b2b' && (
                <B2BRegistration 
                  patients={patients}
                  onRegister={handleAddB2BPatient}
                  onCancel={() => setActiveMenu('dashboard')}
                />
              )}

              {activeMenu === 'phlebotomy' && (
                <PhlebotomyView 
                  patients={patients}
                  onCollectSample={handleCollectSample}
                  onPrintBarcode={handlePrintBarcode}
                  printedBarcodes={printedBarcodes}
                  isPrinting={isPrinting}
                />
              )}

              {activeMenu === 'technician' && (
                <TechnicianView 
                  patients={patients}
                  onCompleteTesting={handleCompleteTesting}
                  devices={enabledDevices}
                />
              )}

              {activeMenu === 'port-parity' && (
                <PortParityView 
                  currentTheme={currentTheme}
                  darkMode={darkMode}
                  devices={enabledDevices}
                />
              )}

              {activeMenu === 'molecular-pcr' && (
                <MolecularPlateView 
                  currentTheme={currentTheme}
                  darkMode={darkMode}
                />
              )}

              {activeMenu === 'authorization' && (
                <AuthorizationView 
                  patients={patients}
                  onAuthorizeReport={handleAuthorizeReport}
                />
              )}

              {activeMenu === 'dispatch' && (
                <DispatchView 
                  patients={patients}
                />
              )}

              {activeMenu === 'quality' && (
                <QualityView />
              )}

              {activeMenu === 'inventory' && (
                <InventoryView />
              )}

              {activeMenu === 'calibration' && (
                <CalibrationView />
              )}

              {activeMenu === 'device-master' && (
                <DeviceMasterView devices={devices} onToggleDevice={handleToggleDevice} />
              )}

              {activeMenu === 'patient-list' && (
                <PatientListView 
                  patients={patients}
                  onDeletePatient={handleDeletePatient}
                  onPrintBarcode={handlePrintBarcode}
                  printedBarcodes={printedBarcodes}
                  isPrinting={isPrinting}
                  onSelectPatient={setSelectedPatient}
                  onUpdatePatient={(updatedPatient) => {
                    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
                  }}
                />
              )}

              {activeMenu === 'theme-customizer' && (
                <ThemeCustomizerView 
                  currentTheme={currentTheme}
                  username={username}
                  onThemeUpdate={(newTheme) => {
                    setCurrentTheme(newTheme);
                    applyThemeToDocument(newTheme);
                  }}
                />
              )}

            </motion.div>
          </AnimatePresence>

        </main>

      </div>

      {/* 4. Thermal Label Spooler Drawer Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-900 dark:bg-zinc-950 text-white p-4 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-3.5 max-w-sm w-full font-sans"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Printer className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wide">Label Spooler Log</span>
              <p className="text-xs text-zinc-200 mt-0.5 truncate font-semibold leading-relaxed">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-zinc-500 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Patient Profile detail Modal view */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientDetailsModal
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
            onUpdatePatient={(updatedPatient) => {
              setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
              setSelectedPatient(updatedPatient);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
