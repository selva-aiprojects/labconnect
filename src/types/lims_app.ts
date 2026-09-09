/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Patient {
  id: string; // S.No format
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  bookingNo: string;
  bookingDate: string;
  contactNo: string;
  referralType: 'B2C' | 'B2B (Apollo)' | 'B2B (Max Labs)' | 'Self' | 'Corporate';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  phlebotomist: string;
  apptDttm: string;
  testPanel: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  billingAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';

  // Guided registration fields
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  ageUnitStr?: string; // e.g. "34 Y / 0 M / 0 D"
  emailPrimary?: string;
  emailSecondary?: string;
  uidType?: string;
  uidNo?: string;
  referredByDetail?: string;
  doctorSearch?: string;
  clientSearch?: string;
  externalId?: string;
  externalVisitId?: string;
  rider?: string;
  marketingExecutive?: string;
  referralRemarks?: string;
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  nationality?: string;

  // Assessment fields
  height?: number;
  weight?: number;
  bmi?: number;
  bodyTemp?: number;
  pulseRate?: number;
  spo2?: number;
  bloodPressure?: string;
  allergicHistory?: string;
  surgicalHistory?: string;
  medicineHistory?: string;
  socialHistory?: string;
  clinicalConditions?: string[];
  symptoms?: string[];

  // Selected Services & Billing fields
  selectedServices?: Array<{
    code: string;
    cptCode: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  discountType?: string;
  discountPercent?: number;
  isAuthRequired?: string;
  isNonStandard?: boolean;
  collectionDttm?: string;
  receivedDttm?: string;
  processedDttm?: string;
  reportedDttm?: string;
  accessionNo?: string;
  specimenId?: string;
  specimenType?: string;
  reportStatus?: 'DRAFT' | 'UNDER REVIEW' | 'REVIEWED' | 'FINAL' | 'AMENDED' | 'CANCELLED';

  // Insurance & Payment
  insuranceReceiver?: string;
  insurancePayer?: string;
  insuranceNetwork?: string;
  insuranceMembershipNo?: string;
  insurancePolicyNo?: string;
  insuranceCardExpiry?: string;
  insuranceCoPay?: number;
  insuranceCoPayPercent?: string;
  insuranceElgAmt?: number;
  insuranceVisitType?: string;
  paymentMode?: string;
  cashTendered?: number;
  cashCollected?: number;
  cashChange?: number;
  discountApprovedBy?: string;
  paymentReceiptNo?: string;

  // New registry & screenshot matching fields
  patientId?: string;
  uhid?: string;
  mrn?: string;
  registrationDate?: string;
  photoUrl?: string;
  consentFormFileName?: string;

  billDetails?: {
    visitId: string;
    visitDate: string;
    gross: number;
    discount: number;
    vat: number;
    net: number;
    roundOff: number;
    collected: number;
    due: number;
    refundedAmount: number;
    cancelledValue: number;
    netPayable: number;
    doctorName: string;
    billStatus?: 'Partially Cancelled' | 'Cancelled' | 'Bill Edited' | 'File Uploaded' | 'Normal';
  };

  servicesList?: Array<{
    id: string;
    serviceName: string;
    sample: string;
    department: string;
    status: string;
    barcodeNo: string;
    remarks: string;
  }>;

  // Structured clinical results populated when the analyzer completes testing.
  testResults?: TestResult[];
}

export interface TestResult {
  name: string;
  value: string;
  unit?: string;
  reference?: string;
  flag?: 'L' | 'H' | 'N' | 'A' | null;
}

export interface Analyzer {
  name: string;
  type: string;
  status: 'online' | 'maintenance' | 'offline';
  load: number;
  reagentLevel: number;
}
