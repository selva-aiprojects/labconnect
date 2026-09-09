import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { advanceDeviationStatus, closeCapaAction, createApprovalRecord, createAuditEntry, createCapaAction, createDeviationRecord, createQualityIssuesFromResults } from './limsCompliance';

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
});
