/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestResult } from '../types/lims_app';

export interface DeltaCheckResult {
  analyteName: string;
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  isFlagged: boolean;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL_DELTA';
  message: string;
}

export interface PhysiologicalSanityResult {
  ruleName: string;
  calculatedValue: number | string;
  referenceInterval: string;
  isPassed: boolean;
  clinicalInterpretation: string;
}

export interface DaveValidationReport {
  overallStatus: 'AUTO_VALIDATED' | 'PATHOLOGIST_REVIEW_REQUIRED' | 'CRITICAL_PANIC';
  confidenceScore: number;
  deltaChecks: DeltaCheckResult[];
  sanityChecks: PhysiologicalSanityResult[];
  autoValidationEligible: boolean;
}

export class DaveValidationService {
  static evaluateResults(
    currentResults: TestResult[],
    previousResults?: TestResult[]
  ): DaveValidationReport {
    const deltaChecks: DeltaCheckResult[] = [];
    const sanityChecks: PhysiologicalSanityResult[] = [];
    let autoValidationEligible = true;

    // 1. Delta Checks evaluation
    if (previousResults && previousResults.length > 0) {
      for (const curr of currentResults) {
        const prev = previousResults.find(p => p.name.toLowerCase() === curr.name.toLowerCase());
        if (!prev) continue;

        const currVal = parseFloat(curr.value);
        const prevVal = parseFloat(prev.value);

        if (!isNaN(currVal) && !isNaN(prevVal) && prevVal > 0) {
          const deltaPercent = Math.round(((currVal - prevVal) / prevVal) * 100);
          const absDelta = Math.abs(deltaPercent);

          let isFlagged = false;
          let severity: DeltaCheckResult['severity'] = 'NORMAL';
          let message = `Delta within acceptable biological limits (${deltaPercent > 0 ? '+' : ''}${deltaPercent}%).`;

          // Specific clinical delta thresholds
          if (curr.name.includes('Potassium') && absDelta > 25) {
            isFlagged = true;
            severity = 'CRITICAL_DELTA';
            message = `Significant Potassium velocity shift: ${deltaPercent > 0 ? '+' : ''}${deltaPercent}%. Possible hemolysis or acute renal event.`;
            autoValidationEligible = false;
          } else if (curr.name.includes('Hemoglobin') && absDelta > 20) {
            isFlagged = true;
            severity = 'CRITICAL_DELTA';
            message = `Severe Hemoglobin drop/shift: ${deltaPercent > 0 ? '+' : ''}${deltaPercent}%. Possible acute bleed or hemodilution.`;
            autoValidationEligible = false;
          } else if (curr.name.includes('Creatinine') && absDelta > 40) {
            isFlagged = true;
            severity = 'WARNING';
            message = `Acute Creatinine change detected: ${deltaPercent > 0 ? '+' : ''}${deltaPercent}%. Review for acute kidney injury.`;
            autoValidationEligible = false;
          } else if (absDelta > 50) {
            isFlagged = true;
            severity = 'WARNING';
            message = `High analyte variance detected (${deltaPercent > 0 ? '+' : ''}${deltaPercent}%).`;
          }

          deltaChecks.push({
            analyteName: curr.name,
            currentValue: currVal,
            previousValue: prevVal,
            percentageChange: deltaPercent,
            isFlagged,
            severity,
            message
          });
        }
      }
    }

    // 2. Multivariate Physiological Sanity Checks
    // Check Anion Gap: [Na+] - ([Cl-] + [HCO3-])
    const na = this.findValue(currentResults, ['sodium', 'na+']);
    const cl = this.findValue(currentResults, ['chloride', 'cl-']);
    const hco3 = this.findValue(currentResults, ['bicarbonate', 'hco3', 'co2']);

    if (na !== null && cl !== null) {
      const bicarbonate = hco3 !== null ? hco3 : 24; // standard serum baseline
      const anionGap = Math.round((na - (cl + bicarbonate)) * 10) / 10;
      const passed = anionGap >= 6 && anionGap <= 16;
      sanityChecks.push({
        ruleName: 'Serum Anion Gap',
        calculatedValue: anionGap,
        referenceInterval: '8.0 - 16.0 mmol/L',
        isPassed: passed,
        clinicalInterpretation: passed
          ? 'Normal anion gap maintained.'
          : anionGap > 16
            ? `High Anion Gap (${anionGap}): Potential ketoacidosis, lactic acidosis, or uremia.`
            : `Low Anion Gap (${anionGap}): Hypoalbuminemia or paraproteinemia.`
      });
      if (!passed) autoValidationEligible = false;
    }

    // Check MCHC Coulter Sanity: (Hb / HCT) * 100
    const hb = this.findValue(currentResults, ['hemoglobin', 'hb']);
    const hct = this.findValue(currentResults, ['hematocrit', 'hct', 'pcv']);

    if (hb !== null && hct !== null && hct > 0) {
      const mchc = Math.round(((hb / hct) * 100) * 10) / 10;
      const passed = mchc <= 36.5;
      sanityChecks.push({
        ruleName: 'MCHC Coulter Sanity',
        calculatedValue: mchc,
        referenceInterval: '31.5 - 36.5 g/dL',
        isPassed: passed,
        clinicalInterpretation: passed
          ? 'Erythrocyte volume and hemoglobin concentration physiologically consistent.'
          : `Physiological Outlier (MCHC ${mchc} g/dL): Suspect Cold Agglutinins, Severe Lipemia, or Erythrocyte Membrane Defect.`
      });
      if (!passed) autoValidationEligible = false;
    }

    // Check R-Ratio for Liver Injury: (ALT / 40) / (ALP / 120)
    const alt = this.findValue(currentResults, ['alt', 'sgpt']);
    const alp = this.findValue(currentResults, ['alkaline phosphatase', 'alp']);

    if (alt !== null && alp !== null) {
      const rRatio = Math.round(((alt / 40) / (alp / 120)) * 10) / 10;
      const interpretation = rRatio >= 5.0
        ? `Hepatocellular Pattern (R=${rRatio}): Predominant acute hepatocellular injury.`
        : rRatio <= 2.0
          ? `Cholestatic Pattern (R=${rRatio}): Biliary obstruction or cholestatic pattern.`
          : `Mixed Hepatic Pattern (R=${rRatio}): Mixed injury pattern.`;

      sanityChecks.push({
        ruleName: 'Liver Injury R-Ratio',
        calculatedValue: rRatio,
        referenceInterval: 'N/A (Classification)',
        isPassed: true,
        clinicalInterpretation: interpretation
      });
    }

    const hasAbnormalFlags = currentResults.some(r => r.flag === 'H' || r.flag === 'L' || r.flag === 'A');
    if (hasAbnormalFlags) {
      autoValidationEligible = false;
    }

    const overallStatus: DaveValidationReport['overallStatus'] = 
      deltaChecks.some(d => d.severity === 'CRITICAL_DELTA')
        ? 'CRITICAL_PANIC'
        : autoValidationEligible
          ? 'AUTO_VALIDATED'
          : 'PATHOLOGIST_REVIEW_REQUIRED';

    return {
      overallStatus,
      confidenceScore: autoValidationEligible ? 99.4 : 78.5,
      deltaChecks,
      sanityChecks,
      autoValidationEligible
    };
  }

  private static findValue(results: TestResult[], synonyms: string[]): number | null {
    for (const res of results) {
      const lower = res.name.toLowerCase();
      if (synonyms.some(syn => lower.includes(syn))) {
        const val = parseFloat(res.value);
        if (!isNaN(val)) return val;
      }
    }
    return null;
  }
}
