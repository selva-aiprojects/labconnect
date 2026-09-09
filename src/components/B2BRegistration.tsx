/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  Users, FileSpreadsheet, Sparkles, Receipt, Building2, ShieldCheck, 
  Check, ChevronRight, ChevronLeft, Calendar, Clock, Trash2, Search, 
  Info, Layers, Plus, X, ClipboardList, ExternalLink, User, ArrowRight, Save, Printer
} from 'lucide-react';
import { Patient } from '../types/lims_app';
import { TestMaster } from '../types/testMaster';
import { LOCATIONS, DEFAULT_COUNTRY, DEFAULT_STATE, DEFAULT_CITY, DEFAULT_NATIONALITY, getStatesForCountry, getCitiesForState } from '../data/locations';

interface B2BRegistrationProps {
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

export function B2BRegistration({ patients, onRegister, onCancel, testMasters }: B2BRegistrationProps) {
  const [step, setStep] = useState<number>(1);

  // Search States
  const [searchBy, setSearchBy] = useState('Client Name');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DEFAULT_COMPANIES>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Form Fields State
  const [clientType, setClientType] = useState('Insurance');
  const [clientName, setClientName] = useState('Nexus Insurance LLC');
  const [externalVisitId, setExternalVisitId] = useState('EXT-2025-001');
  const [clientCode, setClientCode] = useState('NEXUS001');
  const [email, setEmail] = useState('info@nexusinsurance.ae');
  const [website, setWebsite] = useState('www.nexusinsurance.ae');
  const [phone, setPhone] = useState('+971 4 123 4567');
  const [fax, setFax] = useState('+971 4 123 4568');
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [state, setState] = useState(DEFAULT_STATE);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [clientCategory, setClientCategory] = useState('Corporate');
  const [gstNo, setGstNo] = useState('GST-90812-AE');
  const [taxId, setTaxId] = useState('TAX-NX-998');
  const [vatNo, setVatNo] = useState('VAT-NX-554');
  const [terms, setTerms] = useState('Net 30');
  const [creditLimit, setCreditLimit] = useState('50000');
  const [currency, setCurrency] = useState('INR');
  const [isActive, setIsActive] = useState(true);

  // Contact Fields State
  const [contactPerson, setContactPerson] = useState('James Wilson');
  const [designation, setDesignation] = useState('Relationship Manager');
  const [mobilePrefix, setMobilePrefix] = useState('+971');
  const [mobileNumber, setMobileNumber] = useState('50 123 4567');
  const [emailContact, setEmailContact] = useState('james.wilson@nexusinsurance.ae');
  const [addressLine1, setAddressLine1] = useState('Office 1201, Business Bay Tower');
  const [addressLine2, setAddressLine2] = useState('Al Abraj Street, Business Bay');
  const [area, setArea] = useState('Business Bay');
  const [pincode, setPincode] = useState('00000');
  const [cityContact, setCityContact] = useState(DEFAULT_CITY);
  const [stateContact, setStateContact] = useState(DEFAULT_STATE);
  const [countryContact, setCountryContact] = useState(DEFAULT_COUNTRY);
  const [nationality, setNationality] = useState(DEFAULT_NATIONALITY);

  // Step 2 Services States
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [searchService, setSearchService] = useState('');
  const [serviceCategory, setServiceCategory] = useState('All Categories');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountPercent, setDiscountPercent] = useState('5.00');
  const [isAuthRequired, setIsAuthRequired] = useState('No');
  const [isSTAT, setIsSTAT] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [isNonStandard, setIsNonStandard] = useState(false);
  const [collectionDttm, setCollectionDttm] = useState('15/07/2025 10:30 AM');

  // Step 3 Billing States
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [cashTendered, setCashTendered] = useState('300.00');
  const [cashCollected, setCashCollected] = useState('300.00');
  const [discountApprovedBy, setDiscountApprovedBy] = useState('James Wilson');
  const [discountRemarks, setDiscountRemarks] = useState('Corporate discount');
  const [transactionDttm, setTransactionDttm] = useState('15/07/2025 10:30 AM');
  const [receiptNo, setReceiptNo] = useState(`RCT-2025-0715-${Math.floor(10000 + Math.random() * 90000)}`);
  const [collectedBy, setCollectedBy] = useState('Sarah Jenkins');

