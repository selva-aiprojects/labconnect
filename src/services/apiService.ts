/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, TestResult } from '../types/lims_app';

export interface AuditRecordDto {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  reason: string;
  previousValue?: any;
  newValue?: any;
  ipAddress: string;
  previousHash: string;
  currentHash: string;
}

export interface ESignatureResponse {
  success: boolean;
  signatureStamp: string;
  signatureHash?: string;
  timestamp: string;
  signer: string;
  role: string;
  declaration: string;
  error?: string;
}

export interface BiobankStorageItemDto {
  id: string;
  parentSpecimenBarcode: string;
  aliquotBarcode: string;
  aliquotType: 'Serum' | 'Plasma' | 'Whole Blood' | 'DNA Extract' | 'Buffy Coat';
  volumeUl: number;
  freezerName: string;
  rackId: string;
  boxId: string;
  wellCoordinate: string;
  freezeThawCycles: number;
  storedAt: string;
  storedBy: string;
}

export interface AnalyzerPacketDto {
  id: string;
  timestamp: string;
  source: string;
  analyzerModel: string;
  rawAscii: string;
  rawHex: string;
  frameLength: number;
  crc32Checksum: string;
  isChecksumValid: boolean;
  parsedSampleBarcode?: string;
  parsedAnalytes?: Array<{ name: string; value: string; unit: string; flag: 'N' | 'H' | 'L' | 'A' }>;
}

export const ApiService = {
  // 1. Patients CRUD
  async getPatients(): Promise<Patient[]> {
    try {
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('[ApiService] Falling back to local storage for patients:', err);
      const cached = localStorage.getItem('lims_patients_cache');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async savePatient(patient: Patient, currentUser: string = 'Receptionist'): Promise<Patient[]> {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lims-user': currentUser
        },
        body: JSON.stringify(patient)
      });
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error('[ApiService] savePatient error:', err);
      throw err;
    }
  },

  async updatePatient(id: string, updates: Partial<Patient>, currentUser: string = 'Lab Specialist'): Promise<Patient> {
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-lims-user': currentUser
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error('[ApiService] updatePatient error:', err);
      throw err;
    }
  },

  async deletePatient(id: string, currentUser: string = 'Administrator'): Promise<boolean> {
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
        headers: { 'x-lims-user': currentUser }
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error('[ApiService] deletePatient error:', err);
      return false;
    }
  },

  // 2. 21 CFR Part 11 Audit Trail
  async getAuditTrail(): Promise<{ records: AuditRecordDto[]; isIntegrityValid: boolean; totalCount: number }> {
    try {
      const res = await fetch('/api/audit-trail');
      if (!res.ok) throw new Error('Failed to fetch audit trail');
      return await res.json();
    } catch (err) {
      console.error('[ApiService] getAuditTrail error:', err);
      return { records: [], isIntegrityValid: true, totalCount: 0 };
    }
  },

  // 3. Electronic Signature
  async verifyESignature(params: {
    username: string;
    role: string;
    pinOrPassword: string;
    declaration: string;
    patientId: string;
    testPanel?: string;
  }): Promise<ESignatureResponse> {
    const res = await fetch('/api/esignature/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  // 4. Analyzer Gateway & Packets
  async getAnalyzerFrames(): Promise<{ frames: AnalyzerPacketDto[]; port: number; protocol: string }> {
    try {
      const res = await fetch('/api/analyzer-gateway/frames');
      return await res.json();
    } catch (err) {
      console.error('[ApiService] getAnalyzerFrames error:', err);
      return { frames: [], port: 5100, protocol: 'ASTM E1381' };
    }
  },

  async simulateAnalyzerPacket(rawAscii: string, analyzerModel: string = 'Roche Cobas 6000'): Promise<AnalyzerPacketDto> {
    const res = await fetch('/api/analyzer-gateway/simulate-packet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawAscii, analyzerModel, source: 'SIMULATOR' })
    });
    const data = await res.json();
    return data.frame;
  },

  subscribeAnalyzerStream(onPacket: (frame: AnalyzerPacketDto) => void): () => void {
    const eventSource = new EventSource('/api/analyzer-gateway/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_PACKET' && data.frame) {
          onPacket(data.frame);
        }
      } catch (err) {
        console.error('[ApiService] SSE parse error:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  },

  // 5. Biobank & Aliquoting
  async getBiobankStorage(): Promise<BiobankStorageItemDto[]> {
    try {
      const res = await fetch('/api/biobank/storage');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error('[ApiService] getBiobankStorage error:', err);
      return [];
    }
  },

  async saveBiobankAliquot(aliquot: Omit<BiobankStorageItemDto, 'id' | 'storedAt'>, currentUser: string = 'Biobank Lead'): Promise<BiobankStorageItemDto[]> {
    const res = await fetch('/api/biobank/aliquot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lims-user': currentUser
      },
      body: JSON.stringify({
        ...aliquot,
        id: `BIO-${Date.now().toString(36).toUpperCase()}`,
        storedAt: new Date().toISOString()
      })
    });
    const data = await res.json();
    return data.data || [];
  },

  // 6. DAVE Delta Checks
  async validateDeltaChecks(currentResults: TestResult[], previousResults?: TestResult[]) {
    try {
      const res = await fetch('/api/validate/delta-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentResults, previousResults })
      });
      return await res.json();
    } catch (err) {
      console.error('[ApiService] validateDeltaChecks error:', err);
      return null;
    }
  }
};
