/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  UserPlus, Plus, Sparkles, IndianRupee, HeartPulse, Receipt, UserCheck,
  Search, Trash2, ChevronRight, ChevronLeft, Calendar, Clock, Check, 
  CheckCircle2, X, Printer, Info, ShieldCheck, Building2, ClipboardList,
  ExternalLink, User, Layers, ArrowRight, Save
} from 'lucide-react';
import { Patient } from '../types/lims_app';
import { TestMaster } from '../types/testMaster';
import { LOCATIONS, DEFAULT_COUNTRY, DEFAULT_STATE, DEFAULT_CITY, DEFAULT_NATIONALITY, DEFAULT_MOBILE_PREFIX, getStatesForCountry, getCitiesForState } from '../data/locations';

interface B2CRegistrationProps {
  patients: Patient[];
  onRegister: (patientData: Omit<Patient, 'id' | 'bookingNo' | 'bookingDate' | 'status' | 'phlebotomist' | 'apptDttm'>) => void;
  onCancel: () => void;
  testMasters: TestMaster[];
}

interface ServiceItem {
  code: string;
  cptCode: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  testMasterId?: string;
  sampleType?: string;
  units?: string;
  referenceRange?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { code: 'HA001', cptCode: '80053', name: 'Complete Blood Count (CBC)', category: 'Hematology', quantity: 1, unitPrice: 50.00 },
  { code: 'CHOL', cptCode: '82465', name: 'Cholesterol Total', category: 'Biochemistry', quantity: 1, unitPrice: 25.00 },
  { code: 'GLUF', cptCode: '82947', name: 'Blood Glucose Fasting', category: 'Biochemistry', quantity: 1, unitPrice: 20.00 },
  { code: 'VITD', cptCode: '82306', name: 'Vitamin D (25 Hydroxy)', category: 'Immunology', quantity: 1, unitPrice: 120.00 },
  { code: 'UA', cptCode: '81001', name: 'Urine Routine Examination', category: 'Urinalysis', quantity: 1, unitPrice: 15.00 },
];

