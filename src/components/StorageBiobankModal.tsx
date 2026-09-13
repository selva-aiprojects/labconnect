/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Database, Snowflake, Plus, X, Layers, ShieldCheck, ThermometerSnowflake, Grid } from 'lucide-react';
import { motion } from 'motion/react';
import { ApiService, BiobankStorageItemDto } from '../services/apiService';
import { Patient } from '../types/lims_app';

interface StorageBiobankModalProps {
  patients: Patient[];
  onClose: () => void;
  currentUser: string;
}

export function StorageBiobankModal({ patients, onClose, currentUser }: StorageBiobankModalProps) {
  const [items, setItems] = useState<BiobankStorageItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFreezer, setSelectedFreezer] = useState('Ultra-Low Freezer -80C (Hub 1)');
  const [selectedBox, setSelectedBox] = useState('Box-A4');
  
  // New aliquot form
  const [parentBarcode, setParentBarcode] = useState('');
  const [aliquotType, setAliquotType] = useState<BiobankStorageItemDto['aliquotType']>('Serum');
  const [volumeUl, setVolumeUl] = useState(500);
  const [wellCoord, setWellCoord] = useState('B2');
  const [saving, setSaving] = useState(false);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = async () => {
    setLoading(true);
    const data = await ApiService.getBiobankStorage();
    setItems(data);
    setLoading(false);
  };

  const handleCreateAliquot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentBarcode) return;

    setSaving(true);
    try {
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      const aliquotBarcode = `ALQ-${parentBarcode.replace('BAR-', '')}-${randomSuffix}`;
      
      const updated = await ApiService.saveBiobankAliquot({
        parentSpecimenBarcode: parentBarcode,
        aliquotBarcode,
        aliquotType,
        volumeUl,
        freezerName: selectedFreezer,
        rackId: 'Rack-01',
        boxId: selectedBox,
        wellCoordinate: wellCoord,
        freezeThawCycles: 0,
        storedBy: currentUser
      }, currentUser);

      setItems(updated);
      setParentBarcode('');
      alert(`Child aliquot ${aliquotBarcode} allocated to ${selectedBox} [${wellCoord}]!`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Map occupied wells in the selected box
  const occupiedWells = new Map<string, BiobankStorageItemDto>();
  items
    .filter(i => i.freezerName === selectedFreezer && i.boxId === selectedBox)
    .forEach(i => occupiedWells.set(i.wellCoordinate, i));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-fade-in font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-inner">
              <ThermometerSnowflake className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  Cryogenic Biobank & Specimen Aliquot Matrix
                </h3>
                <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  -80°C Cryo Storage
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Hierarchical parent-to-child sample lineage with $9 \times 9$ cryogenic box coordinate mapping
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left: 9x9 Freezer Box Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={selectedFreezer}
                  onChange={(e) => setSelectedFreezer(e.target.value)}
                  className="text-xs font-bold p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="Ultra-Low Freezer -80C (Hub 1)">Ultra-Low Freezer -80°C (Hub 1)</option>
                  <option value="Cryo-Chest -20C (Biochem)">Cryo-Chest -20°C (Biochem)</option>
                  <option value="Liquid Nitrogen Tank LN2 (Molecular)">Liquid Nitrogen Tank LN2 (Molecular)</option>
                </select>

                <select
                  value={selectedBox}
                  onChange={(e) => setSelectedBox(e.target.value)}
                  className="text-xs font-bold p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="Box-A4">Box-A4 (9x9 2mL Tubes)</option>
                  <option value="Box-B1">Box-B1 (9x9 2mL Tubes)</option>
                  <option value="Box-C2">Box-C2 (9x9 1.5mL Microtubes)</option>
                </select>
              </div>

              <span className="text-xs font-bold text-zinc-500">
                {occupiedWells.size} / 81 Wells Filled
              </span>
            </div>

            {/* Grid Container */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <div className="grid grid-cols-10 gap-1 text-center font-mono text-[10px]">
                {/* Col Headers */}
                <div className="text-zinc-400 font-bold"></div>
                {cols.map(c => (
                  <div key={c} className="text-zinc-500 font-bold py-1">{c}</div>
                ))}

                {/* Rows */}
                {rows.map(r => (
                  <>
                    <div key={`row-${r}`} className="text-zinc-500 font-bold flex items-center justify-center">{r}</div>
                    {cols.map(c => {
                      const coord = `${r}${c}`;
                      const occupant = occupiedWells.get(coord);
                      const isOccupied = !!occupant;
                      const isSelected = wellCoord === coord;

                      return (
                        <button
                          key={coord}
                          type="button"
                          onClick={() => setWellCoord(coord)}
                          title={occupant ? `${occupant.aliquotBarcode} (${occupant.aliquotType}, ${occupant.volumeUl}uL)` : `Empty Well ${coord}`}
                          className={`h-7 w-7 rounded-lg text-[9px] font-bold flex items-center justify-center transition ${
                            isSelected
                              ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-600 text-white z-10'
                              : isOccupied
                                ? occupant.aliquotType === 'Serum'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : occupant.aliquotType === 'Plasma'
                                    ? 'bg-sky-500 text-white shadow-sm'
                                    : 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-indigo-400'
                          }`}
                        >
                          {coord}
                        </button>
                      );
                    })}
                  </>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center gap-4 text-[10px] font-bold text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> Serum</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-sky-500" /> Plasma</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> DNA / Other</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" /> Empty</span>
              </div>
            </div>
          </div>

          {/* Right: Child Aliquot Split Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/80 dark:border-zinc-800">
              <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-600" />
                Split Child Aliquot from Parent Specimen
              </h4>

              <form onSubmit={handleCreateAliquot} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Select Parent Specimen
                  </label>
                  <select
                    value={parentBarcode}
                    onChange={(e) => setParentBarcode(e.target.value)}
                    required
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="">-- Choose collected specimen --</option>
                    {patients
                      .filter(p => p.status !== 'Cancelled')
                      .flatMap(p => p.servicesList?.map(s => ({
                        barcode: s.barcodeNo,
                        label: `${s.barcodeNo} - ${p.name} (${s.serviceName})`
                      })) || [])
                      .map((item, idx) => (
                        <option key={idx} value={item.barcode}>{item.label}</option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Aliquot Fraction
                    </label>
                    <select
                      value={aliquotType}
                      onChange={(e) => setAliquotType(e.target.value as any)}
                      className="w-full text-xs font-medium p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    >
                      <option value="Serum">Serum</option>
                      <option value="Plasma">Plasma</option>
                      <option value="Whole Blood">Whole Blood</option>
                      <option value="DNA Extract">DNA Extract</option>
                      <option value="Buffy Coat">Buffy Coat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Volume (μL)
                    </label>
                    <input
                      type="number"
                      value={volumeUl}
                      onChange={(e) => setVolumeUl(Number(e.target.value))}
                      step={50}
                      min={50}
                      className="w-full text-xs font-medium p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-900 dark:text-indigo-300 block">Selected Storage Target</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">{selectedBox} &bull; Well Coordinate: {wellCoord}</span>
                </div>

                <button
                  type="submit"
                  disabled={saving || !parentBarcode}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-50 transition"
                >
                  {saving ? 'Registering Aliquot...' : 'Generate Aliquot & Store'}
                </button>
              </form>
            </div>

            {/* Existing Aliquot Inventory */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Recent Biobank Storage Records ({items.length})
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {items.map(item => (
                  <div key={item.id} className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">{item.aliquotBarcode}</span>
                      <span className="text-[10px] text-zinc-500">From {item.parentSpecimenBarcode} &bull; {item.aliquotType} ({item.volumeUl} μL)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 block">{item.wellCoordinate}</span>
                      <span className="text-[9px] text-zinc-400">{item.boxId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
