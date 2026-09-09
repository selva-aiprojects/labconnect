export interface TestMaster {
  id: string;
  testName: string;
  department: string;
  sampleType: string;
  units: string;
  referenceRange: string;
  rate: number;
  active: boolean;
}

export const MASTER_TEST_REGISTRY: TestMaster[] = [
  {
    id: 'TEST-0001',
    testName: 'Complete Blood Count (CBC)',
    department: 'Hematology',
    sampleType: 'Whole Blood',
    units: 'x10^3/uL',
    referenceRange: '4.0 - 11.0',
    rate: 50.00,
    active: true
  },
  {
    id: 'TEST-0002',
    testName: 'Cholesterol Total',
    department: 'Biochemistry',
    sampleType: 'Serum',
    units: 'mg/dL',
    referenceRange: '< 200',
    rate: 25.00,
    active: true
  },
  {
    id: 'TEST-0003',
    testName: 'Blood Glucose Fasting',
    department: 'Biochemistry',
    sampleType: 'Serum',
    units: 'mg/dL',
    referenceRange: '70 - 100',
    rate: 20.00,
    active: true
  },
  {
    id: 'TEST-0004',
    testName: 'Vitamin D (25 Hydroxy)',
    department: 'Immunology',
    sampleType: 'Serum',
    units: 'ng/mL',
    referenceRange: '20 - 50',
    rate: 120.00,
    active: true
  },
  {
    id: 'TEST-0005',
    testName: 'Urine Routine Examination',
    department: 'Urinalysis',
    sampleType: 'Urine',
    units: 'N/A',
    referenceRange: 'Normal',
    rate: 15.00,
    active: true
  },
  {
    id: 'TEST-0006',
    testName: 'Lipid Panel',
    department: 'Biochemistry',
    sampleType: 'Serum',
    units: 'mg/dL',
    referenceRange: 'See report',
    rate: 75.00,
    active: true
  },
  {
    id: 'TEST-0007',
    testName: 'Thyroid Stimulating Hormone (TSH)',
    department: 'Immunology',
    sampleType: 'Serum',
    units: 'mIU/L',
    referenceRange: '0.4 - 4.0',
    rate: 45.00,
    active: true
  },
  {
    id: 'TEST-0008',
    testName: 'Liver Function Test (LFT)',
    department: 'Biochemistry',
    sampleType: 'Serum',
    units: 'U/L',
    referenceRange: 'See report',
    rate: 90.00,
    active: true
  },
  {
    id: 'TEST-0009',
    testName: 'Kidney Function Test (KFT)',
    department: 'Biochemistry',
    sampleType: 'Serum',
    units: 'mg/dL',
    referenceRange: 'See report',
    rate: 85.00,
    active: true
  },
  {
    id: 'TEST-0010',
    testName: 'Hemoglobin A1c (HbA1c)',
    department: 'Hematology',
    sampleType: 'Whole Blood',
    units: '%',
    referenceRange: '< 5.7',
    rate: 60.00,
    active: true
  },
  {
    id: 'TEST-0011',
    testName: 'Vitamin B12',
    department: 'Immunology',
    sampleType: 'Serum',
    units: 'pg/mL',
    referenceRange: '200 - 900',
    rate: 110.00,
    active: true
  },
  {
    id: 'TEST-0012',
    testName: 'C-Reactive Protein (CRP)',
    department: 'Immunology',
    sampleType: 'Serum',
    units: 'mg/L',
    referenceRange: '< 1.0',
    rate: 40.00,
    active: true
  },
  {
    id: 'TEST-0013',
    testName: 'Iron Profile',
    department: 'Biochemistry',
    sampleType: 'Serum',
    units: 'mcg/dL',
    referenceRange: 'See report',
    rate: 70.00,
    active: true
  }
];
