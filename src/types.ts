export interface IntakeData {
  state: string;
  county: string;
  offenseType: string;
  yearCompleted: string;
  employmentGoal: string;
  skills: string;
}

export interface LegalRule {
  state: string;
  stateCode: string;
  county: string;
  offenseType: string;
  waitYears: number;
  eligible: boolean;
  process: string;
  nextSteps: string[];
  courtAddress: string;
  courtPhone: string;
  fee: string;
  timeline: string;
}

export interface EligibilityResult {
  status: 'eligible' | 'review' | 'unknown';
  rule: LegalRule | null;
  yearsWaited: number;
  meetsWaitPeriod: boolean;
}

export type Screen = 'landing' | 'intake' | 'eligibility' | 'action-plan';
