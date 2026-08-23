/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Phone, MessageSquare, ShieldCheck, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage, TRANSLATIONS } from '../types/lims';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export function SupportModal({ isOpen, onClose, lang }: SupportModalProps) {
  const t = TRANSLATIONS[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-2xl dark:shadow-black/70 overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-modal-title"
          >
            {/* Header decor block */}
            <div className="h-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6">
              {/* Close Button */}
              <button
                id="btn-close-support"
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Badge */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="support-modal-title" className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                    {t.supportBoxTitle}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">LIMS Enterprise Hotline & SLA Support</p>
                </div>
              </div>

              {/* Info text */}
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                Our specialized IT Helpdesk is available 24/7/365 to assist with clinical authentication failures, terminal locks, or secure credential resets.
              </p>

              {/* Contact Channels */}
              <div className="space-y-3">
                {/* Dial Option */}
                <a
                  id="link-support-dial"
                  href="tel:+971556457973"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 hover:border-indigo-500/30 bg-zinc-50/50 dark:bg-zinc-950/30 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all group cursor-pointer"
                >
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Direct Hotline (UAE)</span>
                    <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5">+971 55 645 7973</span>
                  </div>
                </a>

                {/* WhatsApp Option */}
                <a
                  id="link-support-whatsapp"
                  href="https://wa.me/971556457973"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 hover:border-green-500/30 bg-zinc-50/50 dark:bg-zinc-950/30 hover:bg-green-50/20 dark:hover:bg-green-950/10 transition-all group cursor-pointer"
                >
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">WhatsApp Chat Help</span>
                    <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5">Click to Chat Support</span>
                  </div>
                </a>
              </div>

              {/* Meta information */}
              <div className="mt-5 pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold font-mono">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Avg Response: &lt; 2 Mins</span>
                </div>
                <span>SSL Secured</span>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
