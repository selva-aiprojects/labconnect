/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, X, KeyRound, FileCheck2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ApiService, ESignatureResponse } from '../services/apiService';

interface ESignatureModalProps {
  patientId: string;
  patientName: string;
  bookingNo: string;
  testPanel: string;
  currentUser: string;
  currentRole: string;
  onClose: () => void;
  onSignatureSuccess: (sig: ESignatureResponse) => void;
}

export function ESignatureModal({
  patientId,
  patientName,
  bookingNo,
  testPanel,
  currentUser,
  currentRole,
  onClose,
  onSignatureSuccess
}: ESignatureModalProps) {
  const [pin, setPin] = useState('');
  const [declaration, setDeclaration] = useState(
    'I certify that I have reviewed these analytical findings and they comply with ISO 15189 & CAP analytical standards.'
  );
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('Please enter your 4-digit Security PIN or password to sign.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const fullDeclaration = clinicalNotes
        ? `${declaration} [Notes: ${clinicalNotes}]`
        : declaration;

      const res = await ApiService.verifyESignature({
        username: currentUser,
        role: currentRole,
        pinOrPassword: pin,
        declaration: fullDeclaration,
        patientId,
        testPanel
      });

      if (res.success) {
        onSignatureSuccess(res);
      } else {
        setErrorMsg(res.error || 'Signature verification failed. Check credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Signature failed due to network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  21 CFR Part 11 Electronic Signature
                </h3>
                <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  ALCOA+
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Non-repudiation cryptographic verification & report release
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient Context Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/70 dark:border-zinc-800/80 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Patient Name</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{patientName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Booking No</span>
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">{bookingNo}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Panel Released</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{testPanel}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Certified Signer</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{currentUser} ({currentRole})</span>
              </div>
            </div>
          </div>

          {/* Legal Signing Declaration */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Legal Signing Declaration Manifest <span className="text-rose-500">*</span>
            </label>
            <select
              value={declaration}
              onChange={(e) => setDeclaration(e.target.value)}
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="I certify that I have reviewed these analytical findings and they comply with ISO 15189 & CAP analytical standards.">
                Certified Pathologist Diagnostic Release (ISO 15189 / CAP)
              </option>
              <option value="Technical result verification completed. Cleared for medical diagnostic release.">
                Senior Bench Technologist Technical Verification
              </option>
              <option value="Amended clinical report authorized with documented clinical necessity.">
                Amended / Corrected Diagnostic Authorization
              </option>
              <option value="Emergency STAT Critical Panic Value Release with direct physician telephone notification.">
                STAT Panic Value Release (Physician Notified)
              </option>
            </select>
          </div>

          {/* Clinical Interpretation Note (Optional) */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Pathologist Interpretive Note / Impression (Optional)
            </label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Findings correlate with microcytic hypochromic pattern. Suggest Iron Studies."
              className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Re-Authentication PIN/Password */}
          <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Security PIN / Password Re-Authentication <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">Demo PIN: 1234</span>
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (e.g. 1234)"
              autoFocus
              className="w-full text-sm font-mono tracking-widest p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
              By entering your security credentials, you generate a legally binding electronic signature under FDA 21 CFR Part 11 §11.50 and ISO 15189 §7.4.
            </p>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-2 disabled:opacity-50 transition"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating Cryptographic Stamp...
                </>
              ) : (
                <>
                  <FileCheck2 className="h-4 w-4" />
                  Apply 21 CFR Part 11 E-Signature
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
