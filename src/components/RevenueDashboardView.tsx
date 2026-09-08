/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Building2, ShieldAlert, CheckCircle2, AlertTriangle, FileSpreadsheet, 
  Calendar, Layers, Clock, Filter, Sparkles, RefreshCw, BarChart3, 
  PieChart, CreditCard, ChevronRight, Lock, Unlock, HelpCircle, Download, 
  Check, X, FileText, Search, Scale, Cpu, Truck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomTheme } from '../types/theme';

interface RevenueDashboardViewProps {
  currentTheme: CustomTheme;
  darkMode: boolean;
}

interface LeaseContract {
  id: string;
  analyzerName: string;
  vendor: string;
  branch: string;
  mmcCommitted: number;
  currentVolume: number;
  cprrRate: number;
  monthlyBaseRent: number;
  uptimePercentage: number;
  downtimeHours: number;
  downtimeCreditDue: number;
}

interface DiscountItem {
  id: string;
  patientName: string;
  bookingNo: string;
  testPanel: string;
  grossAmount: number;
  discountPercent: number;
  discountAmount: number;
  netAmount: number;
  costCenter: 'Doctor Goodwill' | 'Clinical Technical Rerun' | 'Staff Health Benefit' | 'Indigent Charity Fund';
  requestedBy: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  timestamp: string;
}

