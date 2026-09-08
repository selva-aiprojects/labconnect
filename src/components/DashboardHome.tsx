/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { 
  UserPlus, Users, FlaskConical, ShieldCheck, Truck, RotateCw, 
  Search, Calendar, Database, Clipboard, Printer, Check, RefreshCw, 
  Home, FileText, IndianRupee, ChevronRight, ExternalLink, X, CheckCircle,
  BarChart3
} from 'lucide-react';
import { Patient } from '../types/lims_app';

interface DashboardHomeProps {
  patients: Patient[];
  onNavigate: (menuId: string) => void;
  printedBarcodes: string[];
  isPrinting: string | null;
  onPrintBarcode: (id: string, bookingNo: string) => void;
  onRefresh: () => void;
  onSelectPatient: (patient: Patient) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSampleBookings: boolean;
  setShowSampleBookings: (show: boolean) => void;
}

export function DashboardHome({ 
  patients, 
  onNavigate, 
  printedBarcodes, 
  isPrinting, 
  onPrintBarcode,
  onRefresh,
  onSelectPatient,
  searchQuery,
  setSearchQuery,
  showSampleBookings,
  setShowSampleBookings
}: DashboardHomeProps) {
  const [filterTab, setFilterTab] = useState<'booking' | 'appointment'>('booking');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filters
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.bookingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.contactNo.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;

    // Optional date filter
    let matchesDate = true;
    if (fromDate || toDate) {
      try {
        const dateStr = filterTab === 'booking' ? p.bookingDate : p.apptDttm.split(' ')[0];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const monthStr = parts[1];
          const year = parseInt(parts[2]);
          const months: Record<string, number> = { 
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, 
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 
          };
          const pDate = new Date(year, months[monthStr] ?? 0, day);
          
          if (fromDate) {
            const fDate = new Date(fromDate);
            fDate.setHours(0,0,0,0);
            if (pDate < fDate) matchesDate = false;
          }
          if (toDate) {
            const tDate = new Date(toDate);
            tDate.setHours(23,59,59,999);
            if (pDate > tDate) matchesDate = false;
          }
        }
      } catch (e) {
        // Fallback on error
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Dynamic Stats from active patients state
  const stats = {
    all: patients.length,
    pending: patients.filter(p => p.status === 'Pending').length,
    inProgress: patients.filter(p => p.status === 'In Progress').length,
    completed: patients.filter(p => p.status === 'Completed').length,
    cancelled: patients.filter(p => p.status === 'Cancelled').length
  };

  const handleActionClick = (target: string) => {
    onNavigate(target);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSampleBookings(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Row 1: Actions Cards & Booking Counters */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Quick Action buttons (Grid of 6) */}
        <div className="xl:col-span-7 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Quick Actions</h3>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold font-mono">Operations Ready</span>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {/* 1. New B2C Registration */}
            <button 
              id="qa-b2c"
              onClick={() => handleActionClick('reg-b2c')} 
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100/80 dark:bg-sky-950/20 dark:hover:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 transition-all text-center h-[115px]"
            >
              <div className="h-11 w-11 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-sky-900 dark:text-sky-300 mt-2.5 leading-tight">
                New B2C<br/>Registration
              </span>
            </button>

            {/* 2. New B2B Registration */}
            <button 
              id="qa-b2b"
              onClick={() => handleActionClick('reg-b2b')} 
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 transition-all text-center h-[115px]"
            >
              <div className="h-11 w-11 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-purple-900 dark:text-purple-300 mt-2.5 leading-tight">
                New B2B<br/>Registration
              </span>
            </button>

            {/* 3. Phlebotomy Queue */}
            <button 
              id="qa-phleb"
              onClick={() => handleActionClick('phlebotomy')} 
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 transition-all text-center h-[115px]"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <FlaskConical className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-950 dark:text-emerald-300 mt-2.5 leading-tight">
                Phlebotomy<br/>Queue
              </span>
            </button>

            {/* 4. Authorize Samples */}
            <button 
              id="qa-auth"
              onClick={() => handleActionClick('authorization')} 
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30 transition-all text-center h-[115px]"
            >
              <div className="h-11 w-11 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 mt-2.5 leading-tight">
                Authorize<br/>Samples
              </span>
            </button>

            {/* 5. Dispatch Samples */}
            <button 
              id="qa-dispatch"
              onClick={() => handleActionClick('dispatch')} 
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 transition-all text-center h-[115px]"
            >
              <div className="h-11 w-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 mt-2.5 leading-tight">
                Dispatch<br/>Samples
              </span>
            </button>

            {/* 6. Refresh */}
            <button 
              id="qa-refresh"
              onClick={() => {
                onRefresh();
                setShowSampleBookings(true);
              }} 
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 transition-all text-center h-[115px]"
            >
              <div className="h-11 w-11 rounded-xl bg-zinc-200/70 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:rotate-180 transition-all duration-500">
                <RotateCw className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 mt-2.5 leading-tight">
                Refresh<br/>Database
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Booking Status Counters */}
        <div className="xl:col-span-5 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Booking Statistics</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">Today</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {/* 1. All Bookings */}
            <div 
              onClick={() => { setShowSampleBookings(true); setStatusFilter('All'); }}
              className="cursor-pointer flex flex-col justify-between p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 transition-all text-left h-[95px]"
            >
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">All Bookings</span>
              <span className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono leading-none">{stats.all}</span>
            </div>

            {/* 2. Pending */}
            <div 
              onClick={() => { setShowSampleBookings(true); setStatusFilter('Pending'); }}
              className="cursor-pointer flex flex-col justify-between p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 transition-all text-left h-[95px]"
            >
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Pending</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-300 font-mono leading-none">{stats.pending}</span>
            </div>

            {/* 3. In Progress */}
            <div 
              onClick={() => { setShowSampleBookings(true); setStatusFilter('In Progress'); }}
              className="cursor-pointer flex flex-col justify-between p-3 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 transition-all text-left h-[95px]"
            >
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">In Progress</span>
              <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono leading-none">{stats.inProgress}</span>
            </div>

            {/* 4. Completed */}
            <div 
              onClick={() => { setShowSampleBookings(true); setStatusFilter('Completed'); }}
              className="cursor-pointer flex flex-col justify-between p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 transition-all text-left h-[95px]"
            >
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Completed</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-300 font-mono leading-none">{stats.completed}</span>
            </div>

            {/* 5. Cancelled */}
            <div 
              onClick={() => { setShowSampleBookings(true); setStatusFilter('Cancelled'); }}
              className="cursor-pointer flex flex-col justify-between p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 transition-all text-left h-[95px]"
            >
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Cancelled</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-300 font-mono leading-none">{stats.cancelled}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 of 12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Booking / Appointment Date Filters */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-zinc-150 dark:border-zinc-800">
              <button 
                id="btn-tab-booking-date"
                onClick={() => setFilterTab('booking')}
                className={`pb-3 text-xs font-extrabold uppercase tracking-wider px-5 border-b-2 transition-all cursor-pointer ${
                  filterTab === 'booking' 
                    ? 'border-indigo-600 text-indigo-700 dark:border-indigo-500 dark:text-indigo-400' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                Booking Date
              </button>
              <button 
                id="btn-tab-appt-date"
                onClick={() => setFilterTab('appointment')}
                className={`pb-3 text-xs font-extrabold uppercase tracking-wider px-5 border-b-2 transition-all cursor-pointer ${
                  filterTab === 'appointment' 
                    ? 'border-indigo-600 text-indigo-700 dark:border-indigo-500 dark:text-indigo-400' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                Appointment Date
              </button>
            </div>

            {/* Inputs & Search trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <input 
                    type="date" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 pl-10 pr-4 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <input 
                    type="date" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 pl-10 pr-4 rounded-xl outline-none focus:border-indigo-500 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <button 
                  id="btn-date-search"
                  onClick={() => setShowSampleBookings(true)}
                  className="w-full bg-[#3c3bb6] hover:bg-[#31309c] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Booking List Container */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/30">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Booking List</span>
              </div>
              
              <div className="flex items-center gap-2">
                {(searchQuery !== '' || statusFilter !== 'All' || fromDate !== '' || toDate !== '') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setFromDate('');
                      setToDate('');
                    }} 
                    className="text-[10px] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded font-bold transition-all cursor-pointer"
                  >
                    Clear Filters & Reset
                  </button>
                )}
                <span className="text-[10px] text-zinc-400 font-bold font-mono">Count: {filteredPatients.length} records</span>
              </div>
            </div>

            {/* If filtered results empty, show empty state */}
            {filteredPatients.length === 0 ? (
              <div className="py-20 px-6 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center justify-center mb-5 border border-indigo-100/30">
                  <div className="relative">
                    <Clipboard className="h-10 w-10 text-indigo-500/80" />
                    <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#3c3bb6] flex items-center justify-center border-2 border-white dark:border-zinc-900">
                      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
                <h4 className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">No records found</h4>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1.5 max-w-sm leading-relaxed">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950/40 text-[10px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest border-b border-zinc-200/60 dark:border-zinc-800">
                      <th className="px-5 py-3 text-center">S.No</th>
                      <th className="px-5 py-3">Patient Name</th>
                      <th className="px-5 py-3">Booking No / DTTM</th>
                      <th className="px-5 py-3">Contact No</th>
                      <th className="px-5 py-3">Referral Type</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Phlebotomist</th>
                      <th className="px-5 py-3">Appt. DTTM</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    {filteredPatients.map((p, idx) => (
                      <tr 
                        key={p.id} 
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 transition-colors"
                      >
                        <td className="px-5 py-4 text-center font-mono font-bold text-zinc-400">{p.id}</td>
                        <td className="px-5 py-4">
                          <button 
                            onClick={() => onSelectPatient(p)}
                            className="text-left group cursor-pointer block"
                          >
                            <span className="block font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:underline">{p.name}</span>
                            <span className="block text-[10px] text-zinc-400 mt-0.5">{p.age} Yrs &bull; {p.gender}</span>
                          </button>
                        </td>
                        <td className="px-5 py-4 font-mono">
                          <span className="block text-zinc-800 dark:text-zinc-200 font-bold">{p.bookingNo}</span>
                          <span className="block text-[9px] text-zinc-400 mt-0.5">{p.bookingDate}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-zinc-500">{p.contactNo}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.referralType.startsWith('B2B')
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
                              : p.referralType === 'Corporate'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                          }`}>
                            {p.referralType}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            p.status === 'Pending' 
                              ? 'text-amber-500' 
                              : p.status === 'In Progress' 
                                ? 'text-blue-500' 
                                : p.status === 'Completed' 
                                  ? 'text-emerald-500' 
                                  : 'text-rose-500'
                          }`}>
                            {p.status === 'In Progress' && <RefreshCw className="h-2.5 w-2.5 animate-spin text-blue-500" />}
                            {p.status === 'Completed' && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                            {p.status === 'Cancelled' && <X className="h-3 w-3 text-rose-500" />}
                            <span>{p.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-500 font-semibold">{p.phlebotomist}</td>
                        <td className="px-5 py-4 text-zinc-400 text-[10px]">{p.apptDttm}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => onPrintBarcode(p.id, p.bookingNo)}
                              disabled={isPrinting === p.id}
                              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                                printedBarcodes.includes(p.id)
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                                  : 'bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                              }`}
                              title="Print Specimen Barcode Label"
                            >
                              {isPrinting === p.id ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : printedBarcodes.includes(p.id) ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Printer className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Sidebar Widgets (4 of 12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Patient Search widget */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Quick Patient Search</h4>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
              <input 
                id="right-search"
                type="text" 
                placeholder="Search by Patient name or MRN..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSampleBookings(true);
                }}
                onKeyDown={handleSearchKeyPress}
                className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-xs p-2.5 pl-10 pr-14 rounded-xl outline-none focus:border-indigo-500 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600"
              />
              <span className="absolute right-3.5 top-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[9px] px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50 font-mono">Ctrl K</span>
            </div>
          </div>

          {/* Common Actions list */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Common Actions</h4>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              <button 
                onClick={() => handleActionClick('reg-b2c')}
                className="w-full text-left py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 group transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                <span>Home Collection Booking</span>
              </button>
              
              <button 
                onClick={() => handleActionClick('phlebotomy')}
                className="w-full text-left py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 group transition-colors cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                <span>Queue Appointment</span>
              </button>

              <button 
                onClick={() => handleActionClick('patient-list')}
                className="w-full text-left py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 group transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                <span>Bill Draft</span>
              </button>

              <button 
                onClick={() => handleActionClick('patient-list')}
                className="w-full text-left py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 group transition-colors cursor-pointer"
              >
                <IndianRupee className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                <span>Due Clearance</span>
              </button>

              <button 
                onClick={() => handleActionClick('technician')}
                className="w-full text-left py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between gap-3 group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  <span>Reports</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Need Help card with external System Status */}
          <div className="bg-[#f5f6ff] dark:bg-indigo-950/20 p-5 rounded-3xl border border-indigo-100/50 dark:border-indigo-950/50 shadow-sm space-y-3.5">
            <h4 className="font-extrabold text-sm text-[#3c3bb6] dark:text-indigo-400">Need Help?</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed font-medium">
              Check system status or contact admin.
            </p>
            <button 
              onClick={() => alert('Diagnostic Handshake: All connected clinical analyzer pipelines are stable (latencies < 40ms).')}
              className="w-full py-2.5 bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#3c3bb6] dark:text-indigo-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border-indigo-100/30"
            >
              <span>System Status</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
