/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Dna, Scale, Cpu, ShieldCheck, Activity, ArrowRight, CheckCircle2, 
  Sparkles, Zap, Layers, BarChart3, Database, Lock, Globe, Terminal, 
  FileSpreadsheet, Check, ChevronRight, Play, Sun, Moon, ArrowUpRight, 
  FlaskConical, Truck, Users, Clock, ShieldAlert, Calculator,
  ChevronDown, ExternalLink, HeartPulse, Building2, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CybeLogo } from './CybeLogo';
import { CustomTheme } from '../types/theme';

interface LandingPageProps {
  onEnterPortal: (demoRole?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: CustomTheme;
}

export function LandingPage({
  onEnterPortal,
  darkMode,
  onToggleDarkMode,
  currentTheme
}: LandingPageProps) {
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);
  const [sampleVolume, setSampleVolume] = useState<number>(35000);
  const [shrinkageRate, setShrinkageRate] = useState<number>(14);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Dynamic ROI calculations
  const estimatedCostPerTest = 4.2;
  const annualSampleVol = sampleVolume * 12;
  const currentAnnualWastage = (annualSampleVol * (shrinkageRate / 100)) * estimatedCostPerTest;
  const optimizedWastage = (annualSampleVol * 0.005) * estimatedCostPerTest;
  const annualSavings = Math.round(currentAnnualWastage - optimizedWastage);
  const hoursSavedPerMonth = Math.round((sampleVolume * 0.85 * 3.5) / 60);

  const flagshipPillars = [
    {
      id: 'finance',
      title: 'Executive Financial & AR/AP Cockpit',
      icon: Scale,
      tag: 'CFO / IFRS 15 / GAAP',
      headline: 'Real-time multi-branch AR/AP aging, reagent-rental MMC tracking & 1-click auditor dossiers.',
      description: 'Provides top healthcare leadership with automated credit-lockouts on delinquent B2B clients, leased equipment CPRR amortization, and a forensic Reagent-to-Revenue Bridge eliminating unrecorded fee waivers.',
      metrics: [
        { label: 'DSO Reduction', val: '28.4 Days' },
        { label: 'Unaccounted Leakage', val: '< 0.5%' },
        { label: 'Audit Dossier Export', val: '1-Click PDF/SAP' }
      ]
    },
    {
      id: 'port-parity',
      title: 'Hardware Port Parity & Tape OCR',
      icon: Terminal,
      tag: 'ASTM E1381 / CLSI LIS01-A2',
      headline: 'Bit-level RS-232/TCP checksum validation & machine thermal tape OCR cross-checking.',
      description: 'Guarantees 100% data parity between raw analyzer serial output and LIMS patient reports with automated dilution multipliers (x2, x5, x10) and 10-year immutable hex stream storage.',
      metrics: [
        { label: 'Bit Parity Rate', val: '100.00%' },
        { label: 'CRC32 Ingestion', val: '< 25ms' },
        { label: 'Optical Tape OCR', val: 'Instant Match' }
      ]
    },
    {
      id: 'vision-ai',
      title: 'Pre-Analytical AI Vision Gatekeeper',
      icon: Sparkles,
      tag: 'HIL & Meniscus Laser Scan',
      headline: 'Optical screening for Hemolysis, Icterus, Lipemia (HIL) & tube fill volumes before loading.',
      description: 'High-speed edge camera analyzes serum spectral hue and CLSI vacutainer cap colors directly at accessioning, stopping defective or underfilled tubes before expensive reagents are consumed.',
      metrics: [
        { label: 'Rejection Drop', val: '-95% Reduction' },
        { label: 'Fill Accuracy', val: '0.1mm Laser' },
        { label: 'Reagent Savings', val: '₹42k / year' }
      ]
    },
    {
      id: 'autovalidation',
      title: 'Autonomous Auto-Validation (DAVE)',
      icon: ShieldCheck,
      tag: 'Bayesian & Multivariate',
      headline: '85% hands-off clinical release with multivariate physiological correlation sanity checks.',
      description: 'Evaluates Anion Gaps, Osmolal Gaps, Coulter MCHC flags, and historical delta checks simultaneously. Releases verified normal runs instantly while routing critical outliers to senior pathologists.',
      metrics: [
        { label: 'Hands-off Release', val: '80% - 85%' },
        { label: 'Delta Validation', val: '< 40ms' },
        { label: 'Doctor Review Load', val: '-70% Drop' }
      ]
    },
    {
      id: 'molecular-pcr',
      title: 'Molecular Diagnostics & Microplate PCR',
      icon: Dna,
      tag: 'Real-Time RT-PCR & Ct Curve',
      headline: 'Interactive 96/384-well plate layout mapping and sigmoidal Ct curve analysis.',
      description: 'Automated master-mix calculations, multi-target viral load quantification (HIV, HCV, COVID-19), and EUCAST/CLSI M100 antibiotic susceptibility antibiogram generation.',
      metrics: [
        { label: 'Plate Formats', val: '96 / 384 Wells' },
        { label: 'Sigmoidal Fitting', val: 'Dynamic Rn' },
        { label: 'Multi-Target', val: 'Quad-Plex' }
      ]
    },
    {
      id: 'dispatch',
      title: 'Omnichannel Dispatch & Dynamic Bio-Twin',
      icon: Truck,
      tag: 'WhatsApp / FHIR / 3D Trend',
      headline: 'Instant interactive reports with 3D anatomical organ maps and encrypted delivery.',
      description: 'Dispatches certified PDF reports and interactive web bio-twins via official WhatsApp Business API, SMS, encrypted email, and regional Health Information Exchanges (ABDM, Malaffi, Nabidh).',
      metrics: [
        { label: 'Open Speed', val: '< 60 Seconds' },
        { label: 'WhatsApp Delivery', val: '98.8%' },
        { label: 'FHIR R4/R5 Sync', val: 'Real-Time' }
      ]
    }
  ];

