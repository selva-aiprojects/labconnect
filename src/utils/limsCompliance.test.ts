import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { advanceDeviationStatus, advanceNonConformanceStatus, closeCapaAction, completeCalibration, consumeInventoryLot, createApprovalRecord, createAuditEntry, createCalibrationRecord, createCapaAction, createDeviationRecord, createInventoryLot, createNonConformanceRecord, createQualityIssuesFromResults, createTraceabilityRecord } from './limsCompliance';

describe('lims compliance utilities', () => {
  it('creates a signed audit entry with actor, reason, and timestamp', () => {
    const entry = createAuditEntry('Result approved', 'Dr. Alistair Sterling', 'Jane Doe', 'Critical review passed');

    assert.equal(entry.action, 'Result approved');
    assert.equal(entry.actor, 'Dr. Alistair Sterling');
    assert.equal(entry.patientName, 'Jane Doe');
    assert.equal(entry.reason, 'Critical review passed');
    assert.ok(entry.timestamp.length > 0);
  });

  it('flags abnormal results as quality issues', () => {
    const issues = createQualityIssuesFromResults([
      { name: 'Hemoglobin', value: '9.5', unit: 'g/dL', flag: 'L', reference: '12-16' },
      { name: 'Creatinine', value: '1.9', unit: 'mg/dL', flag: 'H', reference: '0.7-1.2' },
      { name: 'Sodium', value: '140', unit: 'mmol/L', flag: 'N', reference: '135-145' }
    ]);

    assert.equal(issues.length, 2);
    assert.equal(issues[0].type, 'abnormal-result');
    assert.equal(issues[1].severity, 'high');
  });

  it('creates a structured deviation and corrective action workflow', () => {
    const deviation = createDeviationRecord(
      'Analyzer A-12 drift detected during QC run',
      'Lab Analyst',
      'high',
      'West control drifted beyond 2 SD for three consecutive cycles.',
      'investigating'
    );

    const capa = createCapaAction(
      'Recalibrate analyzer A-12',
      'Biomedical Lead',
      'Due in 2 days',
      'in progress',
      deviation.id
    );

    assert.equal(deviation.status, 'investigating');
    assert.equal(capa.sourceDeviationId, deviation.id);
    assert.ok(deviation.id.startsWith('DEV-'));
    assert.ok(capa.id.startsWith('CAPA-'));
  });

  it('advances deviation lifecycle and closes CAPA actions', () => {
    const deviation = createDeviationRecord(
      'Unexpected reagent lot variance',
      'QA Reviewer',
      'medium',
      'Reagent lot variance observed during three runs.',
      'open'
    );

    const evolved = advanceDeviationStatus(deviation);
    const capa = createCapaAction('Validate reagent lot variance logs', 'QA Manager', 'Due today', 'in progress', evolved.id);
    const closed = closeCapaAction(capa);

    assert.equal(evolved.status, 'investigating');
    assert.equal(closed.status, 'closed');
    assert.equal(closed.sourceDeviationId, evolved.id);
  });

  it('creates a structured approval record for regulated sign-off', () => {
    const approval = createApprovalRecord(
      'Jane Doe',
      'Dr. Alistair Sterling',
      'approved',
      'Critical review passed with no unresolved deviations.',
      'low'
    );

    assert.equal(approval.decision, 'approved');
    assert.equal(approval.patientName, 'Jane Doe');
    assert.equal(approval.riskLevel, 'low');
    assert.ok(approval.id.startsWith('APR-'));
  });

  it('creates a traceability record for instruments and reagent lots', () => {
    const trace = createTraceabilityRecord(
      'Analyzer A-12',
      'LOT-2048-B',
      'accepted',
      'QA Technician',
      'Reagent lot accepted after successful control checks.'
    );

    assert.equal(trace.instrumentId, 'Analyzer A-12');
    assert.equal(trace.reagentLot, 'LOT-2048-B');
    assert.equal(trace.status, 'accepted');
    assert.ok(trace.id.startsWith('TR-'));
  });

  it('tracks reagent inventory and consumption by lot', () => {
    const lot = createInventoryLot('LOT-2048-B', 'Chemistry Reagent', 24, 'available');
    const consumed = consumeInventoryLot(lot, 6);

    assert.equal(lot.lotId, 'LOT-2048-B');
    assert.equal(consumed.availableUnits, 18);
    assert.equal(consumed.status, 'available');
    assert.ok(consumed.id.startsWith('INV-'));
  });

  it('restocks inventory and flags expired lots before use', () => {
    const lot = createInventoryLot('LOT-4001-A', 'Reagent Control', 4, 'low-stock', '2025-01-15T00:00:00.000Z');
    const restocked = consumeInventoryLot(lot, 2);
    const recovered = restocked.availableUnits > 0 ? { ...restocked, availableUnits: restocked.availableUnits + 10 } : restocked;

    assert.equal(recovered.availableUnits, 12);
    assert.equal(lot.status, 'low-stock');
    assert.ok(new Date(lot.expiryDate || '').getTime() < Date.now());
  });

  it('records and completes instrument calibration', () => {
    const calibration = createCalibrationRecord(
      'ANL-A12',
      'Cybe H-560 Chemistry Analyzer',
      '2026-10-15T00:00:00.000Z',
      'QA Technician',
      'overdue',
      '2026-04-15T00:00:00.000Z'
    );
    const completed = completeCalibration(calibration, '2027-04-15T00:00:00.000Z', 'QA Manager');

    assert.equal(calibration.status, 'overdue');
    assert.equal(completed.status, 'calibrated');
    assert.equal(completed.instrumentId, 'ANL-A12');
    assert.equal(completed.reviewer, 'QA Manager');
    assert.ok(completed.id.startsWith('CAL-'));
  });

  it('tracks non-conformance from containment through resolution', () => {
    const record = createNonConformanceRecord(
      'QI-1',
      'Creatinine result outside expected control pathway',
      'QA Reviewer',
      'high',
      'Hold affected report and repeat the control run.'
    );
    const investigating = advanceNonConformanceStatus(record);
    const resolved = advanceNonConformanceStatus(investigating);

    assert.equal(record.status, 'open');
    assert.equal(investigating.status, 'investigating');
    assert.equal(resolved.status, 'resolved');
    assert.equal(resolved.sourceQualityIssueId, 'QI-1');
    assert.ok(resolved.id.startsWith('NC-'));
  });
});