  // Modals / Overlays
  const [showCompanyDetailsModal, setShowCompanyDetailsModal] = useState(false);
  const [showCustomServiceModal, setShowCustomServiceModal] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServicePrice, setCustomServicePrice] = useState('50.00');
  const [customServiceCat, setCustomServiceCat] = useState('Custom');

  // Computed Values
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

  const handlePrintSummary = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      alert('Please allow pop-ups to print the invoice summary.');
      return;
    }

    const printMarkup = `
      <html>
        <head>
          <title>Invoice Summary - ${clientName}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 28px; color: #18181b; }
            .header { border-bottom: 3px solid #3c3bb6; padding-bottom: 12px; margin-bottom: 16px; }
            h1 { margin: 0; color: #3c3bb6; font-size: 24px; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 12px; margin: 18px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #e4e4e7; padding: 8px 10px; text-align: left; font-size: 12px; }
            th { background: #f4f4f5; text-transform: uppercase; letter-spacing: 0.05em; font-size: 10px; }
            .totals { margin-top: 18px; width: 260px; margin-left: auto; font-size: 12px; }
            .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
            .grand { font-size: 16px; font-weight: 700; color: #3c3bb6; border-top: 1px solid #d4d4d8; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Cybe: LabConnect</h1>
            <div style="font-size:12px; color:#52525b; margin-top:6px;">Client Invoice Summary</div>
          </div>

          <div class="meta">
            <div><strong>Client:</strong> ${clientName}</div>
            <div><strong>Client Type:</strong> ${clientType}</div>
            <div><strong>Receipt No:</strong> ${receiptNo}</div>
            <div><strong>Transaction Date:</strong> ${transactionDttm}</div>
            <div><strong>Payment Mode:</strong> ${paymentMode}</div>
            <div><strong>Collection Date:</strong> ${collectionDttm}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${selectedServices.map(service => `
                <tr>
                  <td>${service.name}</td>
                  <td>${service.category}</td>
                  <td>${service.quantity}</td>
                  <td>₹${service.unitPrice.toFixed(2)}</td>
                  <td>₹${(service.quantity * service.unitPrice).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Gross Amount</span><span>₹${grossAmount.toFixed(2)}</span></div>
            <div><span>Discount</span><span>-₹${discountValue.toFixed(2)}</span></div>
            <div><span>Net Amount</span><span>₹${netAmount.toFixed(2)}</span></div>
            <div><span>Cash Tendered</span><span>₹${parseFloat(cashTendered || '0').toFixed(2)}</span></div>
            <div><span>Cash Collected</span><span>₹${parseFloat(cashCollected || '0').toFixed(2)}</span></div>
            <div class="grand"><span>Change</span><span>₹${cashChange.toFixed(2)}</span></div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printMarkup);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  // Company Search Function
  const handleSearchCompany = () => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) {
      setSearchResults([]);
      setSearchDone(true);
      return;
    }
    const filtered = DEFAULT_COMPANIES.filter(c => {
      if (searchBy === 'Client Name') return c.clientName.toLowerCase().includes(term);
      if (searchBy === 'Client Code') return c.clientCode.toLowerCase().includes(term);
      return c.contactPerson.toLowerCase().includes(term);
    });
    setSearchResults(filtered);
    setSearchDone(true);
  };

  // Populate Selected Company
  const selectExistingCompany = (company: typeof DEFAULT_COMPANIES[0]) => {
    setClientType(company.clientType);
    setClientName(company.clientName);
    setExternalVisitId(company.externalVisitId);
    setClientCode(company.clientCode);
    setEmail(company.email);
    setWebsite(company.website);
    setPhone(company.phone);
    setFax(company.fax);
    setCountry(company.country);
    setState(company.state);
    setCity(company.city);
    setClientCategory(company.clientCategory);
    setGstNo(company.gstNo);
    setTaxId(company.taxId);
    setVatNo(company.vatNo);
    setTerms(company.terms);
    setCreditLimit(company.creditLimit);
    setCurrency(company.currency);
    setIsActive(company.isActive);

    setContactPerson(company.contactPerson);
    setDesignation(company.designation);
    setMobilePrefix(company.mobilePrefix);
    setMobileNumber(company.mobileNumber);
    setEmailContact(company.emailContact);
    setAddressLine1(company.addressLine1);
    setAddressLine2(company.addressLine2);
    setArea(company.area);
    setPincode(company.pincode);
    setCityContact(company.cityContact);
    setStateContact(company.stateContact);
    setCountryContact(company.countryContact);
    setNationality(company.nationality);

    setSearchDone(false);
    setSearchQuery('');
  };

  // Add Custom Service
  const handleAddCustomService = () => {
    if (!customServiceName.trim()) return;
    const price = parseFloat(customServicePrice) || 0;
    const item: ServiceItem = {
      code: `CS-${Math.floor(100 + Math.random() * 900)}`,
      cptCode: `${Math.floor(80000 + Math.random() * 9999)}`,
      name: customServiceName,
      category: customServiceCat,
      quantity: 1,
      unitPrice: price
    };
    setSelectedServices(prev => [...prev, item]);
    setCustomServiceName('');
    setCustomServicePrice('50.00');
    setShowCustomServiceModal(false);
  };

  // Submit Final
  const handleFinalSubmit = () => {
    onRegister({
      name: clientName,
      age: 0, // Corporate entry
      gender: 'M',
      contactNo: `${mobilePrefix} ${mobileNumber}`,
      referralType: 'Corporate',
      priority: isSTAT ? 'STAT' : 'Routine',
      testPanel: selectedServices.map(s => `${s.name} x${s.quantity}`).join(', '),
      billingAmount: netAmount,
      paymentStatus: 'Paid'
    });
  };

  const stepsList = [
    { num: 1, title: 'Company & Contact Details', desc: 'Basic Information' },
    { num: 2, title: 'Services & Pricing', desc: 'Select Services' },
    { num: 3, title: 'Billing & Payment', desc: 'Payment & Summary' },
    { num: 4, title: 'Summary', desc: 'Review & Confirm' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* STEPS INDICATOR BAR */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <Building2 className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">Company Registration (B2B)</h2>
              <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Lims B2B Account Intake Pipeline</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stepsList.map((s, idx) => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="flex items-center">
                  {idx > 0 && <div className="h-[1px] w-4 md:w-8 bg-zinc-200 dark:bg-zinc-800 mx-2" />}
                  <button 
                    onClick={() => step > s.num && setStep(s.num)}
                    disabled={step < s.num}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' 
                        : isCompleted 
                          ? 'text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10'
                          : 'text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive 
                        ? 'bg-indigo-600 text-white' 
                        : isCompleted 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                      {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : s.num}
                    </div>
                    <div className="hidden lg:block">
                      <span className="block text-[11px] font-extrabold leading-none">{s.title}</span>
                      <span className="block text-[9px] text-zinc-400 font-medium mt-0.5">{s.desc}</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HEADER STRIP FOR STEPS 2, 3, 4 */}
      {step > 1 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                Client: {clientName || 'New Client Company'}
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold font-sans mt-0.5">
                External Visit ID: {externalVisitId || 'N/A'} &bull; Contact: {contactPerson || 'N/A'} &bull; Mobile: {mobilePrefix} {mobileNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCompanyDetailsModal(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer border border-indigo-100/30 transition-all self-end sm:self-auto"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Company Details</span>
          </button>
        </div>
      )}

      {/* STEP 1: COMPANY & CONTACT DETAILS */}
      {step === 1 && (
        <div className="space-y-6">
          {/* SEARCH REGISTRY BLOCK */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2">
              <Search className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Company Search Registry</h3>
            </div>
            <p className="text-[11px] text-zinc-400 leading-none">
              Search for contracted networks, insurance providers, or corporate partner companies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              <div className="md:col-span-3 space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Search By</label>
                <select 
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 font-bold"
                >
                  <option value="Client Name">Client Name</option>
                  <option value="Client Code">Client Code</option>
                  <option value="Contact Person">Contact Person</option>
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Search Term</label>
                <input 
                  type="text" 
                  placeholder={`Enter ${searchBy}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none dark:text-zinc-100 placeholder-zinc-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchCompany()}
                />
              </div>

              <div className="md:col-span-3 flex gap-2">
                <button 
                  type="button"
                  onClick={handleSearchCompany}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Search
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setSearchDone(false);
                  }}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {searchDone && (
              <div className="bg-zinc-50 dark:bg-zinc-950/20 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 block">Matches Found ({searchResults.length}):</span>
                {searchResults.length === 0 ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">No partner found. Proceeding with custom values.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {searchResults.map(c => (
                      <div key={c.clientCode} className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between text-xs hover:border-indigo-400 transition-all">
                        <div className="mb-2">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{c.clientName}</span>
                          <span className="text-[10px] text-zinc-400 font-medium block">Code: {c.clientCode} &bull; {c.clientType}</span>
                          <span className="text-[10px] text-zinc-500 block mt-1 font-sans">Contact: {c.contactPerson}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectExistingCompany(c)}
                          className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-lg font-bold text-[10px] cursor-pointer text-center"
                        >
                          Select & Edit Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-left space-y-6">
            {/* 1. COMPANY DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2 animate-fade-in">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Building2 className="h-4.5 w-4.5" /> 1. Company Details
                </h3>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Client Type *</label>
                  <select 
                    value={clientType} 
                    onChange={(e) => setClientType(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold dark:text-zinc-200"
                  >
                    <option value="Insurance">Insurance</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Hospital">Hospital</option>
                  </select>
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Client Name *</label>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => {
                      setClientName(e.target.value);
                      setShowClientDropdown(true);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                    placeholder="Enter Client Name"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100 font-semibold"
                  />
                  {showClientDropdown && clientName.trim() && (
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg divide-y divide-zinc-100 dark:divide-zinc-800 text-left">
                      {DEFAULT_COMPANIES.filter(c => c.clientName.toLowerCase().includes(clientName.toLowerCase())).map(c => (
                        <div 
                          key={c.clientCode}
                          onMouseDown={() => {
                            selectExistingCompany(c);
                            setShowClientDropdown(false);
                          }}
                          className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer text-xs flex flex-col items-start"
                        >
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.clientName}</span>
                          <span className="text-[10px] text-zinc-400">{c.clientType} &bull; {c.clientCode}</span>
                        </div>
                      ))}
                      {DEFAULT_COMPANIES.filter(c => c.clientName.toLowerCase().includes(clientName.toLowerCase())).length === 0 && (
                        <div className="p-3 text-center text-[10px] text-zinc-400">
                          No match found (uses typed custom client)
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">External Visit ID</label>
                  <input 
                    type="text" 
                    value={externalVisitId} 
                    onChange={(e) => setExternalVisitId(e.target.value)}
                    placeholder="Enter External Visit ID"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Client Code</label>
                  <input 
                    type="text" 
                    value={clientCode} 
                    onChange={(e) => setClientCode(e.target.value)}
                    placeholder="Auto generated"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Website</label>
                  <input 
                    type="text" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Enter Website URL"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Phone"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Fax Number</label>
                  <input 
                    type="text" 
                    value={fax} 
                    onChange={(e) => setFax(e.target.value)}
                    placeholder="Enter Fax"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
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
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    {LOCATIONS.map(l => <option key={l.country} value={l.country}>{l.country}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">State / Province</label>
                  <select 
                    value={state} 
                    onChange={(e) => {
                      const newState = e.target.value;
                      setState(newState);
                      const cities = getCitiesForState(country, newState);
                      if (cities.length > 0) setCity(cities[0]);
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    {getStatesForCountry(country).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">City</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    {getCitiesForState(country, state).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Client Category</label>
                  <select 
                    value={clientCategory} 
                    onChange={(e) => setClientCategory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Private Lab">Private Lab</option>
                    <option value="Hospital Contract">Hospital Contract</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">GST No.</label>
                  <input 
                    type="text" 
                    value={gstNo} 
                    onChange={(e) => setGstNo(e.target.value)}
                    placeholder="Enter GST Number"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Tax ID</label>
                  <input 
                    type="text" 
                    value={taxId} 
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="Enter Tax ID"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">VAT No.</label>
                  <input 
                    type="text" 
                    value={vatNo} 
                    onChange={(e) => setVatNo(e.target.value)}
                    placeholder="Enter VAT Number"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Terms</label>
                  <select 
                    value={terms} 
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="COD">COD</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Credit Limit</label>
                  <input 
                    type="text" 
                    value={creditLimit} 
                    onChange={(e) => setCreditLimit(e.target.value)}
                    placeholder="Enter Credit Limit"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Currency</label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    <option value="INR">INR</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Is Active</label>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsActive(!isActive)}
                      className={`h-5 w-10 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${isActive ? 'bg-[#3c3bb6] justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'}`}
                    >
                      <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                    </button>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{isActive ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CONTACT DETAILS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2">
                <Users className="h-4.5 w-4.5" /> 2. Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Contact Person *</label>
                  <input 
                    type="text" 
                    value={contactPerson} 
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Enter Contact Person"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Designation</label>
                  <input 
                    type="text" 
                    value={designation} 
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter Designation"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Mobile Number *</label>
                  <div className="flex gap-1.5">
                    <select 
                      value={mobilePrefix} 
                      onChange={(e) => setMobilePrefix(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none dark:text-zinc-200"
                    >
                      <option value="+971">+971</option>
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                    </select>
                    <input 
                      type="text" 
                      value={mobileNumber} 
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="50 123 4567"
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Email *</label>
                  <input 
                    type="email" 
                    value={emailContact} 
                    onChange={(e) => setEmailContact(e.target.value)}
                    placeholder="Enter Contact Email"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Address Line 1 *</label>
                  <input 
                    type="text" 
                    value={addressLine1} 
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Enter Address"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Address Line 2</label>
                  <input 
                    type="text" 
                    value={addressLine2} 
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Enter Address (line 2)"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Area / Locality *</label>
                  <input 
                    type="text" 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Enter Locality"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Pincode / ZIP *</label>
                  <input 
                    type="text" 
                    value={pincode} 
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Pincode"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">City *</label>
                  <select 
                    value={cityContact} 
                    onChange={(e) => setCityContact(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    {getCitiesForState(countryContact, stateContact).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">State *</label>
                  <select 
                    value={stateContact} 
                    onChange={(e) => {
                      const newState = e.target.value;
                      setStateContact(newState);
                      const cities = getCitiesForState(countryContact, newState);
                      if (cities.length > 0) setCityContact(cities[0]);
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    {getStatesForCountry(countryContact).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Country *</label>
                  <select 
                    value={countryContact} 
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setCountryContact(newCountry);
                      const states = getStatesForCountry(newCountry);
                      if (states.length > 0) {
                        setStateContact(states[0].name);
                        const cities = getCitiesForState(newCountry, states[0].name);
                        if (cities.length > 0) setCityContact(cities[0]);
                      }
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  >
                    {LOCATIONS.map(l => <option key={l.country} value={l.country}>{l.country}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Nationality *</label>
                  <select 
                    value={nationality} 
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
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

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-[#3c3bb6] hover:bg-opacity-90 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SERVICES & PRICING */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-left space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">Select Services / Tests</h3>
                <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Configure Lab Assays under contracted pricing</p>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomServiceModal(true)}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-xl text-[10px] font-extrabold flex items-center gap-1 cursor-pointer border border-indigo-100/30"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>Add Custom Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search by Service Name / Code / CPT Code..."
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 pl-10 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-100 placeholder-zinc-400"
                />
              </div>

              <div className="md:col-span-4">
                <select 
                  value={serviceCategory} 
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200 font-bold"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Immunology">Immunology</option>
                  <option value="Urinalysis">Urinalysis</option>
                </select>
              </div>
            </div>

            {/* Live Search List */}
            {searchService.trim() && (
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl max-h-48 overflow-y-auto space-y-1.5">
                <span className="text-[9px] uppercase font-black tracking-wider text-zinc-400 block">Available Master Matches:</span>
                {testMasters.filter(tm => tm.active).map(tm => {
                  const term = searchService.toLowerCase();
                  const matchesTerm = tm.testName.toLowerCase().includes(term) || tm.id.toLowerCase().includes(term) || tm.department.toLowerCase().includes(term);
                  const matchesCat = serviceCategory === 'All Categories' || tm.department === serviceCategory;
                  if (!matchesTerm || !matchesCat) return null;
                  const service = {
                    code: tm.id,
                    cptCode: tm.id.replace('TEST-', 'CPT-'),
                    name: tm.testName,
                    category: tm.department,
                    unitPrice: tm.rate,
                    sampleType: tm.sampleType,
                    units: tm.units,
                    referenceRange: tm.referenceRange,
                    testMasterId: tm.id
                  };
                  return (
                    <div key={service.code} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/85 rounded-lg flex items-center justify-between text-xs font-semibold">
                      <div>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-100">{service.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 font-mono">Code: {service.code} &bull; Dept: {service.category} &bull; ₹{service.unitPrice.toFixed(2)}</span>
                        {service.sampleType && <span className="text-[10px] text-zinc-400 ml-2">Sample: {service.sampleType}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedServices.some(item => item.code === service.code)) return;
                          setSelectedServices(prev => [...prev, { ...service, quantity: 1 }]);
                          setSearchService('');
                        }}
                        className="px-2.5 py-1 bg-[#3c3bb6] text-white text-[10px] font-black rounded-lg hover:bg-opacity-90"
                      >
                        + Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SELECTED SERVICES TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5">S.No</th>
                    <th className="py-2.5">Code</th>
                    <th className="py-2.5">CPT Code</th>
                    <th className="py-2.5">Service Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-center">Quantity</th>
                    <th className="py-2.5 text-right">Unit Price (INR)</th>
                    <th className="py-2.5 text-right">Gross Amount (INR)</th>
                    <th className="py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {selectedServices.map((item, idx) => (
                    <tr key={item.code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="py-3 text-zinc-400 font-mono">{idx + 1}</td>
                      <td className="py-3 text-zinc-900 dark:text-zinc-100 font-bold font-mono">{item.code}</td>
                      <td className="py-3 text-zinc-500 font-mono">{item.cptCode}</td>
                      <td className="py-3 font-extrabold text-zinc-900 dark:text-zinc-100">{item.name}</td>
                      <td className="py-3 text-zinc-500">{item.category}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedServices(prev => prev.map(s => s.code === item.code ? { ...s, quantity: Math.max(1, s.quantity - 1) } : s));
                            }}
                            className="h-6 w-6 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-xs font-black"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold dark:text-zinc-200">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedServices(prev => prev.map(s => s.code === item.code ? { ...s, quantity: s.quantity + 1 } : s));
                            }}
                            className="h-6 w-6 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-xs font-black"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-600 dark:text-zinc-400">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-200">{(item.quantity * item.unitPrice).toFixed(2)}</td>
                      <td className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedServices(prev => prev.filter(s => s.code !== item.code))}
                          className="p-1 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Type</label>
                <select 
                  value={discountType} 
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none font-bold"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Flat">Flat Discount</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount (%)</label>
                <input 
                  type="text" 
                  value={discountPercent} 
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold font-mono text-zinc-700 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Is Authorization Required</label>
                <select 
                  value={isAuthRequired} 
                  onChange={(e) => setIsAuthRequired(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none font-bold"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">STAT</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <button 
                    type="button" 
                    onClick={() => setIsSTAT(!isSTAT)}
                    className={`h-5 w-10 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${isSTAT ? 'bg-rose-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'}`}
                  >
                    <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{isSTAT ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Is Non Standard</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <button 
                    type="button" 
                    onClick={() => setIsNonStandard(!isNonStandard)}
                    className={`h-5 w-10 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${isNonStandard ? 'bg-orange-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'}`}
                  >
                    <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{isNonStandard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* BILLING SUMMARY TILES */}
            <div className="grid grid-cols-2 md:grid-cols-9 gap-2 items-center text-center font-mono">
              <div className="bg-zinc-50 dark:bg-zinc-950/25 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="block text-[8px] uppercase font-bold text-zinc-400">Gross Amount</span>
                <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">₹{grossAmount.toFixed(2)}</span>
              </div>
              <div className="text-zinc-400 font-extrabold">-</div>
              <div className="bg-zinc-50 dark:bg-zinc-950/25 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="block text-[8px] uppercase font-bold text-zinc-400">Discount ({discountPercent}%)</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">-₹{discountValue.toFixed(2)}</span>
              </div>
              <div className="text-zinc-400 font-extrabold">=</div>
              <div className="bg-zinc-50 dark:bg-zinc-950/25 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="block text-[8px] uppercase font-bold text-zinc-400">Insured Amount</span>
                <span className="text-xs font-extrabold text-zinc-500 mt-1 block">₹0.00</span>
              </div>
              <div className="text-zinc-400 font-extrabold">=</div>
              <div className="bg-zinc-50 dark:bg-zinc-950/25 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="block text-[8px] uppercase font-bold text-zinc-400">Patient Payable</span>
                <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">₹{netAmount.toFixed(2)}</span>
              </div>
              <div className="text-zinc-400 font-extrabold">=</div>
              <div className="bg-[#3c3bb6]/5 p-3 rounded-2xl border border-[#3c3bb6]/20 col-span-2 md:col-span-1">
                <span className="block text-[8px] uppercase font-bold text-indigo-400">Net Amount</span>
                <span className="text-xs font-extrabold text-[#3c3bb6] dark:text-indigo-400 mt-1 block">₹{netAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-500 font-bold text-xs rounded-xl"
              >
                Save Draft
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-[#3c3bb6] hover:bg-opacity-90 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: BILLING & PAYMENT */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              {/* 1. PAYMENT METHOD */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">1. Payment Method</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Cash', 'Card', 'Cheque', 'Online'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-3.5 px-4 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMode === mode 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-400'
                          : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span>{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. PAYMENT DETAILS */}
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">2. Payment Details</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Cash Tendered (INR) *</label>
                    <input 
                      type="text" 
                      value={cashTendered} 
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Cash Collected (INR) *</label>
                    <input 
                      type="text" 
                      value={cashCollected} 
                      onChange={(e) => setCashCollected(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>

                  <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-center">
                    <span className="block text-[8px] uppercase font-bold text-emerald-600 dark:text-emerald-400 font-mono">Change (INR)</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">₹{cashChange.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Transaction Date & Time *</label>
                    <input 
                      type="text" 
                      value={transactionDttm} 
                      onChange={(e) => setTransactionDttm(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-semibold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Receipt No.</label>
                    <input 
                      type="text" 
                      value={receiptNo} 
                      readOnly
                      className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none text-zinc-400 font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Collected By *</label>
                    <select 
                      value={collectedBy} 
                      onChange={(e) => setCollectedBy(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold dark:text-zinc-200"
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins</option>
                      <option value="Marcus Vance">Marcus Vance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. DISCOUNT DETAILS */}
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">3. Discount (If Applicable)</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Type</label>
                    <select 
                      value={discountType} 
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold"
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Flat">Flat</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Approved By</label>
                    <input 
                      type="text" 
                      value={discountApprovedBy} 
                      onChange={(e) => setDiscountApprovedBy(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount ({discountType === 'Percentage' ? '%' : 'INR'})</label>
                    <input 
                      type="text" 
                      value={discountPercent} 
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Amount (INR)</label>
                    <input 
                      type="text" 
                      value={discountValue.toFixed(2)} 
                      readOnly
                      className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none text-zinc-400 font-black font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Remarks</label>
                  <textarea 
                    value={discountRemarks} 
                    onChange={(e) => setDiscountRemarks(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                    placeholder="Enter special remarks..."
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* BILLING SUMMARY PANEL */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#3c3bb6] dark:text-indigo-400">Billing Summary (INR)</h4>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-850 text-xs font-semibold text-zinc-600 dark:text-zinc-400 space-y-3">
                  <div className="flex justify-between pb-3">
                    <span>Gross Amount:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-rose-500">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono font-bold">-₹{discountValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span>Rounding:</span>
                    <span className="font-mono font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-zinc-100 dark:border-zinc-850 font-black text-sm text-zinc-950 dark:text-zinc-50">
                    <span>Net Amount:</span>
                    <span className="font-mono text-indigo-700 dark:text-indigo-400">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span>Insured Amount:</span>
                    <span className="font-mono font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-3 font-extrabold text-zinc-900 dark:text-zinc-200">
                    <span>Patient Payable:</span>
                    <span className="font-mono">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-emerald-600 dark:text-emerald-400">
                    <span>Collected Amount:</span>
                    <span className="font-mono font-bold">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 font-black text-xs text-zinc-950 dark:text-zinc-100">
                    <span>Due Amount:</span>
                    <span className="font-mono">₹0.00</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-150 dark:border-zinc-850 flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Mode: {paymentMode}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* IMPORTANT BOX */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-850 rounded-2xl text-left">
                <span className="text-[10px] uppercase font-black text-zinc-400 flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Important</span>
                <p className="text-[10px] text-zinc-400 mt-2 font-medium leading-relaxed">Please review the billing details before saving. You can go back to previous steps to make changes.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-500 font-bold text-xs rounded-xl"
              >
                Save Draft
              </button>
              <button 
                type="button" 
                onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-[#3c3bb6] hover:bg-opacity-90 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUMMARY (REVIEW & CONFIRM) */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100/30 rounded-2xl text-left flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold">Please review all the details below before final submission. You can go back to any step to make changes.</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              {/* 1. COMPANY DETAILS CARD */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Building2 className="h-4 w-4" /> 1. Company Details</h4>
                  <button onClick={() => setStep(1)} className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold">Edit</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Client Type</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{clientType}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Client Name</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{clientName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">External Visit ID</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">{externalVisitId}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Client Code</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">{clientCode}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Email</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{email}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Website</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{website}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Phone</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">{phone}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Fax</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">{fax}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Country</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{country}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">State</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{state}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">City</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{city}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Client Category</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{clientCategory}</span>
                  </div>
                </div>
              </div>

              {/* 2. CONTACT DETAILS CARD */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Users className="h-4 w-4" /> 2. Contact Details</h4>
                  <button onClick={() => setStep(1)} className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold">Edit</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Contact Person</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{contactPerson}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Designation</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{designation}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Mobile Number</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">{mobilePrefix} {mobileNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Email</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{emailContact}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[9px] text-zinc-400 uppercase">Address Line 1</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{addressLine1}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[9px] text-zinc-400 uppercase">Address Line 2</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{addressLine2 || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Area / Locality</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{area}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 uppercase">Pincode / ZIP</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">{pincode}</span>
                  </div>
                </div>
              </div>

              {/* 3. SELECTED SERVICES CARD */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><ClipboardList className="h-4 w-4" /> 3. Selected Services / Tests</h4>
                  <button onClick={() => setStep(2)} className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold">Edit</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-2">Code</th>
                        <th className="py-2">Service Name</th>
                        <th className="py-2">Category</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Unit Price</th>
                        <th className="py-2 text-right">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                      {selectedServices.map(s => (
                        <tr key={s.code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                          <td className="py-2 text-zinc-900 dark:text-zinc-100 font-mono font-bold">{s.code}</td>
                          <td className="py-2 font-extrabold text-zinc-900 dark:text-zinc-100">{s.name}</td>
                          <td className="py-2 text-zinc-500">{s.category}</td>
                          <td className="py-2 text-center font-mono">{s.quantity}</td>
                          <td className="py-2 text-right font-mono text-zinc-500">₹{s.unitPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-mono font-bold text-zinc-900 dark:text-zinc-200">₹{(s.quantity * s.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/30 rounded-xl flex flex-wrap gap-4 text-[10px] font-bold text-zinc-500 font-mono justify-between">
                  <span>Total Quantity: {selectedServices.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  <span>Gross Amount: ₹{grossAmount.toFixed(2)}</span>
                  <span>Discount: ₹{discountValue.toFixed(2)}</span>
                  <span className="text-[#3c3bb6]">Net Amount: ₹{netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* 4. BILLING SUMMARY */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#3c3bb6] dark:text-indigo-400">4. Billing Summary (INR)</h4>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-850 text-xs font-semibold text-zinc-600 dark:text-zinc-400 space-y-3">
                  <div className="flex justify-between pb-3">
                    <span>Gross Amount:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-rose-500">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono font-bold">-₹{discountValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span>Rounding:</span>
                    <span className="font-mono font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-3 font-black text-sm text-[#3c3bb6] dark:text-indigo-400">
                    <span>Net Amount:</span>
                    <span className="font-mono">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span>Patient Payable:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-emerald-600 dark:text-emerald-400">
                    <span>Collected Amount:</span>
                    <span className="font-mono font-bold">₹{netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 font-black text-zinc-950 dark:text-zinc-100">
                    <span>Due Amount:</span>
                    <span className="font-mono">₹0.00</span>
                  </div>
                </div>
              </div>

              {/* 5. PAYMENT DETAILS CARD */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">5. Payment Details</h4>
                  <button onClick={() => setStep(3)} className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold">Edit</button>
                </div>
                <div className="space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Payment Type:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-black">{paymentMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Tendered:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">₹{cashTendered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Collected:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold font-mono">₹{cashCollected}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Change:</span>
                    <span className="font-mono font-bold">₹{cashChange.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono">{transactionDttm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">{receiptNo}</span>
                  </div>
                </div>
              </div>

              {/* IMPORTANT BOX */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-850 rounded-2xl text-left text-[10px] space-y-2">
                <span className="uppercase font-black text-zinc-400 flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Important Notes</span>
                <ul className="list-disc list-inside text-zinc-450 space-y-1 font-medium">
                  <li>Please review all details carefully before final submission.</li>
                  <li>Once submitted, a client registration and invoice will be created.</li>
                  <li>You can print the invoice after submission.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={handlePrintSummary}
                className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Printer className="h-4 w-4" />
                <span>Print Summary</span>
              </button>
              <button 
                type="button" 
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/10 transition-all"
              >
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DIALOGS --- */}
      {/* 1. COMPANY DETAILS OVERLAY MODAL */}
      {showCompanyDetailsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="h-5 w-5" /> Detailed Company Profile</h3>
              <button onClick={() => setShowCompanyDetailsModal(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <div><span className="block text-[9px] text-zinc-400">Client Type</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{clientType}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Client Name</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{clientName}</span></div>
              <div><span className="block text-[9px] text-zinc-400">External Visit ID</span><span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">{externalVisitId}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Client Code</span><span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">{clientCode}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Contact Person</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{contactPerson}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Designation</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{designation}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Mobile Number</span><span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">{mobilePrefix} {mobileNumber}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Email</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{emailContact}</span></div>
              <div className="col-span-2"><span className="block text-[9px] text-zinc-400">Registered Office Address</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{addressLine1}, {addressLine2 || ''}, {area}, {pincode}, {cityContact}, {stateContact}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Terms</span><span className="font-bold text-zinc-900 dark:text-zinc-100">{terms}</span></div>
              <div><span className="block text-[9px] text-zinc-400">Credit Limit</span><span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">{currency} {creditLimit}</span></div>
            </div>
            <div className="border-t pt-3 flex justify-end">
              <button onClick={() => setShowCompanyDetailsModal(false)} className="px-4 py-2 bg-[#3c3bb6] text-white font-extrabold text-xs rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOM SERVICE ADDITION MODAL */}
      {showCustomServiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add Custom Assay</h3>
              <button onClick={() => setShowCustomServiceModal(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Service/Assay Name</label>
                <input 
                  type="text" 
                  value={customServiceName} 
                  onChange={(e) => setCustomServiceName(e.target.value)}
                  placeholder="e.g. PCR COVID-19 Rapid"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Unit Price (INR)</label>
                <input 
                  type="text" 
                  value={customServicePrice} 
                  onChange={(e) => setCustomServicePrice(e.target.value)}
                  placeholder="50.00"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                <select 
                  value={customServiceCat} 
                  onChange={(e) => setCustomServiceCat(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 rounded-xl outline-none dark:text-zinc-200"
                >
                  <option value="Custom">Custom</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Immunology">Immunology</option>
                  <option value="Urinalysis">Urinalysis</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCustomServiceModal(false)} className="px-3.5 py-1.5 bg-zinc-100 text-zinc-600 font-bold text-[11px] rounded-lg">Cancel</button>
              <button onClick={handleAddCustomService} className="px-4 py-1.5 bg-[#3c3bb6] text-white font-extrabold text-[11px] rounded-lg">Add Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
