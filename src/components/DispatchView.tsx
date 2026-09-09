/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { Truck, Mail, Smartphone, Printer, Check, RefreshCw, Send, Share2, ClipboardCheck, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Patient } from '../types/lims_app';
import { LabReport } from './LabReport';

interface DispatchViewProps {
  patients: Patient[];
}

export function DispatchView({ patients }: DispatchViewProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, { email: boolean, sms: boolean, print: boolean }>>({});
  const [sendingChannel, setSendingChannel] = useState<'email' | 'sms' | 'print' | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const printableReportRef = useRef<HTMLDivElement>(null);

  // Completed or Reported patients are ready for dispatch
  const readyPatients = patients.filter(p => p.status === 'Completed');
  const activePatient = patients.find(p => p.id === selectedId) || readyPatients[0];

  const handleDispatch = (id: string, channel: 'email' | 'sms' | 'print', value: string) => {
    if (sendingChannel) return;
    setSendingChannel(channel);

    setTimeout(() => {
      setDispatchStatus(prev => {
        const current = prev[id] || { email: false, sms: false, print: false };
        return {
          ...prev,
          [id]: { ...current, [channel]: true }
        };
      });
      setSendingChannel(null);
      
      let message = '';
      if (channel === 'email') {
        message = `PDF Lab Report dispatched to: ${activePatient.name.toLowerCase().replace(/\s+/g, '')}@gmail.com!`;
      } else if (channel === 'sms') {
        message = `Secure LIMS report link dispatched via WhatsApp/SMS to: ${value}`;
      } else {
        message = `Print spooler successfully routed to: "Central-Office-Canon-LBP320" (Job #44921-A)`;
      }
      alert(message);
    }, 800);
  };

  const handlePrintReport = async () => {
    const reportEl = printableReportRef.current;
    if (!reportEl) return;
    const reportRoot = reportEl.querySelector<HTMLElement>('.lab-report') || reportEl;
    try {
      const fallbackUnsupportedColors = (value: string, fallback: string) => /oklch|oklab/i.test(value) ? fallback : value;
      const canvasOptions = {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDocument: Document) => {
          const clonedReport = clonedDocument.querySelector('.lab-report');
          if (!clonedReport) return;
          const sourceElements = [reportRoot, ...Array.from(reportRoot.querySelectorAll('*'))];
          const clonedElements = [clonedReport, ...Array.from(clonedReport.querySelectorAll('*'))];
          clonedElements.forEach((clonedElement, index) => {
            const sourceElement = sourceElements[index];
            if (!sourceElement) return;
            const styles = window.getComputedStyle(sourceElement);
            const element = clonedElement as HTMLElement;
            for (let propertyIndex = 0; propertyIndex < styles.length; propertyIndex += 1) {
              const property = styles.item(propertyIndex);
              const value = styles.getPropertyValue(property);
              element.style.setProperty(property, fallbackUnsupportedColors(value, '#475569'));
            }
          });
          clonedDocument.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleElement => styleElement.remove());
        }
      };
      let canvas;
      try {
        canvas = await html2canvas(reportRoot, canvasOptions);
      } catch (renderError) {
        console.warn('Standard lab report canvas rendering failed; retrying with browser SVG rendering.', renderError);
        canvas = await html2canvas(reportRoot, { ...canvasOptions, foreignObjectRendering: true });
      }
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const pageImageHeight = Math.floor((canvas.width * contentHeight) / contentWidth);
      const pageCount = Math.ceil(canvas.height / pageImageHeight);

      for (let page = 0; page < pageCount; page += 1) {
        if (page > 0) pdf.addPage();
        const offset = page * pageImageHeight;
        const sliceHeight = Math.min(pageImageHeight, canvas.height - offset);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const pageContext = pageCanvas.getContext('2d');
        if (!pageContext) throw new Error('Unable to create the PDF page canvas.');
        pageContext.fillStyle = '#ffffff';
        pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageContext.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        const pageImage = pageCanvas.toDataURL('image/jpeg', 0.92);
        const pageHeight = (sliceHeight * contentWidth) / canvas.width;
        pdf.addImage(pageImage, 'JPEG', margin, margin, contentWidth, pageHeight);
      }

      const filename = `${activePatient?.name || 'lab-report'}`
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
      pdf.save(`${filename || 'lab-report'}.pdf`);
    } catch (error) {
      console.error('Unable to generate the lab report PDF', error);
      alert('The PDF could not be generated. Please try again.');
    }
  };

  // A blank, white-styled report for print (no Tailwind dependency)
  const renderPrintable = (p: Patient) => (
    <div id="lab-report-printable" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#18181b' }}>
      <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottom: '3px solid #3c3bb6', paddingBottom: 12 }}>
        <div>
          <h1 style={{ color: '#3c3bb6', margin: 0, fontSize: 22 }}>Cybe: LabConnect</h1>
          <p style={{ margin: '2px 0', fontSize: 11, color: '#71717a' }}>Clinical Pathology Laboratory Report</p>
        </div>
        <div style={{ fontSize: 11, color: '#52525b', textAlign: 'right' }}>
          <p style={{ margin: 0 }}>Sector A-1, Pathology Hub Lab, Dubai UAE</p>
          <p style={{ margin: 0 }}>Tel: +971 4 000 0000</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, marginBottom: 16, padding: '10px 12px', background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: 6 }}>
        <div>
          <div><strong>Patient:</strong> {p.name}</div>
          <div><strong>Age/Sex:</strong> {p.ageUnitStr || `${p.age} Y / ${p.gender}`}</div>
          <div><strong>Patient ID:</strong> {p.patientId || p.bookingNo}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>Booking:</strong> {p.bookingNo}</div>
          <div><strong>Referred By:</strong> {p.billDetails?.doctorName || '—'}</div>
          <div><strong>Collection:</strong> {p.collectionDttm || p.apptDttm || '—'}</div>
        </div>
      </div>

      <h2 style={{ fontSize: 14, margin: '8px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.testPanel}</h2>

      <table>
        <thead>
          <tr>
            <th>Investigation</th>
            <th style={{ textAlign: 'right' }}>Result</th>
            <th style={{ textAlign: 'center' }}>Flag</th>
            <th style={{ textAlign: 'center' }}>Unit</th>
            <th style={{ textAlign: 'right' }}>Reference Range</th>
          </tr>
        </thead>
        <tbody>
          {(p.testResults || []).map((r, i) => (
            <tr key={i} style={r.flag === 'H' || r.flag === 'L' || r.flag === 'A' ? { background: '#fef2f2' } : undefined}>
              <td><strong>{r.name}</strong></td>
              <td style={{ textAlign: 'right', fontWeight: 'bold', color: r.flag === 'H' || r.flag === 'L' || r.flag === 'A' ? '#e11d48' : 'inherit' }}>{r.value}</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', color: r.flag === 'H' || r.flag === 'L' || r.flag === 'A' ? '#e11d48' : '#059669' }}>
                {r.flag === 'H' ? 'HIGH' : r.flag === 'L' ? 'LOW' : r.flag === 'A' ? 'ABN' : 'N'}
              </td>
              <td style={{ textAlign: 'center' }}>{r.unit || '—'}</td>
              <td style={{ textAlign: 'right' }}>{r.reference || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: 10, fontStyle: 'italic', color: '#a1a1aa', marginTop: 12 }}>
        * Reference ranges are laboratory-specific and may vary by age, gender and methodology. This report is generated electronically and is valid without signature.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 32 }}>
        <div>
          <div style={{ borderBottom: '1px solid #a1a1aa', paddingBottom: 2, minWidth: 180 }}>
            <strong>Dr. Alistair Sterling, MD</strong>
          </div>
          <div style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>Consultant Pathologist</div>
        </div>
        <div style={{ fontSize: 10, color: '#71717a', textAlign: 'right' }}>
          <div>Report Generated: {new Date().toLocaleString()}</div>
          <div>Approved by Laboratory Quality Control</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Report Dispatch Desk</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Coordinate physical print batches, deliver secure clinical PDFs via email, or dispatch results to patient WhatsApp lines.</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1.5 rounded-xl border border-indigo-100/30 font-sans">
          Inbound courier routes: 100% active
        </span>
      </div>

      {readyPatients.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 mx-auto">
            <ClipboardCheck className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">Dispatch Queue Clear</h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
            There are no clinical files ready for outbound distribution. Run diagnostic testing and authorize panels to populate the dispatch suite.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Selection Queue (4 of 12) */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Reports Pending Delivery ({readyPatients.length})</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {readyPatients.map(p => {
                const currentStatus = dispatchStatus[p.id] || { email: false, sms: false, print: false };
                const isFullyDispatched = currentStatus.email || currentStatus.sms || currentStatus.print;

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full p-4 text-left block transition-all cursor-pointer ${
                      activePatient?.id === p.id
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/10 border-l-4 border-indigo-600'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block font-bold text-zinc-900 dark:text-zinc-100 text-xs">{p.name}</span>
                      {isFullyDispatched && (
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded font-extrabold font-mono uppercase">Dispatched</span>
                      )}
                    </div>
                    <span className="block text-[10px] text-zinc-400 mt-1">ID: {p.bookingNo} &bull; Panel: {p.testPanel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Delivery Center (8 of 12) */}
          {activePatient && (
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Report Routing Hub</span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{activePatient.name}</h3>
                  <p className="text-[10px] text-zinc-400">Gender/Age: {activePatient.gender}/{activePatient.age} &bull; Contact: {activePatient.contactNo} &bull; Bill: ₹{activePatient.billingAmount}.00</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="text-[10px] uppercase font-bold text-white bg-[#3c3bb6] hover:bg-[#31309c] px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview Report
                  </button>
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> Results Sealed
                  </span>
                </div>
              </div>

              {/* Delivery channel selectors */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Dispatch Channels</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Email Outbox card */}
                  <div className="p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-center space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                        <Mail className="h-5 w-5" />
                      </div>
                      <h5 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200">Email SMTP Delivery</h5>
                      <p className="text-[10px] text-zinc-400 leading-normal font-semibold">
                        Dispatches secure diagnostic PDF report directly to registered patient mail inbox.
                      </p>
                    </div>

                    <button
                      onClick={() => handleDispatch(activePatient.id, 'email', '')}
                      disabled={sendingChannel !== null}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        (dispatchStatus[activePatient.id]?.email)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'
                          : 'bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {sendingChannel === 'email' ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (dispatchStatus[activePatient.id]?.email) ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Delivered</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Email Report</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SMS / Whatsapp card */}
                  <div className="p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-center space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <h5 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200">WhatsApp & SMS Api</h5>
                      <p className="text-[10px] text-zinc-400 leading-normal font-semibold">
                        Dispatches encrypted hyperlink download token directly to patient phone line.
                      </p>
                    </div>

                    <button
                      onClick={() => handleDispatch(activePatient.id, 'sms', activePatient.contactNo)}
                      disabled={sendingChannel !== null}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        (dispatchStatus[activePatient.id]?.sms)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'
                          : 'bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {sendingChannel === 'sms' ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (dispatchStatus[activePatient.id]?.sms) ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Sent SMS</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Send WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Physical print card */}
                  <div className="p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-center space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                        <Printer className="h-5 w-5" />
                      </div>
                      <h5 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200">Hard-Copy Batch Print</h5>
                      <p className="text-[10px] text-zinc-400 leading-normal font-semibold">
                        Spools clinical layout onto pre-printed letterhead paper via local clinic print network.
                      </p>
                    </div>

                    <button
                      onClick={() => handleDispatch(activePatient.id, 'print', '')}
                      disabled={sendingChannel !== null}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        (dispatchStatus[activePatient.id]?.print)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'
                          : 'bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {sendingChannel === 'print' ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (dispatchStatus[activePatient.id]?.print) ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Spooled</span>
                        </>
                      ) : (
                        <>
                          <Printer className="h-3.5 w-3.5" />
                          <span>Spool Paper Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Report Preview Modal */}
      {previewOpen && activePatient && (
        <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-50 rounded-[24px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-200 bg-white rounded-t-[24px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-black uppercase tracking-wider text-zinc-800">Final Report - {activePatient.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-[#3c3bb6] hover:bg-[#31309c] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Print PDF
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 cursor-pointer"
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div ref={printableReportRef}>
                <LabReport patient={activePatient} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