  const complianceStandards = [
    { name: 'ISO 15189:2022', desc: 'Medical Laboratories Quality & Competence' },
    { name: 'CAP (LAP)', desc: 'College of American Pathologists Accreditation' },
    { name: 'FDA 21 CFR Part 11', desc: 'Electronic Records & PKI Digital Signatures' },
    { name: 'EU IVDR 2017/746', desc: 'In-House LDT & Reagent Traceability' },
    { name: 'CLIA \'88', desc: 'Clinical Laboratory Improvement Amendments' },
    { name: 'IFRS 15 / GAAP', desc: 'Audited Revenue & Leased Reagent Accounting' },
    { name: 'HL7 FHIR R4/R5', desc: 'Universal Interoperability & HIE Exchanges' },
    { name: 'HIPAA & GDPR Art. 9', desc: 'Zero-Trust PHI Data Protection & AES-256' }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-600 selection:text-white transition-colors ${
      darkMode ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* 1. TOP STICKY NAVIGATION BAR */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        darkMode ? 'bg-[#090d16]/80 border-slate-800/80' : 'bg-white/85 border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <CybeLogo 
              variant="full" 
              size="md" 
              textColor={darkMode ? '#ffffff' : '#0f172a'} 
              accentColor={darkMode ? '#38bdf8' : '#0284c7'} 
            />
          </div>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#flagship-modules" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Flagship Modules</a>
            <a href="#compliance" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Global Standards</a>
            <a href="#roi-calculator" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">ROI Calculator</a>
            <a href="#comparison" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Benchmark Matrix</a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Toggle Dark / Light Mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => onEnterPortal()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <span>Launch Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        {/* Background Glowing Mesh Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/12 via-indigo-600/8 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Release Badge */}
          <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 xl:gap-20 items-center">
            <div className="text-left space-y-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-sky-300 text-[10px] font-extrabold uppercase tracking-[0.18em]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Autonomous lab intelligence / v2.2</span>
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[0.98] text-slate-950 dark:text-white">
                  The operating system for{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400">
                    trusted diagnostics.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Connect every specimen, analyzer, approval, and financial decision in one clinical command layer built for high-throughput diagnostic networks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onEnterPortal()}
                  className="px-6 py-3.5 rounded-xl text-sm font-black text-white bg-blue-600 shadow-xl shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-98 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span>Enter live portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#flagship-modules"
                  className={`px-5 py-3.5 rounded-xl text-sm font-black border transition-all flex items-center gap-2 ${
                    darkMode ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm'
                  }`}
                >
                  <Activity className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                  <span>See the system</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> ISO 15189 ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 21 CFR Part 11</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> FHIR connected</span>
              </div>
            </div>

            <div className={`relative rounded-[2rem] border p-4 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 ${darkMode ? 'bg-slate-900/90 border-slate-700 shadow-blue-950/30' : 'bg-white/90 border-slate-200 shadow-slate-300/50'}`}>
              <div className="absolute -top-3 -right-3 rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">Live system</div>
              <div className={`rounded-[1.4rem] border p-5 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div><span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Central diagnostic hub</span><span className="mt-1 block text-sm font-black text-slate-900 dark:text-white">Operations at a glance</span></div>
                  <div className="h-9 w-9 rounded-xl bg-blue-600/10 flex items-center justify-center"><Activity className="h-4 w-4 text-blue-600 dark:text-sky-400" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3 py-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"><span className="text-[9px] uppercase font-black text-slate-400">Samples today</span><strong className="mt-1 block text-2xl font-black text-slate-900 dark:text-white">48,290</strong><span className="text-[9px] font-bold text-emerald-500">+14% vs target</span></div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"><span className="text-[9px] uppercase font-black text-slate-400">Routine TAT</span><strong className="mt-1 block text-2xl font-black text-slate-900 dark:text-white">38m</strong><span className="text-[9px] font-bold text-blue-500">-75% turnaround</span></div>
                </div>
                <div className="space-y-2.5 text-[10px] font-bold">
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Analyzer ingress</span><span className="text-emerald-500">18 / 18 synced</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2 w-2 rounded-full bg-sky-500" /> Auto-validation queue</span><span className="text-sky-500">12 pending</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2 w-2 rounded-full bg-amber-500" /> Quality review</span><span className="text-amber-500">3 flagged</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Persona Launch Buttons */}
          <div className="pt-14 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Instant Role Demos:</span>
            {[
              { label: 'CFO Cockpit', role: 'Administrator' },
              { label: 'Senior Pathologist', role: 'Administrator' },
              { label: 'Hardware Bench Operator', role: 'Receptionist' },
              { label: 'Phlebotomist Station', role: 'Phlebotomist' }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => onEnterPortal(item.role)}
                className={`px-3 py-1.5 rounded-lg border font-bold text-[11px] transition-all cursor-pointer ${
                  darkMode ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 3. FLOATING COCKPIT TELEMETRY PREVIEW */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className={`p-4 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl text-left relative overflow-hidden ${
              darkMode ? 'bg-slate-900/70 border-slate-800 shadow-blue-900/10' : 'bg-white/90 border-slate-200 shadow-xl'
            }`}>
              
              {/* Window Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-3">
                    cybe://labconnect-hub.live/telemetry-stream
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  All 18 Analyzer Ingress Nodes Synced
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Daily Throughput</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-sky-400 mt-1 block">48,290</span>
                  <span className="text-[10px] text-emerald-500 font-sans font-bold">↑ 14% vs Target</span>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Port Checksum Parity</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">100.00%</span>
                  <span className="text-[10px] text-emerald-500 font-sans font-bold">CRC32 Bit-Exact</span>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Average Routine TAT</span>
                  <span className="text-2xl font-black text-indigo-400 mt-1 block">38 Mins</span>
                  <span className="text-[10px] text-indigo-400 font-sans font-bold">-75% Turnaround</span>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Reagent Shrinkage</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">0.48%</span>
                  <span className="text-[10px] text-emerald-500 font-sans font-bold">IFRS 15 Verified</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. FLAGSHIP MODULES INTERACTIVE SHOWCASE */}
      <section id="flagship-modules" className={`py-24 border-t ${
        darkMode ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-sky-400">Core Architecture</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
              6 Flagship Pillars of Autonomous Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Explore the specialized microservices powering real-time clinical diagnostics, hardware parity, and financial integrity.
            </p>
          </div>

          {/* Module Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {flagshipPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeModuleTab === idx;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveModuleTab(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-sky-300 shadow-md ring-1 ring-blue-600' 
                      : darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5" />
                    {isActive && <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />}
                  </div>
                  <span className="text-xs font-bold leading-tight block text-slate-900 dark:text-white">
                    {pillar.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Module Showcase Card */}
          <AnimatePresence mode="wait">
            {(() => {
              const current = flagshipPillars[activeModuleTab];
              const Icon = current.icon;

              return (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`p-8 sm:p-12 rounded-3xl border shadow-xl ${
                    darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    <div className="lg:col-span-7 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-400 font-mono text-[11px] font-bold uppercase">
                        {current.tag}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                        {current.headline}
                      </h3>

                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {current.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        {current.metrics.map((m, i) => (
                          <div key={i}>
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 block font-mono">{m.label}</span>
                            <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-sky-400 font-mono mt-0.5 block">{m.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => onEnterPortal()}
                          className="px-6 py-3 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                        >
                          <span>Test This Module in Live Demo</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className={`p-6 rounded-2xl border font-mono text-xs space-y-3 ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}>
                        <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                          <span className="flex items-center gap-1.5"><Terminal className="h-4 w-4 text-sky-400" /> Protocol Ingress</span>
                          <span className="text-emerald-400">● ACTIVE</span>
                        </div>
                        <p className="text-sky-400">&gt; Initializing Cybe: LabConnect pipeline...</p>
                        <p className="text-slate-400">&gt; Target: {current.title}</p>
                        <p className="text-slate-400">&gt; Security: 21 CFR Part 11 &amp; ISO 15189 Verified</p>
                        <p className="text-emerald-400">&gt; Checksum validation: PASSED (CRC32: 0x8F4A)</p>
                        <p className="text-indigo-400">&gt; Latency to Central DB: 12ms</p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

        </div>
      </section>

      {/* 5. INTERACTIVE ROI & TURNAROUND CALCULATOR */}
      <section id="roi-calculator" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-sky-400">Economic Value</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
              Calculate Your Laboratory ROI
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              See the projected financial and operational impact of autonomous validation and zero-leakage accounting.
            </p>
          </div>

          <div className={`p-8 sm:p-10 rounded-3xl border shadow-xl ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Sliders */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span>Monthly Test Volume</span>
                    <span className="text-blue-600 dark:text-sky-400">{sampleVolume.toLocaleString()} samples</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={sampleVolume}
                    onChange={(e) => setSampleVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span>Current Reagent Shrinkage / Wastage Rate</span>
                    <span className="text-amber-500">{shrinkageRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={shrinkageRate}
                    onChange={(e) => setShrinkageRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>

              {/* Projected Output */}
              <div className={`p-6 rounded-2xl border font-mono text-center space-y-4 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block font-sans">Projected Annual Cost Savings</span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-500 mt-1 block">
                    ${annualSavings.toLocaleString()} / year
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block font-sans">Doctor Hours Saved</span>
                    <span className="font-bold text-indigo-400">{hoursSavedPerMonth} hrs / mo</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block font-sans">Target Shrinkage</span>
                    <span className="font-bold text-emerald-400">&lt; 0.5% Target</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. GLOBAL REGULATORY & COMPLIANCE MATRIX */}
      <section id="compliance" className={`py-20 border-t ${
        darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-sky-400">Statutory & Clinical Governance</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              Built for International Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceStandards.map((std, i) => (
              <div 
                key={i}
                className={`p-5 rounded-2xl border space-y-1.5 ${
                  darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-sky-400 shrink-0" />
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{std.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">{std.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. GRAND FOOTER */}
      <footer className={`border-t py-12 ${
        darkMode ? 'bg-[#090d16] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CybeLogo variant="horizontal" size="sm" textColor={darkMode ? '#ffffff' : '#0f172a'} />
          </div>

          <p className="text-xs text-slate-500 font-mono">
            &copy; 2026 Cybe: LabConnect Enterprise. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onEnterPortal()}
              className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Sign In to Portal &rarr;
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
