import React, { useState } from 'react';
import { 
  X, MessageSquare, Printer, Edit, Edit2, Trash2, Check, FileText, 
  Send, User, Phone, MapPin, Calendar, CheckCircle2, FileDown
} from 'lucide-react';
import { Patient } from '../types/lims_app';

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdatePatient: (updated: Patient) => void;
}

export function PatientDetailsModal({
  patient,
  onClose,
  onUpdatePatient
}: PatientDetailsModalProps) {
  // Messaging popups
  const [activeMessagePopup, setActiveMessagePopup] = useState<'visit' | 'remarks' | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedServiceIdForRemarks, setSelectedServiceIdForRemarks] = useState<string | null>(null);

  // Editing state for Bill Details
  const [isEditingBill, setIsEditingBill] = useState(false);
  const [billGross, setBillGross] = useState(patient.billDetails?.gross || 0);
  const [billDiscount, setBillDiscount] = useState(patient.billDetails?.discount || 0);
  const [billVat, setBillVat] = useState(patient.billDetails?.vat || 0);
  const [billCollected, setBillCollected] = useState(patient.billDetails?.collected || 0);
  const [billDue, setBillDue] = useState(patient.billDetails?.due || 0);
  const [billDoctor, setBillDoctor] = useState(patient.billDetails?.doctorName || 'Dr. John Doe');

  // Editing state for Services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceSample, setEditServiceSample] = useState('');
  const [editServiceDept, setEditServiceDept] = useState('');
  const [editServiceStatus, setEditServiceStatus] = useState('');
  const [editServiceBarcode, setEditServiceBarcode] = useState('');

  // Local state for quantity dropdowns
  const [barcodeQty, setBarcodeQty] = useState<Record<string, number>>({});

  // Simulated printing modals
  const [printBillOpen, setPrintBillOpen] = useState(false);
  const [printServiceOpen, setPrintServiceOpen] = useState<any | null>(null);

  // Toast log helper
  const [localToast, setLocalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  const openPrintableWindow = (title: string, html: string) => {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      triggerToast('Please allow pop-ups to print this document.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:28px;color:#18181b;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #e4e4e7;padding:8px 10px;text-align:left;font-size:12px;}th{background:#f4f4f5;text-transform:uppercase;letter-spacing:.05em;font-size:10px;}h1{margin:0 0 8px;font-size:24px;color:#3c3bb6;}small{color:#71717a;} .header{border-bottom:3px solid #3c3bb6;padding-bottom:12px;margin-bottom:18px;} .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;font-size:12px;margin-bottom:16px;} .totals{margin-top:20px;width:260px;margin-left:auto;font-size:12px;} .totals div{display:flex;justify-content:space-between;padding:4px 0;} .grand{font-size:16px;font-weight:700;color:#3c3bb6;border-top:1px solid #d4d4d8;padding-top:8px;} .box{background:#fafafa;border:1px solid #e4e4e7;padding:12px;border-radius:8px;margin:10px 0;}</style></head><body>${html}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleSaveBill = () => {
    if (!patient.billDetails) return;
    const net = billGross - billDiscount + billVat;
    const updatedPatient: Patient = {
      ...patient,
      billDetails: {
        ...patient.billDetails,
        gross: billGross,
        discount: billDiscount,
        vat: billVat,
        net: net,
        collected: billCollected,
        due: Math.max(0, net - billCollected),
        netPayable: net,
        doctorName: billDoctor,
        billStatus: 'Bill Edited'
      }
    };
    onUpdatePatient(updatedPatient);
    setIsEditingBill(false);
    triggerToast('Patient Bill details updated successfully!');
  };

  const handleSaveService = (serviceId: string) => {
    if (!patient.servicesList) return;
    const updatedServices = patient.servicesList.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          serviceName: editServiceName,
          sample: editServiceSample,
          department: editServiceDept,
          status: editServiceStatus,
          barcodeNo: editServiceBarcode
        };
      }
      return s;
    });

    const updatedPatient: Patient = {
      ...patient,
      servicesList: updatedServices
    };
    onUpdatePatient(updatedPatient);
    setEditingServiceId(null);
    triggerToast('Clinical service details successfully updated across systems!');
  };

  const handleDeleteService = (serviceId: string, name: string) => {
    if (!patient.servicesList) return;
    if (window.confirm(`Are you sure you want to delete the service "${name}" from this patient record?`)) {
      const updatedServices = patient.servicesList.filter(s => s.id !== serviceId);
      const updatedPatient: Patient = {
        ...patient,
        servicesList: updatedServices
      };
      onUpdatePatient(updatedPatient);
      triggerToast('Service removed from active panel list.');
    }
  };

  const handleBarcodeReprint = (serviceId: string, name: string) => {
    const qty = barcodeQty[serviceId] || 1;
    const service = services.find(item => item.id === serviceId);

    const printWindow = window.open('', '_blank', 'width=520,height=420');
    if (!printWindow) {
      triggerToast('Please allow pop-ups to reprint the barcode label.');
      return;
    }

    const content = `
      <div class="header">
        <h1>Cybe LabConnect</h1>
        <small>Specimen Label Reprint</small>
      </div>
      <div class="box">
        <div><strong>Patient:</strong> ${patient.name}</div>
        <div><strong>Service:</strong> ${service?.serviceName || name}</div>
        <div><strong>Barcode:</strong> ${service?.barcodeNo || 'N/A'}</div>
        <div><strong>Copies:</strong> ${qty}</div>
      </div>
      <div style="font-size:18px; font-weight:700; letter-spacing:2px; text-align:center; margin-top:18px;">${service?.barcodeNo || 'BARCODE'}</div>
    `;

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Barcode Label - ${name}</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:20px;color:#111827;} .header{border-bottom:2px solid #111827;padding-bottom:8px;margin-bottom:12px;} h1{margin:0;font-size:20px;} small{color:#6b7280;} .box{border:1px solid #111827;padding:10px;font-size:12px;line-height:1.7;} .code{font-size:18px;font-weight:700;letter-spacing:2px;text-align:center;margin-top:18px;}</style></head><body>${content}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);

    triggerToast(`Success: Barcode label regenerated with quantity ${qty} for "${name}".`);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    triggerToast(`Message successfully queued for dispatch via SMS: "${messageText}"`);
    setActiveMessagePopup(null);
    setMessageText('');
  };

  const bill = patient.billDetails || {
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
    billStatus: 'Partially Cancelled' as const
  };

  const services = patient.servicesList || [
    {
      id: 's1',
      serviceName: 'Fasting G.U.J',
      sample: 'Serum',
      department: 'Biochemistry',
      status: 'Registered',
      barcodeNo: 'Yet to be processed',
      remarks: ''
    }
  ];

  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-t-[32px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-100">Patient Details</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal content area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Box 1: Patient Header Info card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="h-16 w-16 rounded-full border-2 border-indigo-100 dark:border-zinc-800 overflow-hidden shadow-sm shrink-0">
                  {patient.photoUrl ? (
                    <img 
                      src={patient.photoUrl} 
                      alt={patient.name} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full w-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 font-black">
                      {patient.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{patient.name}</h2>
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-[10px] font-black text-[#3c3bb6] dark:text-indigo-400 rounded-lg border border-indigo-100/50 dark:border-zinc-800 font-mono">
                      {patient.patientId || `BML01${800 + parseInt(patient.id || '10')}`}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 sm:flex sm:flex-row items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 font-medium">
                    <div>
                      <span className="text-zinc-400 font-bold">Age / Sex: </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-bold">{patient.ageUnitStr || `${patient.age} Y / ${patient.gender}`}</span>
                    </div>
                    <div className="hidden sm:block text-zinc-300">&bull;</div>
                    <div>
                      <span className="text-zinc-400 font-bold">Mobile: </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold">{patient.contactNo}</span>
                    </div>
                    <div className="hidden sm:block text-zinc-300">&bull;</div>
                    <div>
                      <span className="text-zinc-400 font-bold">UHID: </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold">{patient.uhid || 'UHID123456'}</span>
                    </div>
                    <div className="hidden sm:block text-zinc-300">&bull;</div>
                    <div>
                      <span className="text-zinc-400 font-bold">MRN: </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold">{patient.mrn || 'MRN123456'}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-400 font-semibold">
                    Registration Date: {patient.registrationDate || '05 May 2025, 11:08 AM'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Patient Bill Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-zinc-100 dark:border-zinc-850 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5" /> Patient Bill Details
              </h3>
              
              {/* Screenshot status pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                  Partially Cancelled
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                  Cancelled
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400 border border-pink-100 dark:border-pink-900/30 animate-pulse">
                  Bill Edited
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                  File Uploaded
                </span>
              </div>
            </div>

            {/* Bill Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950/40 text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-150 dark:border-zinc-800">
                    <th className="px-3 py-2 text-center">S.No</th>
                    <th className="px-3 py-2">Visit ID</th>
                    <th className="px-3 py-2">Visit Date / Time</th>
                    <th className="px-3 py-2 text-right">Gross</th>
                    <th className="px-3 py-2 text-right">Discount</th>
                    <th className="px-3 py-2 text-right">VAT</th>
                    <th className="px-3 py-2 text-right">Net</th>
                    <th className="px-3 py-2 text-right">Round Off</th>
                    <th className="px-3 py-2 text-right">Collected</th>
                    <th className="px-3 py-2 text-right text-rose-500">Due</th>
                    <th className="px-3 py-2 text-right">Refunded</th>
                    <th className="px-3 py-2 text-right">Cancelled Val</th>
                    <th className="px-3 py-2 text-right">Net Payable</th>
                    <th className="px-3 py-2">Doctor Name</th>
                    <th className="px-3 py-2 text-center">Edit</th>
                    <th className="px-3 py-2 text-center">Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                    <td className="px-3 py-3 text-center font-mono text-zinc-400">1</td>
                    <td className="px-3 py-3 font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-indigo-600 dark:text-indigo-400 underline">{bill.visitId}</span>
                        <button 
                          onClick={() => {
                            setActiveMessagePopup('visit');
                            setMessageText(`Dear ${patient.name}, your visit invoice ${bill.visitId} has been updated. Net: ₹${bill.net}. Please contact Cybe: LabConnect desk for queries.`);
                          }}
                          className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded cursor-pointer"
                          title="Send message to patient"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-zinc-500">{bill.visitDate}</td>
                    <td className="px-3 py-3 text-right font-mono">₹{bill.gross.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-amber-600">₹{bill.discount.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono">₹{bill.vat.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono font-extrabold text-zinc-900 dark:text-zinc-100">₹{bill.net.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-zinc-400">₹{bill.roundOff.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-600">₹{bill.collected.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-rose-500 font-extrabold">₹{bill.due.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-indigo-500">₹{bill.refundedAmount.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-zinc-400">₹{bill.cancelledValue.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">₹{bill.netPayable.toFixed(2)}</td>
                    <td className="px-3 py-3 text-zinc-500 truncate max-w-[100px]" title={bill.doctorName}>{bill.doctorName}</td>
                    <td className="px-3 py-3 text-center">
                      <button 
                        onClick={() => setIsEditingBill(!isEditingBill)}
                        className={`p-1 rounded cursor-pointer ${isEditingBill ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-100 text-zinc-500 dark:hover:bg-zinc-800'}`}
                        title="Edit Bill"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button 
                        onClick={() => setPrintBillOpen(true)}
                        className="p-1 hover:bg-zinc-100 text-zinc-500 dark:hover:bg-zinc-800 rounded cursor-pointer"
                        title="Print Invoice Bill"
                      >
                        <Printer className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Inline Bill Editing Panel */}
            {isEditingBill && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-indigo-100 dark:border-zinc-800 rounded-2xl space-y-3 animate-fade-in text-left">
                <span className="text-[10px] uppercase font-black text-indigo-600 tracking-wider block">
                  Quick Bill Editor
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-zinc-400 font-bold mb-1 uppercase">Gross Amount</label>
                    <input 
                      type="number"
                      value={billGross}
                      onChange={(e) => setBillGross(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 font-bold mb-1 uppercase">Discount</label>
                    <input 
                      type="number"
                      value={billDiscount}
                      onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none font-semibold font-mono text-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 font-bold mb-1 uppercase">VAT</label>
                    <input 
                      type="number"
                      value={billVat}
                      onChange={(e) => setBillVat(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 font-bold mb-1 uppercase">Collected</label>
                    <input 
                      type="number"
                      value={billCollected}
                      onChange={(e) => setBillCollected(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none font-semibold font-mono text-emerald-600"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-zinc-400 font-bold mb-1 uppercase">Referring Doctor</label>
                    <input 
                      type="text"
                      value={billDoctor}
                      onChange={(e) => setBillDoctor(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div className="col-span-2 flex items-end justify-end gap-2">
                    <button 
                      onClick={() => setIsEditingBill(false)}
                      className="px-3.5 py-2 rounded-xl text-zinc-500 hover:bg-zinc-200 font-bold text-[10px] uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveBill}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" /> Save Bill Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Box 3: Patient Services List */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-3">
              <CheckCircle2 className="h-4.5 w-4.5" /> Patient Service List
            </h3>

            {/* Service Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950/40 text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-150 dark:border-zinc-800">
                    <th className="px-3 py-2 text-center">S.No</th>
                    <th className="px-3 py-2">Service</th>
                    <th className="px-3 py-2">Sample</th>
                    <th className="px-3 py-2">Department</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Barcode No</th>
                    <th className="px-3 py-2 text-right">Rate</th>
                    <th className="px-3 py-2 text-center">Barcode Re-Print</th>
                    <th className="px-3 py-2 text-center">Remarks</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {services.map((s, index) => {
                    const isEditing = editingServiceId === s.id;
                    const count = barcodeQty[s.id] || 1;

                    return (
                      <React.Fragment key={s.id}>
                        <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                          <td className="px-3 py-3.5 text-center font-mono text-zinc-400 font-bold">{index + 1}</td>
                          <td className="px-3 py-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                            {isEditing ? (
                              <input 
                                type="text"
                                value={editServiceName}
                                onChange={(e) => setEditServiceName(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 rounded font-bold text-xs"
                              />
                            ) : (
                              s.serviceName
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-zinc-500">
                            {isEditing ? (
                              <input 
                                type="text"
                                value={editServiceSample}
                                onChange={(e) => setEditServiceSample(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 rounded text-xs"
                              />
                            ) : (
                              s.sample
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-zinc-500">
                            {isEditing ? (
                              <input 
                                type="text"
                                value={editServiceDept}
                                onChange={(e) => setEditServiceDept(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 rounded text-xs"
                              />
                            ) : (
                              s.department
                            )}
                          </td>
                          <td className="px-3 py-3.5">
                            {isEditing ? (
                              <select 
                                value={editServiceStatus}
                                onChange={(e) => setEditServiceStatus(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 rounded text-xs"
                              >
                                <option value="Registered">Registered</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                s.status === 'Completed' 
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                              }`}>
                                {s.status}
                              </span>
                            )}
                          </td>
                           <td className="px-3 py-3.5 font-mono text-xs">
                             {isEditing ? (
                               <input 
                                 type="text"
                                 value={editServiceBarcode}
                                 onChange={(e) => setEditServiceBarcode(e.target.value)}
                                 className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 rounded font-mono text-xs"
                               />
                             ) : (
                               s.barcodeNo
                             )}
                           </td>
                           <td className="px-3 py-3.5 text-right font-mono text-xs">
                             {s.rate != null ? `₹${s.rate.toFixed(2)}` : '-'}
                           </td>
                          <td className="px-3 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <select
                                value={count}
                                onChange={(e) => setBarcodeQty(prev => ({ ...prev, [s.id]: parseInt(e.target.value) || 1 }))}
                                className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold px-1.5 py-1 rounded outline-none border-none"
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </select>
                              <button 
                                onClick={() => handleBarcodeReprint(s.id, s.serviceName)}
                                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-indigo-600 dark:text-indigo-400 rounded cursor-pointer"
                                title="Re-print Barcode Label"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {s.remarks && <span className="text-[10px] text-zinc-400 italic max-w-[80px] truncate" title={s.remarks}>{s.remarks}</span>}
                              <button 
                                onClick={() => {
                                  setSelectedServiceIdForRemarks(s.id);
                                  setActiveMessagePopup('remarks');
                                  setMessageText(`Dear ${patient.name}, update regarding your "${s.serviceName}" service: status is currently "${s.status}".`);
                                }}
                                className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded cursor-pointer"
                                title="Open Remarks SMS Composer"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            {isEditing ? (
                              <div className="flex justify-center gap-1">
                                <button 
                                  onClick={() => handleSaveService(s.id)}
                                  className="p-1 bg-emerald-500 text-white rounded cursor-pointer hover:bg-emerald-600"
                                  title="Save changes"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button 
                                  onClick={() => setEditingServiceId(null)}
                                  className="p-1 bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded cursor-pointer hover:bg-zinc-300"
                                  title="Cancel"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setPrintServiceOpen(s);
                                  }}
                                  className="p-1 hover:bg-zinc-100 text-zinc-500 dark:hover:bg-zinc-800 rounded cursor-pointer"
                                  title="Print Service"
                                >
                                  <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingServiceId(s.id);
                                    setEditServiceName(s.serviceName);
                                    setEditServiceSample(s.sample);
                                    setEditServiceDept(s.department);
                                    setEditServiceStatus(s.status);
                                    setEditServiceBarcode(s.barcodeNo);
                                  }}
                                  className="p-1 hover:bg-indigo-50 dark:hover:bg-zinc-800 text-indigo-500 rounded cursor-pointer"
                                  title="Edit Service"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteService(s.id, s.serviceName)}
                                  className="p-1 hover:bg-rose-50 dark:hover:bg-zinc-850 text-rose-500 rounded cursor-pointer"
                                  title="Delete Service"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-b-[32px] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button 
            onClick={() => {
              triggerToast(`Opening complete clinical profile dashboard for ${patient.name} [UHID: ${patient.uhid || 'UHID123456'}]`);
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#3c3bb6] hover:bg-[#32319c] text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-indigo-600/10"
          >
            View Patient Profile
          </button>
        </div>

        {/* --- DYNAMIC OVERLAY: Messaging Popup Composer --- */}
        {activeMessagePopup && (
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-xs rounded-[32px] z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl text-left">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" /> SMS SMS Message Composer
                </span>
                <button 
                  onClick={() => setActiveMessagePopup(null)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">To Patient: {patient.name}</label>
                <textarea 
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-xs rounded-xl outline-none font-medium resize-none focus:border-indigo-500"
                  placeholder="Type your message text here..."
                />
              </div>
              <div className="flex items-center justify-end gap-2.5 text-xs font-bold pt-1">
                <button 
                  onClick={() => setActiveMessagePopup(null)}
                  className="text-zinc-500 hover:bg-zinc-50 p-2 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- DYNAMIC OVERLAY: Print Invoice Box --- */}
        {printBillOpen && (
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-xs rounded-[32px] z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-left font-mono text-[11px] text-zinc-800 dark:text-zinc-200 max-h-[85%] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-2 text-sans">
                <span className="text-[10px] font-black font-sans text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                  <Printer className="h-4 w-4" /> Simulated Invoice Receipt
                </span>
                <button onClick={() => setPrintBillOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2 border-b border-dashed pb-3">
                <div className="text-center font-bold text-sm font-sans text-zinc-950 dark:text-white uppercase leading-none">CYBE: LABCONNECT LIMS</div>
                <div className="text-center text-[10px] text-zinc-400 font-sans">Sector A-1, Pathology Hub Lab, Dubai UAE</div>
                <div className="mt-3 grid grid-cols-2 gap-y-1">
                  <div>Date: {bill.visitDate}</div>
                  <div className="text-right">Receipt: #{bill.visitId}</div>
                  <div>MRN: {patient.mrn || 'MRN123456'}</div>
                  <div className="text-right">UHID: {patient.uhid || 'UHID123456'}</div>
                  <div className="col-span-2">Patient Name: {patient.name}</div>
                  <div className="col-span-2">Referred By: {bill.doctorName}</div>
                </div>
              </div>

              <div className="border-b border-dashed pb-3 space-y-1.5">
                <div className="grid grid-cols-12 font-bold text-[10px]">
                  <div className="col-span-8">Particulars</div>
                  <div className="col-span-4 text-right">Amount</div>
                </div>
                {services.map(s => (
                  <div key={s.id} className="grid grid-cols-12 text-zinc-500">
                    <div className="col-span-8">{s.serviceName}</div>
                    <div className="col-span-4 text-right">₹{bill.gross.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right">
                <div>Gross Total:  ₹{bill.gross.toFixed(2)}</div>
                <div className="text-amber-600">Discount:     -₹{bill.discount.toFixed(2)}</div>
                <div>VAT:          +₹{bill.vat.toFixed(2)}</div>
                <div className="font-extrabold text-[12px] text-indigo-600 dark:text-indigo-400 border-t border-dashed pt-1.5 mt-1">Net Payable:   ₹{bill.netPayable.toFixed(2)}</div>
                <div className="text-emerald-600 font-bold">Collected:     ₹{bill.collected.toFixed(2)}</div>
                <div className="text-rose-500 font-bold">Balance Due:   ₹{bill.due.toFixed(2)}</div>
              </div>

              <div className="flex items-center justify-between font-sans pt-2">
                <button 
                  onClick={() => {
                    const receiptMarkup = `
                      <div class="header">
                        <h1>CYBE: LABCONNECT LIMS</h1>
                        <small>Sector A-1, Pathology Hub Lab, Dubai UAE</small>
                      </div>
                      <div class="meta">
                        <div><strong>Date:</strong> ${bill.visitDate}</div>
                        <div><strong>Receipt:</strong> #${bill.visitId}</div>
                        <div><strong>MRN:</strong> ${patient.mrn || 'MRN123456'}</div>
                        <div><strong>UHID:</strong> ${patient.uhid || 'UHID123456'}</div>
                        <div><strong>Patient:</strong> ${patient.name}</div>
                        <div><strong>Doctor:</strong> ${bill.doctorName}</div>
                      </div>
                      <table>
                        <thead>
                          <tr><th>Particulars</th><th>Amount</th></tr>
                        </thead>
                        <tbody>
                          ${services.map(service => `<tr><td>${service.serviceName}</td><td>₹${bill.gross.toFixed(2)}</td></tr>`).join('')}
                        </tbody>
                      </table>
                      <div class="totals">
                        <div><span>Gross Total</span><span>₹${bill.gross.toFixed(2)}</span></div>
                        <div><span>Discount</span><span>-₹${bill.discount.toFixed(2)}</span></div>
                        <div><span>VAT</span><span>₹${bill.vat.toFixed(2)}</span></div>
                        <div class="grand"><span>Net Payable</span><span>₹${bill.netPayable.toFixed(2)}</span></div>
                        <div><span>Collected</span><span>₹${bill.collected.toFixed(2)}</span></div>
                        <div><span>Balance Due</span><span>₹${bill.due.toFixed(2)}</span></div>
                      </div>
                    `;
                    openPrintableWindow(`Invoice Receipt - ${bill.visitId}`, receiptMarkup);
                    setPrintBillOpen(false);
                  }}
                  className="bg-[#3c3bb6] hover:bg-[#32319c] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-1.5 cursor-pointer w-full justify-center shadow-md shadow-indigo-600/10"
                >
                  <Printer className="h-3.5 w-3.5" /> Confirm Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- DYNAMIC OVERLAY: Print Service Slips --- */}
        {printServiceOpen && (
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-xs rounded-[32px] z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-left">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <Printer className="h-4 w-4" /> Print Service Voucher Slip
                </span>
                <button onClick={() => setPrintServiceOpen(null)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs font-semibold">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl space-y-1.5">
                  <span className="block text-[9px] uppercase font-bold text-zinc-400">Clinical Service to Print</span>
                  <span className="block font-black text-zinc-900 dark:text-zinc-100">{printServiceOpen.serviceName}</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-500 pt-1">
                    <div>Department: {printServiceOpen.department}</div>
                    <div>Sample type: {printServiceOpen.sample}</div>
                    <div>Barcode: {printServiceOpen.barcodeNo}</div>
                    <div>Status: {printServiceOpen.status}</div>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 italic">
                  This voucher certifies the booking reference and directs the phlebotomy collection workflow.
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2 font-bold text-xs">
                <button 
                  onClick={() => setPrintServiceOpen(null)}
                  className="text-zinc-500 hover:bg-zinc-50 p-2 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const voucherMarkup = `
                      <div class="header">
                        <h1>Cybe LabConnect</h1>
                        <small>Service Voucher Slip</small>
                      </div>
                      <div class="box">
                        <div><strong>Service:</strong> ${printServiceOpen.serviceName}</div>
                        <div><strong>Department:</strong> ${printServiceOpen.department}</div>
                        <div><strong>Sample:</strong> ${printServiceOpen.sample}</div>
                        <div><strong>Barcode:</strong> ${printServiceOpen.barcodeNo}</div>
                        <div><strong>Status:</strong> ${printServiceOpen.status}</div>
                      </div>
                      <p style="font-size:11px; color:#71717a; margin-top:16px;">This voucher certifies the booking reference and directs the phlebotomy collection workflow.</p>
                    `;
                    openPrintableWindow(`Service Voucher - ${printServiceOpen.serviceName}`, voucherMarkup);
                    setPrintServiceOpen(null);
                  }}
                  className="bg-[#3c3bb6] hover:bg-[#32319c] text-white px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- LOCAL TOAST LOG OVERLAY --- */}
        {localToast && (
          <div className="absolute bottom-16 right-6 bg-zinc-950 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold border border-zinc-800 flex items-center gap-2 animate-fade-in z-50">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
            <span>{localToast}</span>
          </div>
        )}

      </div>
    </div>
  );
}
