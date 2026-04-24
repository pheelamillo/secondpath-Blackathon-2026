import rules from '../data/legalRules.json';
import type { IntakeData, EligibilityResult, LegalRule } from '../types';

export function checkEligibility(data: IntakeData): EligibilityResult {
  const currentYear = new Date().getFullYear();
  const yearsWaited = currentYear - parseInt(data.yearCompleted);

  const rule = (rules as LegalRule[]).find(
    (r) =>
      r.state.toLowerCase() === data.state.toLowerCase() &&
      r.county.toLowerCase() === data.county.toLowerCase() &&
      r.offenseType.toLowerCase() === data.offenseType.toLowerCase()
  );

  if (!rule) {
    return { status: 'review', rule: null, yearsWaited, meetsWaitPeriod: false };
  }

  const meetsWaitPeriod = yearsWaited >= rule.waitYears;

  if (!rule.eligible) {
    return { status: 'review', rule, yearsWaited, meetsWaitPeriod };
  }

  return {
    status: meetsWaitPeriod ? 'eligible' : 'review',
    rule,
    yearsWaited,
    meetsWaitPeriod,
  };
}
