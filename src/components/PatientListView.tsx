import React, { useState } from 'react';
import { Database, Search, Trash2, CheckCircle2, Upload, X, FileUp, Filter, Download } from 'lucide-react';
import { Patient } from '../types/lims_app';

interface PatientListViewProps {
  patients: Patient[];
  onDeletePatient: (id: string) => void;
  onPrintBarcode: (id: string, bookingNo: string) => void;
  printedBarcodes: string[];
  isPrinting: string | null;
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (updated: Patient) => void;
}

export function PatientListView({
  patients,
  onDeletePatient,
  onPrintBarcode,
  printedBarcodes,
  isPrinting,
  onSelectPatient,
  onUpdatePatient
}: PatientListViewProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  // Consent upload modal state
  const [uploadingPatient, setUploadingPatient] = useState<Patient | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Local notifications
  const [localToast, setLocalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  const filtered = patients.filter(p => {
    // Search by Patient name, Mobile (contactNo), or Patient ID/UHID
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.patientId && p.patientId.toLowerCase().includes(search.toLowerCase())) ||
      (p.uhid && p.uhid.toLowerCase().includes(search.toLowerCase())) ||
      (p.contactNo && p.contactNo.includes(search));

    const matchesStatus = status === 'All' ? true : p.status === status;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, name: string) => {
    const pId = patients.find(p => p.id === id)?.patientId || `BML01${800 + parseInt(id)}`;
    if (window.confirm(`Are you sure you want to delete patient record ${pId} (${name}) and all related clinical/billing information?`)) {
      onDeletePatient(id);
      alert(`SUCCESS CONFIRMATION: Patient record ${pId} (${name}) has been permanently deleted from LIMS database.`);
    }
  };

  const handleOpenUpload = (patient: Patient) => {
    setUploadingPatient(patient);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'doc' || ext === 'docx') {
        setSelectedFile(file);
      } else {
        alert('Invalid file format. Please select a PDF or DOC/DOCX document.');
      }
    }
  };

  const handleSaveUpload = () => {
    if (!uploadingPatient || !selectedFile) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Update patient status/consent form
        const updated: Patient = {
          ...uploadingPatient,
          consentFormFileName: selectedFile.name,
          billDetails: uploadingPatient.billDetails ? {
            ...uploadingPatient.billDetails,
            billStatus: 'File Uploaded'
          } : undefined
        };

        onUpdatePatient(updated);
        setIsUploading(false);
        setUploadingPatient(null);
        showToast(`Consent form "${selectedFile.name}" successfully uploaded for patient ${updated.name}!`);
      }
    }, 200);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* 1. Header Card matching search structure */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Database className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">Patient Database Registry</h2>
              <p className="text-[10px] text-zinc-400 font-bold">Search, filter, and audit clinical logs across all patient categories.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black text-zinc-400">STATUS FILTER:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 text-xs font-black text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <option value="All">All statuses ({patients.length})</option>
              <option value="Pending">Pending ({patients.filter(p => p.status === 'Pending').length})</option>
              <option value="In Progress">In Progress ({patients.filter(p => p.status === 'In Progress').length})</option>
              <option value="Completed">Completed ({patients.filter(p => p.status === 'Completed').length})</option>
              <option value="Cancelled">Cancelled ({patients.filter(p => p.status === 'Cancelled').length})</option>
            </select>
          </div>
        </div>

        {/* Search input field matching UI */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search by Mobile Number, UHID/ MRN, Patient Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs p-3.5 pl-11 rounded-2xl outline-none focus:border-[#3c3bb6] text-zinc-800 dark:text-zinc-100 font-semibold"
          />
        </div>
      </div>

      {/* 2. Main Patient Database Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <p className="text-zinc-400 text-xs font-bold">No patient records found matching search filters.</p>
            <button 
              onClick={() => { setSearch(''); setStatus('All'); }}
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-950/40 text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider border-b border-zinc-200/60 dark:border-zinc-800">
                  <th className="px-6 py-3.5 text-center w-16">S. No</th>
                  <th className="px-6 py-3.5">PATIENT ID</th>
                  <th className="px-6 py-3.5">NAME</th>
                  <th className="px-6 py-3.5">AGE / SEX</th>
                  <th className="px-6 py-3.5 text-center">PHOTO</th>
                  <th className="px-6 py-3.5 text-center">PATIENT CONSENT FORM</th>
                  <th className="px-6 py-3.5 text-center w-24">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {filtered.map((p, idx) => {
                  const patIdDisplay = p.patientId || `BML01${800 + parseInt(p.id)}`;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-950/10 transition-colors">
                      
                      {/* S. No */}
                      <td className="px-6 py-4.5 text-center font-mono font-black text-zinc-400">
                        {idx + 1}
                      </td>

                      {/* PATIENT ID link */}
                      <td className="px-6 py-4.5 font-black text-[#3c3bb6] dark:text-indigo-400">
                        <button 
                          onClick={() => onSelectPatient(p)}
                          className="hover:underline font-mono cursor-pointer text-left focus:outline-none"
                        >
                          {patIdDisplay}
                        </button>
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4.5 font-black text-zinc-900 dark:text-zinc-100">
                        {p.name}
                      </td>

                      {/* AGE / SEX */}
                      <td className="px-6 py-4.5 text-zinc-600 dark:text-zinc-400 font-bold">
                        {p.ageUnitStr || `${p.age} Y / ${p.gender}`}
                      </td>

                      {/* PHOTO */}
                      <td className="px-6 py-4.5 text-center">
                        <div className="flex justify-center">
                          <div className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
                            {p.photoUrl ? (
                              <img 
                                src={p.photoUrl} 
                                alt={p.name} 
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-black uppercase">{p.name.charAt(0)}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* PATIENT CONSENT FORM */}
                      <td className="px-6 py-4.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenUpload(p)}
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                              p.consentFormFileName
                                ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                : 'bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-800'
                            }`}
                            title="Upload Patient Consent Form (PDF/DOC)"
                          >
                            <Upload className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase">
                              {p.consentFormFileName ? 'RE-UPLOAD' : 'UPLOAD'}
                            </span>
                          </button>
                          {p.consentFormFileName && (
                            <span className="text-[9px] text-emerald-600 font-mono" title={p.consentFormFileName}>
                              Uploaded
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS: Trash Icon Only (no eye icon as requested) */}
                      <td className="px-6 py-4.5 text-center">
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 rounded-xl border border-rose-100 dark:border-rose-950 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors cursor-pointer"
                          title="Delete Patient Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* 3. Consent Form Upload Overlay Modal Dialog */}
      {uploadingPatient && (
        <div className="fixed inset-0 bg-zinc-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <FileUp className="h-4.5 w-4.5" /> Upload Consent Form
              </span>
              <button 
                onClick={() => setUploadingPatient(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="block text-[9px] font-black text-zinc-400 uppercase">Selected Patient</span>
                <span className="block text-sm font-black text-zinc-800 dark:text-zinc-100">{uploadingPatient.name}</span>
                <span className="block text-[10px] text-zinc-400 font-semibold mt-0.5">ID: {uploadingPatient.patientId || `BML01${800 + parseInt(uploadingPatient.id)}`}</span>
              </div>

              {/* Drag and drop selection container */}
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-indigo-500 mx-auto" />
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {selectedFile ? selectedFile.name : 'Drag & drop or click to choose file'}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-semibold">
                    Supported formats: PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>

              {/* Progress bar when uploading */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black text-indigo-600">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#3c3bb6] h-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setUploadingPatient(null)}
                className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 rounded-xl text-xs font-bold uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpload}
                disabled={!selectedFile || isUploading}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedFile && !isUploading
                    ? 'bg-[#3c3bb6] hover:bg-[#32319c] text-white shadow-md shadow-indigo-600/10'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                }`}
              >
                <FileUp className="h-4 w-4" /> Save & Commit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Local Toast alerts */}
      {localToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-zinc-800 flex items-center gap-2 font-sans animate-fade-in text-xs font-bold">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
          <span>{localToast}</span>
        </div>
      )}

    </div>
  );
}
