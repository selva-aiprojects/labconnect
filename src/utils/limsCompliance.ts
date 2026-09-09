export type AuditEntry = {
  id: string;
  action: string;
  actor: string;
  patientName: string;
  reason: string;
  timestamp: string;
  before?: string;
  after?: string;
};

export type QualityIssue = {
  id: string;
  type: 'abnormal-result' | 'qc-failure' | 'deviation';
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'investigating' | 'resolved';
};

export type DeviationRecord = {
  id: string;
  title: string;
  owner: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
};

export type CapaAction = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: 'planned' | 'in progress' | 'escalated' | 'closed';
  sourceDeviationId: string;
};

export type ApprovalRecord = {
  id: string;
  patientName: string;
  approver: string;
  decision: 'approved' | 'rejected' | 'on-hold';
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high';
  approvedAt: string;
};

export type TraceabilityRecord = {
  id: string;
  instrumentId: string;
  reagentLot: string;
  status: 'accepted' | 'quarantined' | 'rejected';
  reviewer: string;
  note: string;
  checkedAt: string;
};

export type InventoryLot = {
  id: string;
  lotId: string;
  reagentName: string;
  availableUnits: number;
  status: 'available' | 'low-stock' | 'expired' | 'quarantined';
  updatedAt: string;
};

export function advanceDeviationStatus(
  deviation: DeviationRecord
): DeviationRecord {
  const statusOrder: Array<DeviationRecord['status']> = ['open', 'investigating', 'resolved'];
  const currentIndex = statusOrder.indexOf(deviation.status);
  const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];

  return {
    ...deviation,
    status: nextStatus
  };
}

export function closeCapaAction(capa: CapaAction): CapaAction {
  return {
    ...capa,
    status: 'closed'
  };
}

export function createApprovalRecord(
  patientName: string,
  approver: string,
  decision: 'approved' | 'rejected' | 'on-hold',
  rationale: string,
  riskLevel: 'low' | 'medium' | 'high' = 'medium'
): ApprovalRecord {
  return {
    id: `APR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    patientName,
    approver,
    decision,
    rationale,
    riskLevel,
    approvedAt: new Date().toISOString()
  };
}

export function createTraceabilityRecord(
  instrumentId: string,
  reagentLot: string,
  status: 'accepted' | 'quarantined' | 'rejected',
  reviewer: string,
  note: string
): TraceabilityRecord {
  return {
    id: `TR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    instrumentId,
    reagentLot,
    status,
    reviewer,
    note,
    checkedAt: new Date().toISOString()
  };
}

export function createInventoryLot(
  lotId: string,
  reagentName: string,
  availableUnits: number,
  status: 'available' | 'low-stock' | 'expired' | 'quarantined' = 'available'
): InventoryLot {
  return {
    id: `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    lotId,
    reagentName,
    availableUnits,
    status,
    updatedAt: new Date().toISOString()
  };
}

export function consumeInventoryLot(lot: InventoryLot, units: number): InventoryLot {
  const nextUnits = Math.max(0, lot.availableUnits - units);

  return {
    ...lot,
    availableUnits: nextUnits,
    status: nextUnits <= 5 ? 'low-stock' : 'available',
    updatedAt: new Date().toISOString()
  };
}

export function createAuditEntry(
  action: string,
  actor: string,
  patientName: string,
  reason: string,
  before?: string,
  after?: string
): AuditEntry {
  return {
    id: `AUD-${Math.random().toString(36).slice(2, 9)}`,
    action,
    actor,
    patientName,
    reason,
    before,
    after,
    timestamp: new Date().toISOString()
  };
}

export function createDeviationRecord(
  title: string,
  owner: string,
  severity: 'low' | 'medium' | 'high',
  description: string,
  status: 'open' | 'investigating' | 'resolved' = 'open'
): DeviationRecord {
  return {
    id: `DEV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    title,
    owner,
    severity,
    description,
    status,
    createdAt: new Date().toISOString()
  };
}

export function createCapaAction(
  title: string,
  owner: string,
  due: string,
  status: 'planned' | 'in progress' | 'escalated' | 'closed' = 'planned',
  sourceDeviationId: string
): CapaAction {
  return {
    id: `CAPA-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    title,
    owner,
    due,
    status,
    sourceDeviationId
  };
}

export function createQualityIssuesFromResults(results: Array<{ name: string; value: string; unit?: string; flag?: 'L' | 'H' | 'N' | 'A' | null; reference?: string; }>): QualityIssue[] {
  const issues: QualityIssue[] = [];

  results.forEach((result, index) => {
    if (!result.flag || result.flag === 'N') return;

    const issue: QualityIssue = {
      id: `QI-${index + 1}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'abnormal-result',
      title: `${result.name} outside the expected range`,
      severity: result.flag === 'H' || result.flag === 'A' ? 'high' : 'medium',
      description: `${result.name} returned ${result.value}${result.reference ? ` against reference ${result.reference}` : ''}.`,
      status: 'open'
    };

    issues.push(issue);
  });

  return issues;
}
