/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export interface AuditRecord {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  actor: string;
  action: string;
  entityType: 'Patient' | 'Result' | 'Order' | 'Instrument' | 'ESignature' | 'Biobank';
  entityId: string;
  reason: string;
  previousValue?: any;
  newValue?: any;
  ipAddress: string;
  previousHash: string;
  currentHash: string;
}

const AUDIT_FILE = path.resolve('.', 'data', 'audit_ledger.json');
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function calculateHash(record: Omit<AuditRecord, 'currentHash'>): string {
  const content = `${record.id}|${record.sequenceNumber}|${record.timestamp}|${record.actor}|${record.action}|${record.entityType}|${record.entityId}|${record.reason}|${JSON.stringify(record.previousValue)}|${JSON.stringify(record.newValue)}|${record.ipAddress}|${record.previousHash}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

export class AuditLedgerService {
  private static async readLedger(): Promise<AuditRecord[]> {
    try {
      const content = await fs.readFile(AUDIT_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      // Initialize Genesis ledger
      const genesisRecord: AuditRecord = {
        id: 'AUD-000001',
        sequenceNumber: 1,
        timestamp: '2026-05-01T00:00:00.000Z',
        actor: 'SYSTEM',
        action: 'GENESIS_BLOCK_INITIALIZED',
        entityType: 'Instrument',
        entityId: 'SYSTEM-ROOT',
        reason: '21 CFR Part 11 Cryptographic Audit Ledger Initialized',
        ipAddress: '127.0.0.1',
        previousHash: GENESIS_HASH,
        currentHash: ''
      };
      genesisRecord.currentHash = calculateHash(genesisRecord);
      
      await fs.mkdir(path.dirname(AUDIT_FILE), { recursive: true });
      await fs.writeFile(AUDIT_FILE, JSON.stringify([genesisRecord], null, 2), 'utf-8');
      return [genesisRecord];
    }
  }

  static async getAuditTrail(): Promise<{ records: AuditRecord[]; isIntegrityValid: boolean; totalCount: number }> {
    const records = await this.readLedger();
    const isIntegrityValid = this.verifyChain(records);
    return {
      records: [...records].reverse(), // newest first
      isIntegrityValid,
      totalCount: records.length
    };
  }

  static async recordEvent(params: {
    actor: string;
    action: string;
    entityType: AuditRecord['entityType'];
    entityId: string;
    reason: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
  }): Promise<AuditRecord> {
    const records = await this.readLedger();
    const lastRecord = records[records.length - 1];
    const previousHash = lastRecord ? lastRecord.currentHash : GENESIS_HASH;
    const sequenceNumber = (lastRecord ? lastRecord.sequenceNumber : 0) + 1;

    const baseRecord: Omit<AuditRecord, 'currentHash'> = {
      id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      sequenceNumber,
      timestamp: new Date().toISOString(),
      actor: params.actor,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      reason: params.reason,
      previousValue: params.previousValue,
      newValue: params.newValue,
      ipAddress: params.ipAddress || '127.0.0.1',
      previousHash
    };

    const newRecord: AuditRecord = {
      ...baseRecord,
      currentHash: calculateHash(baseRecord)
    };

    records.push(newRecord);
    await fs.writeFile(AUDIT_FILE, JSON.stringify(records, null, 2), 'utf-8');
    return newRecord;
  }

  // Verify full SHA-256 chain
  static verifyChain(records: AuditRecord[]): boolean {
    if (!records || records.length === 0) return true;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const recalculated = calculateHash(record);

      if (recalculated !== record.currentHash) {
        console.error(`[AuditLedger] Hash mismatch at sequence ${record.sequenceNumber}`);
        return false;
      }

      if (i > 0) {
        const previousRecord = records[i - 1];
        if (record.previousHash !== previousRecord.currentHash) {
          console.error(`[AuditLedger] Chain broken between sequence ${previousRecord.sequenceNumber} and ${record.sequenceNumber}`);
          return false;
        }
      } else {
        if (record.previousHash !== GENESIS_HASH) {
          return false;
        }
      }
    }

    return true;
  }
}