const MASTER_SERVICES: Omit<ServiceItem, 'quantity'>[] = [
  { code: 'HA001', cptCode: '80053', name: 'Complete Blood Count (CBC)', category: 'Hematology', unitPrice: 50.00 },
  { code: 'CHOL', cptCode: '82465', name: 'Cholesterol Total', category: 'Biochemistry', unitPrice: 25.00 },
  { code: 'GLUF', cptCode: '82947', name: 'Blood Glucose Fasting', category: 'Biochemistry', unitPrice: 20.00 },
  { code: 'VITD', cptCode: '82306', name: 'Vitamin D (25 Hydroxy)', category: 'Immunology', unitPrice: 120.00 },
  { code: 'UA', cptCode: '81001', name: 'Urine Routine Examination', category: 'Urinalysis', unitPrice: 15.00 },
  { code: 'LIPID', cptCode: '80061', name: 'Lipid Panel', category: 'Biochemistry', unitPrice: 75.00 },
  { code: 'TSH', cptCode: '84443', name: 'Thyroid Stimulating Hormone (TSH)', category: 'Immunology', unitPrice: 45.00 },
  { code: 'LFT', cptCode: '80076', name: 'Liver Function Test (LFT)', category: 'Biochemistry', unitPrice: 90.00 },
  { code: 'KFT', cptCode: '80069', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', unitPrice: 85.00 },
  { code: 'HBA1C', cptCode: '83036', name: 'Hemoglobin A1c (HbA1c)', category: 'Hematology', unitPrice: 60.00 },
  { code: 'VITB12', cptCode: '82607', name: 'Vitamin B12', category: 'Immunology', unitPrice: 110.00 },
  { code: 'CRP', cptCode: '86140', name: 'C-Reactive Protein (CRP)', category: 'Immunology', unitPrice: 40.00 },
  { code: 'IRON', cptCode: '83540', name: 'Iron Profile', category: 'Biochemistry', unitPrice: 70.00 },
];

const DEFAULT_COMPANIES = [
  {
    clientName: 'Nexus Insurance LLC',
    clientType: 'Insurance',
    externalVisitId: 'EXT-2025-001',
    clientCode: 'NEXUS001',
    email: 'info@nexusinsurance.ae',
    website: 'www.nexusinsurance.ae',
    phone: '+971 4 123 4567',
    fax: '+971 4 123 4568',
    country: 'United Arab Emirates',
    state: 'Dubai',
    city: 'Dubai',
    clientCategory: 'Corporate',
    gstNo: 'GST-90812-AE',
    taxId: 'TAX-NX-998',
    vatNo: 'VAT-NX-554',
    terms: 'Net 30',
    creditLimit: '50000',
    currency: 'INR',
    isActive: true,
    contactPerson: 'James Wilson',
    designation: 'Relationship Manager',
    mobilePrefix: '+971',
    mobileNumber: '50 123 4567',
    emailContact: 'james.wilson@nexusinsurance.ae',
    addressLine1: 'Office 1201, Business Bay Tower',
    addressLine2: 'Al Abraj Street, Business Bay',
    area: 'Business Bay',
    pincode: '00000',
    cityContact: 'Dubai',
    stateContact: 'Dubai',
    countryContact: 'United Arab Emirates',
    nationality: 'United Arab Emirates'
  },
  {
    clientName: 'Apollo Diagnostics',
    clientType: 'Clinic',
    externalVisitId: 'EXT-2025-002',
    clientCode: 'APOLLO002',
    email: 'info@apollodiagnostics.ae',
    website: 'www.apollodiagnostics.ae',
    phone: '+971 4 555 1212',
    fax: '+971 4 555 1213',
    country: 'United Arab Emirates',
    state: 'Dubai',
    city: 'Dubai',
    clientCategory: 'Clinic',
    gstNo: 'GST-55421-AE',
    taxId: 'TAX-AP-441',
    vatNo: 'VAT-AP-221',
    terms: 'Net 15',
    creditLimit: '30000',
    currency: 'INR',
    isActive: true,
    contactPerson: 'Dr. Amit Patel',
    designation: 'Clinical Director',
    mobilePrefix: '+971',
    mobileNumber: '55 987 6543',
    emailContact: 'contact@apollodiagnostics.ae',
    addressLine1: 'Villa 14, Jumeirah Beach Road',
    addressLine2: 'Jumeirah 2',
    area: 'Jumeirah',
    pincode: '00000',
    cityContact: 'Dubai',
    stateContact: 'Dubai',
    countryContact: 'United Arab Emirates',
    nationality: 'Indian'
  },
  {
    clientName: 'Max Healthcare Labs',
    clientType: 'Hospital',
    externalVisitId: 'EXT-2025-003',
    clientCode: 'MAXLABS003',
    email: 'info@maxlabs.ae',
    website: 'www.maxlabs.ae',
    phone: '+971 4 888 4433',
    fax: '+971 4 888 4434',
    country: 'United Arab Emirates',
    state: 'Dubai',
    city: 'Dubai',
    clientCategory: 'Hospital',
    gstNo: 'GST-11223-AE',
    taxId: 'TAX-MAX-771',
    vatNo: 'VAT-MAX-331',
    terms: 'Net 45',
    creditLimit: '100000',
    currency: 'INR',
    isActive: true,
    contactPerson: 'Sarah Jenkins',
    designation: 'Operations Lead',
    mobilePrefix: '+971',
    mobileNumber: '56 777 8899',
    emailContact: 'sarah.j@maxlabs.ae',
    addressLine1: 'Floor 3, Dubai Healthcare City Bldg 64',
    addressLine2: 'Oud Metha',
    area: 'Oud Metha',
    pincode: '00000',
    cityContact: 'Dubai',
    stateContact: 'Dubai',
    countryContact: 'United Arab Emirates',
    nationality: 'British'
  }
];

function calculateAgeDetails(dobString: string): { years: number; months: number; days: number; ageString: string } {
  if (!dobString) {
    return { years: 0, months: 0, days: 0, ageString: '0 Y / 0 M / 0 D' };
  }
  const dob = new Date(dobString);
  const today = new Date();
  
  if (isNaN(dob.getTime())) {
    return { years: 0, months: 0, days: 0, ageString: '0 Y / 0 M / 0 D' };
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) {
    return { years: 0, months: 0, days: 0, ageString: '0 Y / 0 M / 0 D' };
  }

  return {
    years,
    months,
    days,
    ageString: `${years} Y / ${months} M / ${days} D`
  };
}

export function B2CRegistration({ patients, onRegister, onCancel, testMasters }: B2CRegistrationProps) {
  const [step, setStep] = useState<number>(1);

  // --- Step 1 Search State ---
  const [searchBy, setSearchBy] = useState<string>('Mobile Number');
  const [searchMobile, setSearchMobile] = useState<string>('');
  const [searchUhid, setSearchUhid] = useState<string>('');
  const [searchExtId, setSearchExtId] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searchDone, setSearchDone] = useState<boolean>(false);
  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);

  // --- New Popup & Validation & Custom Service States ---
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [showSearchPopup, setShowSearchPopup] = useState<boolean>(false);
  const [showCustomServiceModal, setShowCustomServiceModal] = useState<boolean>(false);
  const [customServiceName, setCustomServiceName] = useState<string>('');
  const [customServicePrice, setCustomServicePrice] = useState<string>('50.00');
  const [customServiceCategory, setCustomServiceCategory] = useState<string>('Custom');

  const performValidation = (s: number) => {
    const errors: Record<string, boolean> = {};

    if (s === 1) {
      if (!firstName.trim()) errors.firstName = true;
      if (!mobileNumber.trim()) errors.mobileNumber = true;
      if (!dob.trim()) errors.dob = true;
      if (!age.trim()) errors.age = true;
      if (!externalVisitId.trim()) errors.externalVisitId = true;
      if (!referralRemarks.trim()) errors.referralRemarks = true;
      if (!addressLine1.trim()) errors.addressLine1 = true;
      if (!area.trim()) errors.area = true;
      if (!city.trim()) errors.city = true;
      if (!state.trim()) errors.state = true;
      if (!country.trim()) errors.country = true;
      if (!pincode.trim()) errors.pincode = true;
      if (!nationality.trim()) errors.nationality = true;

      if (referredByDetail === 'Doctor' && !doctorSearch.trim()) {
        errors.doctorSearch = true;
      }
      if (referredByDetail === 'Client' && !clientSearch.trim()) {
        errors.clientSearch = true;
      }
    } else if (s === 3) {
      if (selectedServices.length === 0) {
        errors.selectedServices = true;
      }
    }

    return errors;
  };

  // --- Step 1 Form Fields ---
  const [title, setTitle] = useState<string>('Mr.');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [gender, setGender] = useState<'M' | 'F' | 'O'>('M');
  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [ageUnitStr, setAgeUnitStr] = useState<string>('34 Y / 0 M / 0 D');
  const [mobilePrefix, setMobilePrefix] = useState<string>('+971');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [emailPrimary, setEmailPrimary] = useState<string>('');
  const [emailSecondary, setEmailSecondary] = useState<string>('');
  const [uidType, setUidType] = useState<string>('Select UID Type');
  const [uidNo, setUidNo] = useState<string>('');

  // Referral Detail
  const [referredByDetail, setReferredByDetail] = useState<string>('Self');
  const [doctorSearch, setDoctorSearch] = useState<string>('');
  const [clientSearch, setClientSearch] = useState<string>('');
  const [externalId, setExternalId] = useState<string>('');
  const [externalVisitId, setExternalVisitId] = useState<string>('');
  const [rider, setRider] = useState<string>('Select Rider');
  const [marketingExecutive, setMarketingExecutive] = useState<string>('Select Executive');
  const [referralRemarks, setReferralRemarks] = useState<string>('');

  // Contact Details
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [state, setState] = useState<string>(DEFAULT_STATE);
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);
  const [pincode, setPincode] = useState<string>('');
  const [nationality, setNationality] = useState<string>(DEFAULT_NATIONALITY);

  // --- Step 2 Assessment State ---
  const [height, setHeight] = useState<string>('170.0');
  const [weight, setWeight] = useState<string>('68.5');
  const [bodyTemp, setBodyTemp] = useState<string>('36.6');
  const [pulseRate, setPulseRate] = useState<string>('78');
  const [spo2, setSpo2] = useState<string>('98');
  const [bloodPressure, setBloodPressure] = useState<string>('120 / 80');
  const [allergicHistory, setAllergicHistory] = useState<string>('');
  const [surgicalHistory, setSurgicalHistory] = useState<string>('');
  const [medicineHistory, setMedicineHistory] = useState<string>('');
  const [socialHistory, setSocialHistory] = useState<string>('');
  
  // Checkboxes
  const [clinicalConditions, setClinicalConditions] = useState<string[]>([]);
  const [otherClinical, setOtherClinical] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>(['Fever', 'Cough with Sputum', 'Body Ache', 'Burning Urine']);
  const [otherSymptom, setOtherSymptom] = useState<string>('');

  // --- Step 3 Services & Pricing State ---
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [searchService, setSearchService] = useState<string>('');
  const [serviceCategory, setServiceCategory] = useState<string>('All Categories');
  const [discountType, setDiscountType] = useState<string>('Percentage');
  const [discountPercent, setDiscountPercent] = useState<string>('5.00');
  const [isAuthRequired, setIsAuthRequired] = useState<string>('No');
  const [isSTAT, setIsSTAT] = useState<boolean>(false);
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [isNonStandard, setIsNonStandard] = useState<boolean>(false);
  const [collectionDttm, setCollectionDttm] = useState<string>('15/07/2025 10:30 AM');

  // --- Step 4 Billing & Payment State ---
  // Insurance
  const [insuranceReceiver, setInsuranceReceiver] = useState<string>('NEXUS INSURANCE');
  const [insurancePayer, setInsurancePayer] = useState<string>('NEXUS INSURANCE LLC');
  const [insuranceNetwork, setInsuranceNetwork] = useState<string>('NEXUS NETWORK');
  const [insuranceMembershipNo, setInsuranceMembershipNo] = useState<string>('NX-123456789');
  const [insurancePolicyNo, setInsurancePolicyNo] = useState<string>('POL-987654321');
  const [insuranceCardExpiry, setInsuranceCardExpiry] = useState<string>('31/12/2025');
  const [insuranceCoPay, setInsuranceCoPay] = useState<string>('20.00');
  const [insuranceCoPayPercent, setInsuranceCoPayPercent] = useState<string>('10%');
  const [insuranceElgAmt, setInsuranceElgAmt] = useState<string>('200.00');
  const [insuranceVisitType, setInsuranceVisitType] = useState<string>('Outpatient');

  // Payment Mode Tabs
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  const [cashTendered, setCashTendered] = useState<string>('300.00');
  const [discountApprovedBy, setDiscountApprovedBy] = useState<string>('James Wilson');
  const [discountRemarks, setDiscountRemarks] = useState<string>('Corporate discount');

  // Automatically computed values
  const bmi = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return '0.0';
  }, [height, weight]);

  const bmiLabel = useMemo(() => {
    const num = parseFloat(bmi);
    if (num === 0) return 'No Data';
    if (num < 18.5) return 'Underweight';
    if (num < 25) return 'Normal';
    if (num < 30) return 'Overweight';
    return 'Obese';
  }, [bmi]);

  // Pricing math
  const grossAmount = useMemo(() => {
    return selectedServices.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [selectedServices]);

  const discountValue = useMemo(() => {
    const pct = parseFloat(discountPercent) || 0;
    if (discountType === 'Percentage') {
      return Math.round((grossAmount * pct / 100) * 100) / 100;
    }
    return Math.min(grossAmount, pct);
  }, [grossAmount, discountPercent, discountType]);

  const netAmount = useMemo(() => {
    return Math.max(0, grossAmount - discountValue);
  }, [grossAmount, discountValue]);

  const cashChange = useMemo(() => {
    const tendered = parseFloat(cashTendered) || 0;
    return Math.max(0, tendered - netAmount);
  }, [cashTendered, netAmount]);

  const generatedReceiptNo = useMemo(() => {
    return `RCT-2025-0715-${Math.floor(10000 + Math.random() * 90000)}`;
  }, []);

  const availableServices = useMemo(() => {
    const mapped = testMasters.filter(tm => tm.active).map(tm => ({
      code: tm.id,
      cptCode: tm.id.replace('TEST-', 'CPT-'),
      name: tm.testName,
      category: tm.department,
      unitPrice: tm.rate,
      sampleType: tm.sampleType,
      units: tm.units,
      referenceRange: tm.referenceRange,
      testMasterId: tm.id
    }));
    return mapped.filter(service => {
      const matchesCategory = serviceCategory === 'All Categories' || service.category.toLowerCase() === serviceCategory.toLowerCase();
      const term = searchService.toLowerCase().trim();
      const matchesSearch = !term || 
        service.name.toLowerCase().includes(term) || 
        service.code.toLowerCase().includes(term) || 
        service.cptCode.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [searchService, serviceCategory, testMasters]);

  // Sync Age and DOB
  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const { years, ageString } = calculateAgeDetails(val);
      setAge(years.toString());
      setAgeUnitStr(ageString);
    }
  };

  const handleAgeChange = (val: string) => {
    setAge(val);
    if (val) {
      const numAge = parseInt(val) || 0;
      const today = new Date();
      const calculatedYear = today.getFullYear() - numAge;
      setDob(`${calculatedYear}-01-01`);
      setAgeUnitStr(`${numAge} Y / 0 M / 0 D`);
    }
  };

  // Perform persistence search
  const handleSearch = () => {
    setSearchDone(true);
    let term = '';
    if (searchBy === 'Mobile Number') term = searchMobile;
    else if (searchBy === 'UHID/MRN') term = searchUhid;
    else if (searchBy === 'External Visit ID') term = searchExtId;
    else term = searchName;

    const trimmed = term.trim().toLowerCase();
    if (!trimmed) {
      setSearchResults([]);
      setShowSearchPopup(true);
      return;
    }

    const filtered = patients.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(trimmed);
      const contactMatch = p.contactNo.includes(trimmed);
      const bookingMatch = p.bookingNo.toLowerCase().includes(trimmed);
      return nameMatch || contactMatch || bookingMatch;
    });

    setSearchResults(filtered);
    setShowSearchPopup(true);
  };

  const selectExistingPatient = (p: Patient) => {
    // Populate form fields
    const names = p.name.split(' ');
    setFirstName(names[0] || '');
    setMiddleName(names.length > 2 ? names.slice(1, -1).join(' ') : '');
    setLastName(names.length > 1 ? names[names.length - 1] : '');
    setAge(p.age.toString());
    setGender(p.gender);
    setMobileNumber(p.contactNo.replace('+971', '').replace('+91', '').trim());
    setDob(new Date(new Date().getFullYear() - p.age, 0, 1).toISOString().split('T')[0]);
    setReferredByDetail(p.referralType.includes('B2B') ? 'Client' : p.referralType);
    setAddressLine1('123 Health Street, Al Nahda');
    setArea('Al Nahda');
    setCity(DEFAULT_CITY);
    setCountry(DEFAULT_COUNTRY);
    setNationality(DEFAULT_NATIONALITY);
    setPincode('12345');

    // Notify user
    alert(`Auto-populated details for existing patient: ${p.name}`);
  };

  // Service helper triggers
  const removeService = (code: string) => {
    setSelectedServices(prev => prev.filter(s => s.code !== code));
  };

  const updateQuantity = (code: string, change: number) => {
    setSelectedServices(prev => prev.map(s => {
      if (s.code === code) {
        return { ...s, quantity: Math.max(1, s.quantity + change) };
      }
      return s;
    }));
  };

  const addCustomService = () => {
    setCustomServiceName('');
    setCustomServicePrice('50.00');
    setCustomServiceCategory('Custom');
    setShowCustomServiceModal(true);
  };

  const handleAddCustomServiceSubmit = () => {
    if (!customServiceName.trim()) {
      alert('Please enter a service name.');
      return;
    }
    const price = parseFloat(customServicePrice) || 0;
    const newService: ServiceItem = {
      code: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      cptCode: `${Math.floor(80000 + Math.random() * 9000)}`,
      name: customServiceName.trim(),
      category: customServiceCategory,
      quantity: 1,
      unitPrice: price
    };
    setSelectedServices(prev => [...prev, newService]);
    setShowCustomServiceModal(false);
  };

  const handleFinalSubmit = () => {
    const combinedName = `${title} ${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
    
    onRegister({
      name: combinedName || 'John Doe',
      age: parseInt(age) || 34,
      gender: gender,
      contactNo: `${mobilePrefix} ${mobileNumber}` || '+971 50 123 4567',
      referralType: 'B2C',
      priority: isSTAT ? 'STAT' : (isVIP ? 'Urgent' : 'Routine'),
      testPanel: selectedServices.map(s => s.name).join(', ') || 'General Diagnostics',
      billingAmount: netAmount,
      paymentStatus: paymentMode === 'Insurance' ? 'Partial' : 'Paid',
      
      // Extensive guided variables
      title,
      firstName,
      middleName,
      lastName,
      dob,
      ageUnitStr,
      emailPrimary,
      emailSecondary,
      uidType,
      uidNo,
      referredByDetail,
      doctorSearch,
      clientSearch,
      externalId,
      externalVisitId,
      rider,
      marketingExecutive,
      referralRemarks,
      addressLine1,
      addressLine2,
      area,
      city,
      state,
      country,
      pincode,
      nationality,

      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi: parseFloat(bmi),
      bodyTemp: parseFloat(bodyTemp),
      pulseRate: parseInt(pulseRate),
      spo2: parseInt(spo2),
      bloodPressure,
      allergicHistory,
      surgicalHistory,
      medicineHistory,
      socialHistory,
      clinicalConditions,
      symptoms,

      selectedServices,
      discountType,
      discountPercent: parseFloat(discountPercent),
      isAuthRequired,
      isNonStandard,
      collectionDttm,

      insuranceReceiver,
      insurancePayer,
      insuranceNetwork,
      insuranceMembershipNo,
      insurancePolicyNo,
      insuranceCardExpiry,
      insuranceCoPay: parseFloat(insuranceCoPay),
      insuranceCoPayPercent,
      insuranceElgAmt: parseFloat(insuranceElgAmt),
      insuranceVisitType,
      paymentMode,
      cashTendered: parseFloat(cashTendered),
      cashCollected: netAmount,
      cashChange,
      discountApprovedBy,
      paymentReceiptNo: generatedReceiptNo
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PROGRESS INDICATOR BAR */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { stepNum: 1, name: 'Patient Details', desc: 'Referral & Contact' },
            { stepNum: 2, name: 'Patient Assessment', desc: 'Assessment & History' },
            { stepNum: 3, name: 'Services & Pricing', desc: 'Select Services' },
            { stepNum: 4, name: 'Billing & Payment', desc: 'Payment & Summary' },
            { stepNum: 5, name: 'Summary', desc: 'Review & Confirm' }
          ].map(s => {
            const isActive = step === s.stepNum;
            const isCompleted = step > s.stepNum;
            return (
              <div 
                key={s.stepNum} 
                className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/20 border-l-4 border-indigo-600' 
                    : 'bg-transparent'
                }`}
              >
                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}>
                  {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : s.stepNum}
                </div>
                <div className="min-w-0 text-left">
                  <span className={`block text-xs font-extrabold truncate ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500'}`}>{s.name}</span>
                  <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 font-medium truncate">{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PERSISTENT PATIENT SEARCH HEADER (Always visible or shows current selection summary) */}
      {step === 1 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Patient Search Registry</h3>
          </div>
          <p className="text-[11px] text-zinc-400 leading-none">
            Search for an existing patient using any of the identifiers below. If no match is found, you can create a new patient.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[9px] font-bold text-zinc-400 uppercase">Search By</label>
              <select 
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 font-bold"
              >
                <option value="Mobile Number">Mobile Number</option>
                <option value="UHID/MRN">UHID / MRN</option>
                <option value="Patient Name">Patient Name</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="text-[9px] font-bold text-zinc-400 uppercase">Search Term</label>
              {searchBy === 'Mobile Number' && (
                <input 
                  type="text" 
                  placeholder="Enter 10 digit mobile"
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                />
              )}
              {searchBy === 'UHID/MRN' && (
                <input 
                  type="text" 
                  placeholder="Enter UHID / MRN"
                  value={searchUhid}
                  onChange={(e) => setSearchUhid(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                />
              )}
              {searchBy === 'Patient Name' && (
                <input 
                  type="text" 
                  placeholder="Enter Patient Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                />
              )}
            </div>

            <div className="sm:col-span-3 flex gap-2">
              <button 
                type="button"
                onClick={handleSearch}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Search
              </button>
              <button 
                type="button"
                onClick={() => {
                  setSearchMobile('');
                  setSearchUhid('');
                  setSearchExtId('');
                  setSearchName('');
                  setSearchResults([]);
                  setSearchDone(false);
                }}
                className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Clear
              </button>
            </div>
          </div>


        </div>
      ) : (
        /* PERSISTENT PATIENT SUMMARY STRIP ON TOP OF STEPS 2, 3, 4, 5 */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                {firstName || lastName ? `${title} ${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim() : 'John Doe'}
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium">
                MRN: {uidNo || 'MRN-2026-9081'} &bull; {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'} &bull; {age || '34'} Yrs &bull; {mobilePrefix} {mobileNumber || '50 123 4567'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-zinc-200 dark:border-zinc-700"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Edit Details</span>
          </button>
        </div>
      )}

      {/* 3. STEP CONTENT SECTIONS */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        
        {/* STEP 1: PATIENT DETAILS, REFERRAL, CONTACT DETAILS */}
        {step === 1 && (
          <div className="space-y-6 text-left">
            
            {/* Demographics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <User className="h-4 w-4" /> 1. Patient Details
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isVIP}
                      onChange={(e) => setIsVIP(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                      ★ VIP
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isSTAT}
                      onChange={(e) => setIsSTAT(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      ⚠ STAT
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Title *</label>
                  <select 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">First Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, firstName: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.firstName ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Middle Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Gender *</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Date of Birth *</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-zinc-400" />
                    <input 
                      type="date" 
                      value={dob}
                      onChange={(e) => {
                        handleDobChange(e.target.value);
                        if (e.target.value) setValidationErrors(prev => ({ ...prev, dob: false, age: false }));
                      }}
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 pr-10 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.dob ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Age *</label>
                  <input 
                    type="number" 
                    placeholder="--"
                    value={age}
                    onChange={(e) => {
                      handleAgeChange(e.target.value);
                      if (e.target.value) setValidationErrors(prev => ({ ...prev, age: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.age ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Year / Month / Days</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={ageUnitStr}
                    className="w-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none text-zinc-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Mobile Number *</label>
                  <div className="flex gap-1">
                    <select 
                      value={mobilePrefix}
                      onChange={(e) => setMobilePrefix(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none max-w-[75px]"
                    >
                      <option value="+971">+971 (UAE)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+1">+1 (USA/Canada)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+966">+966 (KSA)</option>
                      <option value="+974">+974 (Qatar)</option>
                      <option value="+968">+968 (Oman)</option>
                      <option value="+965">+965 (Kuwait)</option>
                      <option value="+973">+973 (Bahrain)</option>
                      <option value="+65">+65 (Singapore)</option>
                      <option value="+61">+61 (Australia)</option>
                    </select>
                    <input 
                      type="tel" 
                      placeholder="50 123 4567"
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, mobileNumber: false }));
                      }}
                      className={`flex-1 bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.mobileNumber ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Email (Primary)</label>
                  <input 
                    type="email" 
                    placeholder="Enter Primary Email"
                    value={emailPrimary}
                    onChange={(e) => setEmailPrimary(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Email (Secondary)</label>
                  <input 
                    type="email" 
                    placeholder="Enter Secondary Email"
                    value={emailSecondary}
                    onChange={(e) => setEmailSecondary(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">UID Type</label>
                  <select 
                    value={uidType}
                    onChange={(e) => setUidType(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="Select UID Type">Select UID Type</option>
                    <option value="Passport">Passport</option>
                    <option value="Emirates ID">Emirates ID</option>
                    <option value="Adhaar Card">Aadhaar Card</option>
                  </select>
                </div>
              </div>

              {uidType !== 'Select UID Type' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">UID No.</label>
                    <input 
                      type="text" 
                      placeholder="Enter UID Number"
                      value={uidNo}
                      onChange={(e) => setUidNo(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Referral details */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                <Building2 className="h-4 w-4" /> 2. Referral Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Referred By *</label>
                  <select 
                    value={referredByDetail}
                    onChange={(e) => setReferredByDetail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="Self">Self</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Client">Client / Corporate</option>
                  </select>
                </div>

                {referredByDetail === 'Doctor' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Doctor *</label>
                    <input 
                      type="text" 
                      placeholder="Search Doctor..."
                      value={doctorSearch}
                      onChange={(e) => {
                        setDoctorSearch(e.target.value);
                        if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, doctorSearch: false }));
                      }}
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.doctorSearch ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                    />
                  </div>
                )}

                {referredByDetail === 'Client' && (
                  <div className="space-y-1 animate-fade-in relative">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Client *</label>
                    <input 
                      type="text" 
                      placeholder="Search Client..."
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, clientSearch: false }));
                        setShowClientDropdown(true);
                      }}
                      onFocus={() => setShowClientDropdown(true)}
                      onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.clientSearch ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                    />
                    {showClientDropdown && clientSearch.trim() && (
                      <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg divide-y divide-zinc-100 dark:divide-zinc-800">
                        {DEFAULT_COMPANIES.filter(c => c.clientName.toLowerCase().includes(clientSearch.toLowerCase())).map(c => (
                          <div 
                            key={c.clientCode}
                            onMouseDown={() => {
                              setClientSearch(c.clientName);
                              setShowClientDropdown(false);
                            }}
                            className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer text-xs flex flex-col items-start"
                          >
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.clientName}</span>
                            <span className="text-[10px] text-zinc-400">{c.clientType} &bull; {c.clientCode}</span>
                          </div>
                        ))}
                        {DEFAULT_COMPANIES.filter(c => c.clientName.toLowerCase().includes(clientSearch.toLowerCase())).length === 0 && (
                          <div className="p-3 text-center text-[10px] text-zinc-400">
                            No match found (uses typed custom client)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">External ID</label>
                  <input 
                    type="text" 
                    placeholder="Enter External ID"
                    value={externalId}
                    onChange={(e) => setExternalId(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">External Visit ID *</label>
                  <input 
                    type="text" 
                    placeholder="Enter External Visit ID"
                    value={externalVisitId}
                    onChange={(e) => {
                      setExternalVisitId(e.target.value);
                      if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, externalVisitId: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.externalVisitId ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Rider</label>
                  <select 
                    value={rider}
                    onChange={(e) => setRider(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="Select Rider">Select Rider</option>
                    <option value="Rider A">Rider A (Abu Dhabi Link)</option>
                    <option value="Rider B">Rider B (Dubai North Route)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Marketing Executive</label>
                  <select 
                    value={marketingExecutive}
                    onChange={(e) => setMarketingExecutive(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="Select Executive">Select Executive</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="James Wilson">James Wilson</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Referral Remarks *</label>
                  <input 
                    type="text" 
                    placeholder="Enter referral remarks"
                    value={referralRemarks}
                    onChange={(e) => {
                      setReferralRemarks(e.target.value);
                      if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, referralRemarks: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.referralRemarks ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>
              </div>
            </div>

            {/* Address & Contact Details */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                <ClipboardList className="h-4 w-4" /> 3. Contact & Address Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Address Line 1 *</label>
                  <input 
                    type="text" 
                    placeholder="Enter Address Line 1"
                    value={addressLine1}
                    onChange={(e) => {
                      setAddressLine1(e.target.value);
                      if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, addressLine1: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.addressLine1 ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Address Line 2</label>
                  <input 
                    type="text" 
                    placeholder="Enter Address Line 2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Area *</label>
                  <input 
                    type="text" 
                    placeholder="Enter Area / Locality"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, area: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.area ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">City *</label>
                  <select 
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (e.target.value) setValidationErrors(prev => ({ ...prev, city: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.city ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  >
                    {getCitiesForState(country, state).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">State / Province *</label>
                  <select 
                    value={state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setState(newState);
                      const cities = getCitiesForState(country, newState);
                      if (cities.length > 0) setCity(cities[0]);
                      if (newState) setValidationErrors(prev => ({ ...prev, state: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.state ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  >
                    {getStatesForCountry(country).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Country *</label>
                  <select 
                    value={country}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setCountry(newCountry);
                      const states = getStatesForCountry(newCountry);
                      if (states.length > 0) {
                        setState(states[0].name);
                        const cities = getCitiesForState(newCountry, states[0].name);
                        if (cities.length > 0) setCity(cities[0]);
                      }
                      if (newCountry) setValidationErrors(prev => ({ ...prev, country: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.country ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  >
                    {LOCATIONS.map(l => <option key={l.country} value={l.country}>{l.country}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Pincode / ZIP *</label>
                  <input 
                    type="text" 
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      if (e.target.value.trim()) setValidationErrors(prev => ({ ...prev, pincode: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.pincode ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Nationality *</label>
                  <select 
                    value={nationality}
                    onChange={(e) => {
                      setNationality(e.target.value);
                      if (e.target.value) setValidationErrors(prev => ({ ...prev, nationality: false }));
                    }}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 ${validationErrors.nationality ? 'border-rose-500 ring-1 ring-rose-500/30 dark:border-rose-500' : 'border-zinc-200 dark:border-zinc-800'}`}
                  >
                    <option value="Indian">Indian</option>
                    <option value="Emirati">Emirati</option>
                    <option value="British">British</option>
                    <option value="American">American</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                    <option value="Pakistani">Pakistani</option>
                    <option value="Bangladeshi">Bangladeshi</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Saudi">Saudi</option>
                    <option value="Jordanian">Jordanian</option>
                    <option value="Lebanese">Lebanese</option>
                    <option value="Egyptian">Egyptian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: PATIENT ASSESSMENT */}
        {step === 2 && (
          <div className="space-y-6 text-left">
            
            {/* Anthropometry & Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/60">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <HeartPulse className="h-4 w-4" /> 1. Anthropometry
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Height (cms)</label>
                    <input 
                      type="text" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Weight (kgs)</label>
                    <input 
                      type="text" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      BMI (kg/m²) <Info className="h-3 w-3 text-zinc-400" />
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={bmi}
                      className="w-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl font-bold"
                    />
                    <span className="block text-[10px] text-emerald-600 font-extrabold mt-1">{bmiLabel}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/60">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <HeartPulse className="h-4 w-4" /> 2. Vital Signs
                </h4>

                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Temp (°C)</label>
                    <input 
                      type="text" 
                      value={bodyTemp}
                      onChange={(e) => setBodyTemp(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Pulse (bpm)</label>
                    <input 
                      type="text" 
                      value={pulseRate}
                      onChange={(e) => setPulseRate(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">SPO2 (%)</label>
                    <input 
                      type="text" 
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">BP (mmHg)</label>
                    <input 
                      type="text" 
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medical history note inputs */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                <ClipboardList className="h-4 w-4" /> 3. Medical History (Clinical Notes)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Allergic History</label>
                  <textarea 
                    placeholder="Enter allergic history"
                    value={allergicHistory}
                    onChange={(e) => setAllergicHistory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none h-16 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Surgical History</label>
                  <textarea 
                    placeholder="Enter surgical history"
                    value={surgicalHistory}
                    onChange={(e) => setSurgicalHistory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none h-16 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Medicine History</label>
                  <textarea 
                    placeholder="Enter medicine history"
                    value={medicineHistory}
                    onChange={(e) => setMedicineHistory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none h-16 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Social History</label>
                  <textarea 
                    placeholder="Enter social history"
                    value={socialHistory}
                    onChange={(e) => setSocialHistory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none h-16 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Clinical checkboxes checklist */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                <Info className="h-4 w-4" /> 4. Clinical History (Select conditions)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  'Diabetes', 'Hypotimes', 'Hyperthyroid', 'Hypertension', 
                  'Kidney Disease', 'Liver Disease', 'Obesity', 'Emergency - Recipient',
                  'Emergency - Donor', 'Pre Kidney Transplant - Recipient', 'Pre Kidney Transplant - Donor'
                ].map(cond => {
                  const hasCond = clinicalConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => {
                        if (hasCond) setClinicalConditions(prev => prev.filter(c => c !== cond));
                        else setClinicalConditions(prev => [...prev, cond]);
                      }}
                      className={`p-2.5 rounded-xl border text-[11px] font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                        hasCond 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300' 
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50'
                      }`}
                    >
                      <span>{cond}</span>
                      <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 ${hasCond ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 bg-white dark:bg-zinc-900'}`}>
                        {hasCond && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Health conditions Symptoms */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                <HeartPulse className="h-4 w-4" /> 5. Health Conditions / Symptoms
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Abdominal Pain', 'Asymptomatic', 'Bleeding from Nose / Mouth', 'Blood in Stool',
                  'Blood in Urine', 'Body Ache', 'Burning Urine', 'Cough with Sputum',
                  'Cough without Sputum', 'Deep Yellow Urine', 'Discoloration of Stool', 'Fever',
                  'Painful Urination', 'Pus in Urine', 'Polyuria', 'Loss of Appetite'
                ].map(symp => {
                  const hasSymp = symptoms.includes(symp);
                  return (
                    <button
                      key={symp}
                      type="button"
                      onClick={() => {
                        if (hasSymp) setSymptoms(prev => prev.filter(s => s !== symp));
                        else setSymptoms(prev => [...prev, symp]);
                      }}
                      className={`p-2 rounded-xl border text-[10px] font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                        hasSymp 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300' 
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50'
                      }`}
                    >
                      <span>{symp}</span>
                      <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${hasSymp ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 bg-white dark:bg-zinc-900'}`}>
                        {hasSymp && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: SERVICES & PRICING */}
        {step === 3 && (
          <div className="space-y-6 text-left">
            
            {/* Services Table and selection */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> Select Services / Tests
                </h4>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={addCustomService}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Custom Service
                  </button>
                </div>
              </div>

              {/* Service query controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search by Service Name / Code / CPT Code..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 pl-9 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <select 
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Urinalysis">Urinalysis</option>
                  </select>
                </div>
              </div>

              {/* Master Services catalog search results */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 dark:text-indigo-400">
                    Available Services & Tests ({availableServices.length} found)
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">Click "+ Add" to add to patient test panel</span>
                </div>
                
                {availableServices.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No matching services found in master catalog. Click "+ Add Custom Service" to create one.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                    {availableServices.map(service => {
                      const isAlreadySelected = selectedServices.some(s => s.code === service.code);
                      return (
                        <div key={service.code} className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl flex items-center justify-between text-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                          <div className="min-w-0 pr-2 text-left">
                            <span className="font-bold text-zinc-800 dark:text-zinc-150 block truncate" title={service.name}>{service.name}</span>
                            <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">{service.code} &bull; {service.category} &bull; ₹{service.unitPrice.toFixed(2)}</span>
                            {service.sampleType && <span className="text-[9px] text-zinc-400 block mt-0.5">Sample: {service.sampleType} &bull; Ref: {service.referenceRange}</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedServices(prev => {
                                const exists = prev.find(s => s.code === service.code);
                                if (exists) {
                                  return prev.map(s => s.code === service.code ? { ...s, quantity: s.quantity + 1 } : s);
                                }
                                return [...prev, { 
                                  code: service.code, 
                                  cptCode: service.cptCode, 
                                  name: service.name, 
                                  category: service.category, 
                                  quantity: 1, 
                                  unitPrice: service.unitPrice,
                                  testMasterId: service.testMasterId,
                                  sampleType: service.sampleType,
                                  units: service.units,
                                  referenceRange: service.referenceRange
                                }];
                              });
                              setValidationErrors(prev => ({ ...prev, selectedServices: false }));
                            }}
                            className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-colors cursor-pointer shrink-0 ${
                              isAlreadySelected 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {isAlreadySelected ? 'Added ✓' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Table of selected services */}
              <div className={`border rounded-2xl overflow-hidden shadow-xs transition-colors ${validationErrors.selectedServices ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <table className="w-full text-left text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-[10px] uppercase font-black tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">S.No</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">CPT Code</th>
                      <th className="px-4 py-3">Service Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Unit Price (INR)</th>
                      <th className="px-4 py-3 text-right">Gross Amount (INR)</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                    {selectedServices.map((item, idx) => (
                      <tr key={item.code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10">
                        <td className="px-4 py-3 font-mono text-zinc-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold">{item.code}</td>
                        <td className="px-4 py-3 font-mono text-zinc-400">{item.cptCode}</td>
                        <td className="px-4 py-3 font-bold text-zinc-900 dark:text-zinc-100">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] rounded font-bold">{item.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.code, -1)}
                              className="h-6 w-6 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.code, 1)}
                              className="h-6 w-6 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold">{item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">{(item.quantity * item.unitPrice).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            type="button" 
                            onClick={() => removeService(item.code)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Discount inputs & Date-time */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/60">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Type</label>
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount ({discountType === 'Percentage' ? '%' : 'INR'})</label>
                  <input 
                    type="text" 
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Auth Required</label>
                  <select 
                    value={isAuthRequired}
                    onChange={(e) => setIsAuthRequired(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (MD Approval)</option>
                  </select>
                </div>
                <div className="space-y-1 flex flex-col justify-center">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1">STAT</label>
                  <button 
                    type="button" 
                    onClick={() => setIsSTAT(!isSTAT)}
                    className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center cursor-pointer transition-colors ${isSTAT ? 'bg-rose-600 text-white border-rose-600' : 'bg-white dark:bg-zinc-900 border-zinc-200 text-zinc-500'}`}
                  >
                    {isSTAT ? 'Yes (Urgent)' : 'No'}
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Collection Date & Time</label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input 
                      type="text" 
                      value={collectionDttm}
                      onChange={(e) => setCollectionDttm(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2 pr-10 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Summary banner */}
              <div className="bg-zinc-900 dark:bg-zinc-950 text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-1 text-center sm:text-left">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400">Gross Amount</span>
                    <span className="text-sm font-black font-mono">₹{grossAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400">Discount ({discountPercent}%)</span>
                    <span className="text-sm font-black font-mono text-emerald-400">- {discountValue.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400">Insured Amount</span>
                    <span className="text-sm font-black font-mono">₹0.00</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400">Patient Payable</span>
                    <span className="text-sm font-black font-mono text-indigo-400">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400">Net Amount</span>
                    <span className="text-base font-black font-mono text-white">₹{netAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-5 flex items-center justify-between gap-4 shrink-0">
                  <div className="text-left">
                    <span className="block text-[9px] uppercase font-bold text-zinc-400">Payment Type</span>
                    <span className="text-xs font-bold text-white block">{paymentMode}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => alert('Change in Billing Summary Payment tab in Step 4.')}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* STEP 4: BILLING & PAYMENT */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Left side: Insurance, Payment Mode and Discount inputs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Insurance info */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <ShieldCheck className="h-4 w-4" /> 1. Insurance Information (If Applicable)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Receiver</label>
                    <input 
                      type="text" 
                      value={insuranceReceiver}
                      onChange={(e) => setInsuranceReceiver(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Payer</label>
                    <input 
                      type="text" 
                      value={insurancePayer}
                      onChange={(e) => setInsurancePayer(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Network</label>
                    <input 
                      type="text" 
                      value={insuranceNetwork}
                      onChange={(e) => setInsuranceNetwork(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Membership No.</label>
                    <input 
                      type="text" 
                      value={insuranceMembershipNo}
                      onChange={(e) => setInsuranceMembershipNo(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Policy No.</label>
                    <input 
                      type="text" 
                      value={insurancePolicyNo}
                      onChange={(e) => setInsurancePolicyNo(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Card Expiry</label>
                    <input 
                      type="text" 
                      value={insuranceCardExpiry}
                      onChange={(e) => setInsuranceCardExpiry(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Co-Pay (INR)</label>
                    <input 
                      type="text" 
                      value={insuranceCoPay}
                      onChange={(e) => setInsuranceCoPay(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Mode Tabs */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <IndianRupee className="h-4 w-4" /> 2. Payment Mode
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                  
                  {/* Vertical Tabs navigation */}
                  <div className="sm:col-span-3 flex sm:flex-col gap-1.5">
                    {['Cash', 'Card', 'Cheque', 'Online'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                          paymentMode === mode
                            ? 'bg-[#3c3bb6] text-white shadow-sm'
                            : 'bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800/40 text-zinc-500 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Tab panel contents */}
                  <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Tendered (INR)</label>
                      <input 
                        type="text" 
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Collected (INR)</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={netAmount.toFixed(2)}
                        className="w-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl font-bold font-mono text-zinc-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Change (INR)</label>
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-center text-xs">
                        {cashChange.toFixed(2)}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Discount Approvals */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <CheckCircle2 className="h-4 w-4" /> 3. Discount (If Applicable)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Type</label>
                    <select 
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Approved By</label>
                    <input 
                      type="text" 
                      placeholder="Doctor or Manager name"
                      value={discountApprovedBy}
                      onChange={(e) => setDiscountApprovedBy(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount (%)</label>
                    <input 
                      type="text" 
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Amt (INR)</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={discountValue.toFixed(2)}
                      className="w-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none text-zinc-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Remarks</label>
                  <textarea 
                    placeholder="Enter approval details or reason..."
                    value={discountRemarks}
                    onChange={(e) => setDiscountRemarks(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none h-14 resize-none"
                  />
                </div>
              </div>

            </div>

            {/* Right side: Summary invoice and receipt details card */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Billing details block */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <Receipt className="h-4 w-4" /> 4. Billing Summary (INR)
                </h4>

                <div className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <div className="flex justify-between">
                    <span>Gross Amount:</span>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono font-bold text-rose-500">- {discountValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-2 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <span>Net Amount:</span>
                    <span className="font-mono text-indigo-700 dark:text-indigo-400 text-sm font-black">{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Amount:</span>
                    <span className="font-mono">0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient Payable:</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200 font-bold">{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-2 font-black text-emerald-600 dark:text-emerald-400">
                    <span>Collected Amount:</span>
                    <span className="font-mono">{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-500">
                    <span>Due Amount:</span>
                    <span className="font-mono">0.00</span>
                  </div>
                </div>
              </div>

              {/* Payment Confirmation receipt */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Payment Confirmation</span>
                </div>

                <div className="space-y-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold leading-relaxed text-left">
                  <p>Payment Mode: <span className="text-zinc-950 dark:text-zinc-100 font-bold">{paymentMode}</span></p>
                  <p>Transaction Time: <span className="text-zinc-950 dark:text-zinc-100 font-bold">{collectionDttm}</span></p>
                  <p>Collected By: <span className="text-zinc-950 dark:text-zinc-100 font-bold">Sarah Jenkins</span></p>
                  <p>Receipt No: <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">{generatedReceiptNo}</span></p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* STEP 5: REVIEW SUMMARY & CONFIRM */}
        {step === 5 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Left bento review column */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <User className="h-4 w-4" /> 1. Patient Details Summary
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Title & Name:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{title} {firstName} {middleName} {lastName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Gender:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">DOB & Age:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{dob || 'N/A'} ({age || 'N/A'} Y)</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Primary Mobile:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">{mobilePrefix} {mobileNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Email Inbox:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{emailPrimary || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">UID Details:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{uidType} - {uidNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <Building2 className="h-4 w-4" /> 2. Referral Details Summary
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Referred By:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{referredByDetail}</span>
                  </div>
                  {referredByDetail === 'Doctor' && (
                    <div>
                      <span className="block text-[9px] text-zinc-400 uppercase">Doctor:</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">{doctorSearch || 'N/A'}</span>
                    </div>
                  )}
                  {referredByDetail === 'Client' && (
                    <div>
                      <span className="block text-[9px] text-zinc-400 uppercase">Client / Corp:</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">{clientSearch || 'N/A'}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">External Visit ID:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{externalVisitId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Rider & Executive:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{rider} / {marketingExecutive}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[9px] text-zinc-400 uppercase">Remarks:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold italic">"{referralRemarks || 'None'}"</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <ClipboardList className="h-4 w-4" /> 3. Contact & Address Details
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="sm:col-span-2">
                    <span className="block text-[9px] text-zinc-400 uppercase">Address:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{addressLine1} {addressLine2}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Area / City:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{area} / {city}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">State / Country:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{state} / {country}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">ZIP & Nationality:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{pincode} / {nationality}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <HeartPulse className="h-4 w-4" /> 4. Patient Assessment Summary
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Height / Weight / BMI:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{height}cm / {weight}kg ({bmi} - {bmiLabel})</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Vitals (BP/Pulse/SPO2/Temp):</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{bloodPressure} / {pulseRate}bpm / {spo2}% / {bodyTemp}°C</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[9px] text-zinc-400 uppercase">Symptoms Selected:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptoms.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 rounded font-bold text-[9px]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <Layers className="h-4 w-4" /> 5. Selected Services
                </h4>

                <table className="w-full text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <thead className="text-[9px] text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th>S.No</th>
                      <th>Code</th>
                      <th>CPT</th>
                      <th>Service Name</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Discount</th>
                      <th className="text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedServices.map((s, idx) => (
                      <tr key={s.code} className="py-1">
                        <td className="py-1.5">{idx + 1}</td>
                        <td className="font-mono">{s.code}</td>
                        <td className="font-mono text-zinc-400">{s.cptCode}</td>
                        <td className="font-bold text-zinc-900 dark:text-zinc-100">{s.name}</td>
                        <td className="text-center">{s.quantity}</td>
                        <td className="text-right font-mono">{s.unitPrice.toFixed(2)}</td>
                        <td className="text-right font-mono text-rose-500">0.00</td>
                        <td className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">{(s.quantity * s.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-[11px] font-bold text-zinc-500 border-t pt-3 text-right">
                  Gross Amount: <span className="font-mono text-zinc-900 dark:text-zinc-100">₹{grossAmount.toFixed(2)}</span> &bull; Discount: <span className="font-mono text-rose-500">₹{discountValue.toFixed(2)}</span> &bull; Net Amount: <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm font-black">₹{netAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Right side invoices / payment stats block */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <Receipt className="h-4 w-4" /> Billing Summary (INR)
                </h4>

                <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <div className="flex justify-between">
                    <span>Gross Amount:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-150">{grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono font-bold text-rose-500">- {discountValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-zinc-900 dark:text-zinc-150">
                    <span>Net Amount:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm font-black">{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient Payable:</span>
                    <span className="font-mono">{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-black text-emerald-600 dark:text-emerald-400">
                    <span>Collected Amount:</span>
                    <span className="font-mono">{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-500">
                    <span>Due Amount:</span>
                    <span className="font-mono">0.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b pb-2">
                  <CheckCircle2 className="h-4 w-4" /> Payment Details
                </h4>

                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-semibold text-left">
                  <p>Payment Mode: <span className="text-zinc-950 dark:text-zinc-100 font-bold">{paymentMode}</span></p>
                  <p>Cash Tendered: <span className="text-zinc-950 dark:text-zinc-100 font-mono font-bold">₹{cashTendered}</span></p>
                  <p>Cash Collected: <span className="text-zinc-950 dark:text-zinc-100 font-mono font-bold">₹{netAmount.toFixed(2)}</span></p>
                  <p>Change: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">₹{cashChange.toFixed(2)}</span></p>
                  <p>Receipt No: <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">{generatedReceiptNo}</span></p>
                </div>
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-2xl text-[11px] text-zinc-500 space-y-2 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-300">
                  <Info className="h-4 w-4" />
                  <span>Important Notes</span>
                </div>
                <p>&bull; Please review all details before confirming registration.</p>
                <p>&bull; You can edit any section using the "Edit" option in respective steps.</p>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 4. STICKY FOOTER NAVIGATION */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                const errors = performValidation(step);
                setValidationErrors(errors);
                setStep(prev => prev - 1);
              }}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 text-zinc-500 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this entire registration draft?')) {
                  onCancel();
                }
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200/50 cursor-pointer transition-colors"
            >
              Cancel Registration
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const errors = performValidation(step);
              setValidationErrors(errors);
              if (Object.keys(errors).length > 0) {
                alert('Cannot save draft: Please fill in all highlighted mandatory fields.');
                return;
              }
              alert('Draft successfully saved to cloud. You can retrieve it at any time from active sessions.');
            }}
            className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 cursor-pointer transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                const errors = performValidation(step);
                setValidationErrors(errors);
                if (Object.keys(errors).length > 0) {
                  alert('Please fill in all highlighted mandatory fields before proceeding.');
                  return;
                }
                setStep(prev => prev + 1);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 bg-[#3c3bb6] hover:bg-[#31309c] text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <UserCheck className="h-4.5 w-4.5" />
              <span>Confirm Registration</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. PATIENT SEARCH POPUP MODAL */}
      {showSearchPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150 text-left overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="h-4 w-4 text-indigo-500" /> Patient Registry Search
                </h3>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Matched patients across registration databases</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSearchPopup(false)}
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 rounded-lg cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {searchResults.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-zinc-500 font-medium">No patient records matched your search query.</p>
                  <p className="text-[10px] text-zinc-400 italic">You can close this and click 'Next' to create a new registration record.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-black tracking-wider text-indigo-500">
                    Matches Found ({searchResults.length})
                  </span>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden">
                    {searchResults.map(p => (
                      <div key={p.id} className="p-3.5 bg-white dark:bg-zinc-900 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 transition-colors">
                        <div className="min-w-0 flex-1 text-left">
                          <span className="font-bold block text-zinc-900 dark:text-zinc-100 text-xs truncate">{p.name}</span>
                          <div className="text-[10px] text-zinc-400 font-medium space-x-2 mt-0.5">
                            <span>MRN/UHID: <strong className="font-mono text-zinc-600 dark:text-zinc-300">{p.bookingNo}</strong></span>
                            <span>&bull;</span>
                            <span>{p.age} Yrs ({p.gender})</span>
                            <span>&bull;</span>
                            <span>Contact: {p.contactNo}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            selectExistingPatient(p);
                            setShowSearchPopup(false);
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black text-[10px] cursor-pointer shrink-0 shadow-sm"
                        >
                          Select & Use
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => setShowSearchPopup(false)}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD CUSTOM SERVICE POPUP MODAL */}
      {showCustomServiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-150 text-left overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 uppercase tracking-wider">
                  <Plus className="h-4 w-4 text-indigo-500" /> Create Custom Service
                </h3>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Add a custom diagnostic test or medical service</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCustomServiceModal(false)}
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 rounded-lg cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Service / Test Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lipoprotein-A (Lp(a))"
                  value={customServiceName}
                  onChange={(e) => setCustomServiceName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Unit Price (INR) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="50.00"
                    value={customServicePrice}
                    onChange={(e) => setCustomServicePrice(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                  <select 
                    value={customServiceCategory}
                    onChange={(e) => setCustomServiceCategory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                  >
                    <option value="Custom">Custom / General</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Urinalysis">Urinalysis</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomServiceModal(false)}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomServiceSubmit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
              >
                Create & Add
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
