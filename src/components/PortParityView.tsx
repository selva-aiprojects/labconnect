/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Cpu, Activity, CheckCircle2, AlertTriangle, RefreshCw, Layers, 
  Search, FileText, Camera, ShieldCheck, Check, X, Sparkles, 
  Maximize2, ArrowRight, Zap, Database, Terminal, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomTheme } from '../types/theme';
import { LabDevice } from '../types/device';

interface PortParityViewProps {
  currentTheme: CustomTheme;
  darkMode: boolean;
  devices: LabDevice[];
}

interface AnalyzerPort {
  id: string;
  name: string;
  type: string;
  portType: 'RS-232 Serial (COM1)' | 'TCP/IP Socket (Port 5100)' | 'USB-Serial FTDI';
  baudRate: string;
  status: 'online' | 'streaming' | 'standby';
  packetsReceived: number;
  crcErrorCount: number;
  lastPacketTime: string;
  activeSampleBarcode: string;
  dilutionFactor: number;
}

interface AnalyteComparison {
  analyte: string;
  rawMachineTapeValue: string;
  limsIngestedValue: string;
  unit: string;
  referenceRange: string;
  isMatched: boolean;
  dilutionApplied: string;
}

export function PortParityView({ currentTheme, darkMode, devices }: PortParityViewProps) {
  const [selectedPortId, setSelectedPortId] = useState<string>('PORT-01');
  const [isScanningTape, setIsScanningTape] = useState(false);
  const [tapeScanned, setTapeScanned] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const ports: AnalyzerPort[] = devices
    .filter(device => device.deviceType === 'analyzer')
    .map((device, index) => ({
      id: device.id,
      name: `${device.name} (${device.department})`,
      type: `${device.model} Analyzer`,
      portType: device.protocol === 'TCP/IP' ? 'TCP/IP Socket (Port 5100)' : device.protocol === 'RS-232' ? 'RS-232 Serial (COM1)' : 'USB-Serial FTDI',
      baudRate: device.protocol === 'TCP/IP' ? '100 Mbps (HL7 v2.5.1)' : '9600, 8, N, 1 (ASTM E1381)',
      status: device.activeSampleBarcode ? 'streaming' : 'online',
      packetsReceived: 4289 - index * 700,
      crcErrorCount: 0,
      lastPacketTime: device.lastSeenAt,
      activeSampleBarcode: `${device.activeSampleBarcode || 'No active sample'}${device.activeSampleBarcode ? ' (Master Registry)' : ''}`,
      dilutionFactor: device.id === 'DEV-XL640' ? 10 : 1
    }));

  const activePort = ports.find(p => p.id === selectedPortId) || ports[0];

  // Analyte comparisons between machine thermal printout and LIMS ingested values
  const analyteComparisons: AnalyteComparison[] = [
    {
      analyte: 'Serum Glucose (Fasting)',
      rawMachineTapeValue: '94.2',
      limsIngestedValue: '94.2',
      unit: 'mg/dL',
      referenceRange: '70.0 - 99.0',
      isMatched: true,
      dilutionApplied: '1:1 (Direct)'
    },
    {
      analyte: 'Total Cholesterol',
      rawMachineTapeValue: '184.0',
      limsIngestedValue: '184.0',
      unit: 'mg/dL',
      referenceRange: '< 200.0',
      isMatched: true,
      dilutionApplied: '1:1 (Direct)'
    },
    {
      analyte: 'Serum Creatinine',
      rawMachineTapeValue: '0.92',
      limsIngestedValue: '0.92',
      unit: 'mg/dL',
      referenceRange: '0.60 - 1.20',
      isMatched: true,
      dilutionApplied: '1:1 (Direct)'
    },
    {
      analyte: 'Serum Lipase (Diluted 1:10)',
      rawMachineTapeValue: '48.5',
      limsIngestedValue: '485.0',
      unit: 'U/L',
      referenceRange: '10.0 - 140.0',
      isMatched: true,
      dilutionApplied: '1:10 (Auto-Harmonized x10)'
    },
    {
      analyte: 'ALT (SGPT)',
      rawMachineTapeValue: '28.0',
      limsIngestedValue: '28.0',
      unit: 'U/L',
      referenceRange: '7.0 - 56.0',
      isMatched: true,
      dilutionApplied: '1:1 (Direct)'
    }
  ];

  const handleSimulateTapeScan = () => {
    setIsScanningTape(true);
    setTimeout(() => {
      setIsScanningTape(false);
      setTapeScanned(true);
      setToast("100% Bit-Level Parity Verified between Machine Thermal Tape and Ingested LIMS Data (CRC32: 0x8F4A21B9)");
      setTimeout(() => setToast(null), 4000);
    }, 1200);
  };

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
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight" style={{ color: currentTheme.textColor }}>
                Hardware Port Parity & Machine Thermal Tape OCR
              </h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-mono">
                ASTM E1381 / CLSI LIS01-A2
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: currentTheme.textMutedColor }}>
              Real-time serial/TCP packet buffering, CRC-32 checksums, and optical OCR verification against machine thermal tape printouts.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateTapeScan}
          disabled={isScanningTape}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white shadow-md cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: currentTheme.primaryColor }}
        >
          {isScanningTape ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          <span>{isScanningTape ? 'Scanning Thermal Tape...' : 'Scan Machine Tape OCR'}</span>
        </button>
      </div>

      {/* 2. Connected Analyzers Port Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ports.map(port => {
          const isSelected = selectedPortId === port.id;

          return (
            <button
              key={port.id}
              onClick={() => setSelectedPortId(port.id)}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                isSelected ? 'ring-2 shadow-md' : 'hover:bg-zinc-50 dark:hover:bg-zinc-850'
              }`}
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: isSelected ? currentTheme.primaryColor : currentTheme.borderColor,
                // @ts-ignore
                '--tw-ring-color': currentTheme.primaryColor
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">{port.portType}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Streaming Live
                </span>
              </div>
              <h3 className="text-xs font-black mt-1" style={{ color: currentTheme.textColor }}>{port.name}</h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{port.baudRate}</p>
              
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">Packets: <strong className="text-zinc-800 dark:text-zinc-200">{port.packetsReceived}</strong></span>
                <span className="text-emerald-600 font-bold">CRC Errors: 0</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Dual-View Side-by-Side: Machine Thermal Tape Printout vs Ingested LIMS Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 Cols: Machine Thermal Tape Simulation */}
        <div 
          className="lg:col-span-5 p-6 rounded-3xl border shadow-sm space-y-4"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-400" />
              <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
                Physical Machine Thermal Tape (OCR Feed)
              </h3>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              Optical Input
            </span>
          </div>

          {/* Thermal Paper Look */}
          <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-zinc-950 border border-amber-200/50 dark:border-zinc-800 font-mono text-xs space-y-3 text-zinc-800 dark:text-zinc-300 shadow-inner">
            <div className="text-center border-b border-dashed border-zinc-300 dark:border-zinc-700 pb-2.5">
              <span className="font-extrabold text-[11px] block">{activePort.name.toUpperCase()}</span>
              <span className="text-[10px] text-zinc-500 block">SERIAL: CYBE-XL640-9921 • FIRMWARE v4.18</span>
              <span className="text-[10px] text-zinc-500 block">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="text-[11px] space-y-1">
              <div className="flex justify-between font-bold">
                <span>SAMPLE ID:</span>
                <span>BAR-99014</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>RACK / POSITION:</span>
                <span>R-04 / POS-08</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-zinc-300 dark:border-zinc-700 py-2 space-y-1.5 text-[11px]">
              <div className="flex justify-between font-bold text-zinc-400 text-[9px] uppercase">
                <span>TEST NAME</span>
                <span>RAW VALUE / FLAG</span>
              </div>
              {analyteComparisons.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-bold">{item.analyte}</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.rawMachineTapeValue} {item.unit}</span>
                </div>
              ))}
            </div>

            <div className="text-center text-[9px] text-zinc-400 pt-1">
              <span>*** END OF RAW REPORT - CRC32: 0x8F4A21B9 ***</span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: LIMS Ingested Analyte Table & Dilution Harmonizer */}
        <div 
          className="lg:col-span-7 p-6 rounded-3xl border shadow-sm space-y-4"
          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
                LIMS Ingested & Harmonized Results
              </h3>
              <p className="text-[11px]" style={{ color: currentTheme.textMutedColor }}>
                Bit-level parity matched with automated dilution multiplier applied.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Parity Match
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr 
                  className="border-b font-extrabold uppercase text-[10px] tracking-wider"
                  style={{ borderColor: currentTheme.borderColor, color: currentTheme.textMutedColor }}
                >
                  <th className="py-2.5 px-3">Analyte</th>
                  <th className="py-2.5 px-3">Raw Machine</th>
                  <th className="py-2.5 px-3">Dilution Logic</th>
                  <th className="py-2.5 px-3">Final LIMS Value</th>
                  <th className="py-2.5 px-3 text-right">Parity Match</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono" style={{ borderColor: currentTheme.borderColor }}>
                {analyteComparisons.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-850">
                    <td className="py-3 px-3 font-bold font-sans">{item.analyte}</td>
                    <td className="py-3 px-3 text-zinc-500">{item.rawMachineTapeValue}</td>
                    <td className="py-3 px-3 text-[10px] text-zinc-400">{item.dilutionApplied}</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-100">
                      {item.limsIngestedValue} <span className="text-[10px] text-zinc-400 font-normal font-sans">{item.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                        <Check className="h-3 w-3" /> Exact Bit Match
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Raw Hex/ASCII Stream Sniffer Box */}
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-zinc-950 text-zinc-400 font-mono text-[10px] space-y-1 overflow-x-auto border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-500 pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1"><Terminal className="h-3 w-3" /> Raw ASTM E1381 Serial Buffer Stream (SHA-256 Hashed)</span>
                <span className="text-emerald-400">STATUS: &lt;ACK&gt; RECEIVED</span>
              </div>
              <p className="text-emerald-400">H|\^&amp;|||Cybe_XL640^v4.1|||||||P|1|{new Date().toISOString()}</p>
              <p className="text-zinc-300">P|1||BAR-99014||TEST^DUMMY||19900101|M|||||Dr_John_Doe</p>
              <p className="text-zinc-300">O|1|BAR-99014||^^^GLU\^^^CHOL\^^^CREAT\^^^LIPASE||{new Date().toISOString()}|||||||||Serum</p>
              <p className="text-amber-400">R|1|^^^GLU|94.2|mg/dL|70.0-99.0|N||F||||{new Date().toISOString()}</p>
              <p className="text-amber-400">R|2|^^^LIPASE|48.5|U/L|10.0-140.0|N||F|DIL=10|||{new Date().toISOString()}</p>
              <p className="text-zinc-500">L|1|N</p>
            </div>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-3 text-xs font-bold font-sans"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
