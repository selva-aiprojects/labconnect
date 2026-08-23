/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Truck, Mail, Smartphone, Printer, Check, RefreshCw, Send, Share2, ClipboardCheck } from 'lucide-react';
import { Patient } from '../types/lims_app';

interface DispatchViewProps {
  patients: Patient[];
}

export function DispatchView({ patients }: DispatchViewProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, { email: boolean, sms: boolean, print: boolean }>>({});
  const [sendingChannel, setSendingChannel] = useState<'email' | 'sms' | 'print' | null>(null);

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

                <div className="text-right">
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

    </div>
  );
}
