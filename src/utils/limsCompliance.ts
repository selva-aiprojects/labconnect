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