export function RevenueDashboardView({ currentTheme, darkMode }: RevenueDashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ar' | 'ap' | 'leasing' | 'discounts' | 'reagent-bridge'>('overview');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  
  // State for simulated discount approval
  const [discounts, setDiscounts] = useState<DiscountItem[]>([
    {
      id: 'DISC-901',
      patientName: 'Mr. Rajesh Mehra',
      bookingNo: 'B-2026-4412',
      testPanel: 'Comprehensive Lipid & Cardiac Panel',
      grossAmount: 350,
      discountPercent: 25,
      discountAmount: 87.5,
      netAmount: 262.5,
      costCenter: 'Doctor Goodwill',
      requestedBy: 'Sarah Jenkins (Cashier)',
      status: 'Pending Approval',
      timestamp: 'Today, 11:20 AM'
    },
    {
      id: 'DISC-902',
      patientName: 'Mrs. Fatima Al-Zahra',
      bookingNo: 'B-2026-8871',
      testPanel: 'HbA1c & Fasting Glucose',
      grossAmount: 120,
      discountPercent: 100,
      discountAmount: 120,
      netAmount: 0,
      costCenter: 'Clinical Technical Rerun',
      requestedBy: 'Marcus Vance (Tech)',
      status: 'Pending Approval',
      timestamp: 'Today, 10:15 AM'
    },
    {
      id: 'DISC-903',
      patientName: 'Mr. John Smith',
      bookingNo: 'B-2026-1192',
      testPanel: 'Thyroid Total Panel (T3, T4, TSH)',
      grossAmount: 180,
      discountPercent: 15,
      discountAmount: 27,
      netAmount: 153,
      costCenter: 'Staff Health Benefit',
      requestedBy: 'Sarah Jenkins (Cashier)',
      status: 'Approved',
      timestamp: 'Yesterday, 04:30 PM'
    }
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleApproveDiscount = (id: string) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, status: 'Approved' } : d));
    setToast(`Discount ${id} authorized. Dual-audit entry posted to General Ledger.`);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRejectDiscount = (id: string) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, status: 'Rejected' } : d));
    setToast(`Discount ${id} rejected. Patient billed at full standard gross fee.`);
    setTimeout(() => setToast(null), 3500);
  };

  // Mock Leased Analyzers data
  const leasedAnalyzers: LeaseContract[] = [
    {
      id: 'LEASE-01',
      analyzerName: 'Cybe XL-640 (Automated Biochemistry)',
      vendor: 'Cybe Diagnostic Systems GmbH',
      branch: 'Central Reference Hub',
      mmcCommitted: 12000,
      currentVolume: 10850,
      cprrRate: 0.85,
      monthlyBaseRent: 2400,
      uptimePercentage: 99.4,
      downtimeHours: 4.2,
      downtimeCreditDue: 0
    },
    {
      id: 'LEASE-02',
      analyzerName: 'Roche Cobas 6000 (Immunochemistry)',
      vendor: 'Roche Diagnostics',
      branch: 'Satellite Lab Metro-A',
      mmcCommitted: 8000,
      currentVolume: 5200,
      cprrRate: 1.45,
      monthlyBaseRent: 3800,
      uptimePercentage: 96.2,
      downtimeHours: 27.5,
      downtimeCreditDue: 450.00
    },
    {
      id: 'LEASE-03',
      analyzerName: 'Sysmex XN-1000 (5-Part Hematology)',
      vendor: 'Sysmex Corporation',
      branch: 'Satellite Lab Metro-B',
      mmcCommitted: 6500,
      currentVolume: 6720,
      cprrRate: 0.42,
      monthlyBaseRent: 1600,
      uptimePercentage: 99.8,
      downtimeHours: 1.5,
      downtimeCreditDue: 0
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* 1. Header Banner */}
      <div 
        className="p-6 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.borderColor,
          color: currentTheme.textColor
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight" style={{ color: currentTheme.textColor }}>
                Executive Financial & Revenue Cockpit
              </h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                IFRS 15 / GAAP Audited
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: currentTheme.textMutedColor }}>
              Multi-facility Accounts Receivable (AR), Accounts Payable (AP), Reagent-Rental Leasing (MMC), and Reagent-to-Revenue Bridge.
            </p>
          </div>
        </div>

        {/* Global Controls & 1-Click Auditor Export */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none cursor-pointer"
            style={{
              backgroundColor: darkMode ? '#18181b' : '#f8fafc',
              borderColor: currentTheme.borderColor,
              color: currentTheme.textColor
            }}
          >
            <option value="all">🏢 All Network Facilities (5 Hubs)</option>
            <option value="central">Central Reference Lab Hub</option>
            <option value="metro-a">Satellite Hospital Lab Metro-A</option>
            <option value="metro-b">Satellite Hospital Lab Metro-B</option>
            <option value="community">City Collection Centers (1-12)</option>
          </select>

          <button
            onClick={() => {
              setToast("Compiling complete IFRS 15 & ISO 15189 Auditor Dossier (PDF + SAP/Excel)...");
              setTimeout(() => setToast("✅ Auditor Reconciliation Pack downloaded successfully!"), 2500);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md cursor-pointer transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>1-Click Auditor Pack</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Metric Barometer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Gross Billed Revenue */}
        <div 
          className="p-5 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textMutedColor }}>
              Gross Billed Revenue
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight" style={{ color: currentTheme.textColor }}>
              ₹482,910
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +14.2%
            </span>
          </div>
          <p className="text-[10px]" style={{ color: currentTheme.textMutedColor }}>
            Net Realized: <strong className="font-mono text-zinc-900 dark:text-zinc-100">₹451,200</strong> (Discounts: ₹31.7k)
          </p>
        </div>

        {/* Metric 2: Accounts Receivable (AR) & DSO */}
        <div 
          className="p-5 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textMutedColor }}>
              Total AR Outstanding
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
              ₹124,650
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              DSO: 28.4 Days
            </span>
          </div>
          <p className="text-[10px]" style={{ color: currentTheme.textMutedColor }}>
            Target &le; 32 Days • Past Due &gt; 60d: <span className="font-bold text-rose-600">₹8,420</span>
          </p>
        </div>

        {/* Metric 3: Accounts Payable (AP) & Leases */}
        <div 
          className="p-5 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textMutedColor }}>
              Total AP & Leases Due
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
              ₹78,240
            </span>
            <span className="text-[11px] font-bold text-blue-600">
              DPO: 51.0 Days
            </span>
          </div>
          <p className="text-[10px]" style={{ color: currentTheme.textMutedColor }}>
            Reagent Leases: <strong className="font-mono text-zinc-900 dark:text-zinc-100">₹26.4k</strong> • Early Disc: <strong className="text-emerald-600">+₹1.8k</strong>
          </p>
        </div>

        {/* Metric 4: Reagent-to-Revenue Bridge Shrinkage */}
        <div 
          className="p-5 rounded-2xl border shadow-sm space-y-2 relative overflow-hidden"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textMutedColor }}>
              Reagent Loss / Shrinkage
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight text-emerald-600">
              0.48%
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-0.5" /> Optimal
            </span>
          </div>
          <p className="text-[10px]" style={{ color: currentTheme.textMutedColor }}>
            Aspirated vs Billed parity &gt; 99.5% • Zero unbilled testing
          </p>
        </div>

      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b overflow-x-auto pb-2" style={{ borderColor: currentTheme.borderColor }}>
        {[
          { id: 'overview', label: 'Financial Overview & P&L' },
          { id: 'ar', label: 'Accounts Receivable (AR Aging)' },
          { id: 'ap', label: 'Accounts Payable (AP & Vendors)' },
          { id: 'leasing', label: 'Analyzer Reagent-Rental Leases (MMC)' },
          { id: 'discounts', label: 'Discount Shield & Cost Centers' },
          { id: 'reagent-bridge', label: 'Reagent-to-Revenue Forensic Bridge' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeSubTab === tab.id
                ? 'text-white shadow-sm'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            style={{
              backgroundColor: activeSubTab === tab.id ? currentTheme.primaryColor : 'transparent',
              color: activeSubTab === tab.id ? '#ffffff' : currentTheme.textMutedColor
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Views */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW & P&L */}
        {activeSubTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 8 Cols: Branch Profitability Matrix */}
              <div 
                className="lg:col-span-8 p-6 rounded-3xl border shadow-sm space-y-4"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black" style={{ color: currentTheme.textColor }}>
                      Facility Unit Economics & Contribution Margins
                    </h3>
                    <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                      Billed Revenue minus Direct Reagents, Tubes, Technologist Labor & Analyzer Amortization.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    Consolidated EBITDA: 41.8%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr 
                        className="border-b font-extrabold uppercase text-[10px] tracking-wider"
                        style={{ borderColor: currentTheme.borderColor, color: currentTheme.textMutedColor }}
                      >
                        <th className="py-2.5 px-3">Laboratory Facility</th>
                        <th className="py-2.5 px-3">Test Volume</th>
                        <th className="py-2.5 px-3">Gross Billed</th>
                        <th className="py-2.5 px-3">Direct OpEx (CPRR+Labor)</th>
                        <th className="py-2.5 px-3">Contribution Margin</th>
                        <th className="py-2.5 px-3 text-right">Margin %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: currentTheme.borderColor }}>
                      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                        <td className="py-3 px-3 font-bold">Central Reference Lab Hub</td>
                        <td className="py-3 px-3 font-mono">24,850</td>
                        <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">₹278,400</td>
                        <td className="py-3 px-3 font-mono text-rose-600">₹138,200</td>
                        <td className="py-3 px-3 font-mono font-black text-emerald-600">+₹140,200</td>
                        <td className="py-3 px-3 text-right font-black text-emerald-600">50.4%</td>
                      </tr>
                      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                        <td className="py-3 px-3 font-bold">Satellite Hospital Lab Metro-A</td>
                        <td className="py-3 px-3 font-mono">11,200</td>
                        <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">₹124,100</td>
                        <td className="py-3 px-3 font-mono text-rose-600">₹74,800</td>
                        <td className="py-3 px-3 font-mono font-black text-emerald-600">+₹49,300</td>
                        <td className="py-3 px-3 text-right font-black text-emerald-600">39.7%</td>
                      </tr>
                      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                        <td className="py-3 px-3 font-bold">Satellite Hospital Lab Metro-B</td>
                        <td className="py-3 px-3 font-mono">7,400</td>
                        <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">₹80,410</td>
                        <td className="py-3 px-3 font-mono text-rose-600">₹51,200</td>
                        <td className="py-3 px-3 font-mono font-black text-emerald-600">+₹29,210</td>
                        <td className="py-3 px-3 text-right font-black text-emerald-600">36.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 4 Cols: 30-60-90 Cash Runway */}
              <div 
                className="lg:col-span-4 p-6 rounded-3xl border shadow-sm space-y-4"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
              >
                <h3 className="text-sm font-black" style={{ color: currentTheme.textColor }}>
                  Cash Runway & Liquidity Projection
                </h3>
                <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                  Scheduled vendor disbursements vs AI-forecasted AR collection curves.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">30-Day Net Cash Flow</span>
                      <span className="text-base font-black text-emerald-600 font-mono">+₹84,200</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">Healthy</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">60-Day Net Cash Flow</span>
                      <span className="text-base font-black text-emerald-600 font-mono">+₹162,800</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">Optimal</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">Cash Conversion Cycle (CCC)</span>
                      <span className="text-base font-black text-indigo-600 font-mono">14.2 Days</span>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">Top 5%</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: ACCOUNTS RECEIVABLE (AR) */}
        {activeSubTab === 'ar' && (
          <motion.div
            key="ar"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-6 rounded-3xl border shadow-sm space-y-6"
            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black" style={{ color: currentTheme.textColor }}>
                  Multi-Tier Accounts Receivable (AR) Aging Matrix
                </h3>
                <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                  Payer segmentation across B2C Walk-ins, Corporate B2B (Apollo, Max), and Insurance TPAs with auto-credit lockout.
                </p>
              </div>
            </div>

            {/* Aging Buckets Barometer */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">Current (0-30d)</span>
                <span className="text-lg font-black text-emerald-800 dark:text-emerald-200 mt-1 block">₹82,410</span>
                <span className="text-[9px] text-emerald-600">66.1% of AR</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <span className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400 block">31-60 Days</span>
                <span className="text-lg font-black text-blue-800 dark:text-blue-200 mt-1 block">₹24,300</span>
                <span className="text-[9px] text-blue-600">19.5% of AR</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 block">61-90 Days</span>
                <span className="text-lg font-black text-amber-800 dark:text-amber-200 mt-1 block">₹9,520</span>
                <span className="text-[9px] text-amber-600">7.6% of AR</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <span className="text-[10px] font-extrabold uppercase text-orange-700 dark:text-orange-400 block">91-120 Days</span>
                <span className="text-lg font-black text-orange-800 dark:text-orange-200 mt-1 block">₹5,100</span>
                <span className="text-[9px] text-orange-600">4.1% of AR</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <span className="text-[10px] font-extrabold uppercase text-rose-700 dark:text-rose-400 block">&gt; 120 Days (Delinquent)</span>
                <span className="text-lg font-black text-rose-800 dark:text-rose-200 mt-1 block">₹3,320</span>
                <span className="text-[9px] text-rose-600">Auto-Locked</span>
              </div>
            </div>

            {/* Corporate B2B Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr 
                    className="border-b font-extrabold uppercase text-[10px] tracking-wider"
                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textMutedColor }}
                  >
                    <th className="py-2.5 px-3">B2B Account / Payer</th>
                    <th className="py-2.5 px-3">Payer Category</th>
                    <th className="py-2.5 px-3">Credit Limit</th>
                    <th className="py-2.5 px-3">Outstanding AR</th>
                    <th className="py-2.5 px-3">Aging Status</th>
                    <th className="py-2.5 px-3 text-right">Account Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: currentTheme.borderColor }}>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                    <td className="py-3 px-3 font-bold">Apollo Hospitals Enterprise</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">Corporate B2B</span></td>
                    <td className="py-3 px-3 font-mono">₹50,000</td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">₹28,400</td>
                    <td className="py-3 px-3"><span className="text-emerald-600 font-bold">● Current (18 Days DSO)</span></td>
                    <td className="py-3 px-3 text-right"><span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1"><Unlock className="h-3 w-3" /> Active</span></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                    <td className="py-3 px-3 font-bold">Max Healthcare Diagnostic Network</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">Corporate B2B</span></td>
                    <td className="py-3 px-3 font-mono">₹35,000</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-600">₹32,800</td>
                    <td className="py-3 px-3"><span className="text-amber-600 font-bold">● Warning: 93% Limit Used</span></td>
                    <td className="py-3 px-3 text-right"><span className="text-amber-600 font-bold text-[11px] flex items-center justify-end gap-1"><AlertTriangle className="h-3 w-3" /> Alert Triggered</span></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                    <td className="py-3 px-3 font-bold">Metro Health Clinics Group</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">Clinic Network</span></td>
                    <td className="py-3 px-3 font-mono">₹10,000</td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-600">₹11,400</td>
                    <td className="py-3 px-3"><span className="text-rose-600 font-bold">● Exceeded Limit &gt; 60 Days</span></td>
                    <td className="py-3 px-3 text-right"><span className="text-rose-600 font-black text-[11px] flex items-center justify-end gap-1"><Lock className="h-3 w-3" /> Auto-Locked (CIA Only)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: ANALYZER LEASING & MMC */}
        {activeSubTab === 'leasing' && (
          <motion.div
            key="leasing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-6 rounded-3xl border shadow-sm space-y-6"
            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
          >
            <div>
              <h3 className="text-sm font-black" style={{ color: currentTheme.textColor }}>
                Equipment Placement & Reagent-Rental Leasing Management (MMC)
              </h3>
              <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                Tracks Minimum Monthly Commitments (MMC), vendor Cost-per-Reportable-Result (CPRR) rates, and machine downtime SLA debit penalties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leasedAnalyzers.map(contract => {
                const percentDone = Math.min(100, Math.round((contract.currentVolume / contract.mmcCommitted) * 100));
                const isUnderperforming = percentDone < 80;

                return (
                  <div 
                    key={contract.id}
                    className="p-5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4"
                    style={{ borderColor: currentTheme.borderColor }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">{contract.vendor}</span>
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{contract.analyzerName}</h4>
                        <span className="text-[10px] text-zinc-500">{contract.branch}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        contract.uptimePercentage >= 99 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {contract.uptimePercentage}% Uptime
                      </span>
                    </div>

                    {/* Progress to MMC */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-zinc-500">MMC Commitment</span>
                        <span className="font-bold">{contract.currentVolume.toLocaleString()} / {contract.mmcCommitted.toLocaleString()} tests</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isUnderperforming ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentDone}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 block text-right font-mono">{percentDone}% Fulfilled</span>
                    </div>

                    {/* Financial Terms */}
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[9px] uppercase text-zinc-400 block">CPRR Rate</span>
                        <span className="font-black text-zinc-800 dark:text-zinc-200">₹{contract.cprrRate.toFixed(2)} / test</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-zinc-400 block">Downtime Credit</span>
                        <span className={`font-black ${contract.downtimeCreditDue > 0 ? 'text-rose-600' : 'text-zinc-400'}`}>
                          -₹{contract.downtimeCreditDue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 4: DISCOUNT GOVERNANCE */}
        {activeSubTab === 'discounts' && (
          <motion.div
            key="discounts"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-6 rounded-3xl border shadow-sm space-y-6"
            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black" style={{ color: currentTheme.textColor }}>
                  Revenue Leakage Shield & Dual-Approval Discount Governance
                </h3>
                <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                  Mandatory cost-center attribution for all courtesy discounts and free runs. Zero unrecorded waivers.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr 
                    className="border-b font-extrabold uppercase text-[10px] tracking-wider"
                    style={{ borderColor: currentTheme.borderColor, color: currentTheme.textMutedColor }}
                  >
                    <th className="py-2.5 px-3">Patient & Booking</th>
                    <th className="py-2.5 px-3">Test Panel</th>
                    <th className="py-2.5 px-3">Gross Fee</th>
                    <th className="py-2.5 px-3">Discount Waived</th>
                    <th className="py-2.5 px-3">Cost-Center Attribution</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: currentTheme.borderColor }}>
                  {discounts.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                      <td className="py-3 px-3">
                        <span className="font-bold block text-zinc-900 dark:text-zinc-100">{item.patientName}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{item.bookingNo}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300 font-medium">{item.testPanel}</td>
                      <td className="py-3 px-3 font-mono">₹{item.grossAmount.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-rose-600">
                        -₹{item.discountAmount.toFixed(2)} ({item.discountPercent}%)
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                          {item.costCenter}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {item.status === 'Pending Approval' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveDiscount(item.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              title="Authorize Discount (CFO/Manager)"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRejectDiscount(item.id)}
                              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                              title="Reject & Bill Full Gross Fee"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-mono">Ledger Posted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 5: REAGENT-TO-REVENUE BRIDGE */}
        {activeSubTab === 'reagent-bridge' && (
          <motion.div
            key="reagent-bridge"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-6 rounded-3xl border shadow-sm space-y-6"
            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
          >
            <div>
              <h3 className="text-sm font-black" style={{ color: currentTheme.textColor }}>
                Reagent-to-Revenue Forensic Reconciliation Bridge
              </h3>
              <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                Reconciles physical reagent volume aspirated (mL / µL) against billed patient tests to eliminate unaccounted reagent leakage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">Total Reagent Aspirated</span>
                <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block">43,450 Tests</span>
                <span className="text-[10px] text-zinc-500">100.0% of Volume</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">Billed Commercial Tests</span>
                <span className="text-xl font-black text-emerald-800 dark:text-emerald-200 mt-1 block">39,810 Tests</span>
                <span className="text-[10px] text-emerald-600">91.6% (Direct Revenue)</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-400 block">QC, Cal & Authorized Reruns</span>
                <span className="text-xl font-black text-indigo-800 dark:text-indigo-200 mt-1 block">3,430 Tests</span>
                <span className="text-[10px] text-indigo-600">7.9% (Validated OpEx)</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 block">Unaccounted Discrepancy</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">210 Tests (0.48%)</span>
                <span className="text-[10px] text-emerald-600">Within &lt;1.0% Threshold</span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-3 text-xs font-bold font-sans"
          >
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
