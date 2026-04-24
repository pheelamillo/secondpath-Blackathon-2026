import { useState } from 'react';
import './index.css';
import Landing from './components/Landing';
import IntakeForm from './components/IntakeForm';
import EligibilityResult from './components/EligibilityResult';
import ActionPlan from './components/ActionPlan';
import { checkEligibility } from './lib/eligibility';
import type { IntakeData, EligibilityResult as EligibilityResultType, Screen } from './types';

const DEMO_INTAKE: IntakeData = {
  state: 'Georgia',
  county: 'Fulton',
  offenseType: 'Misdemeanor',
  yearCompleted: '2019',
  employmentGoal: 'Remote customer service',
  skills: 'Customer service, basic computer skills, reliable and punctual',
};

const DIANA_INTAKE: IntakeData = {
  state: 'California',
  county: 'Los Angeles',
  offenseType: 'Misdemeanor',
  yearCompleted: '2018',
  employmentGoal: 'Certified Nursing Assistant (CNA)',
  skills: 'Caregiving, patient support, CPR certified, compassionate and detail-oriented',
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResultType | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleIntakeSubmit = (data: IntakeData) => {
    const result = checkEligibility(data);
    setIntake(data);
    setEligibility(result);
    setScreen('eligibility');
  };

  const startDemo = () => {
    const result = checkEligibility(DEMO_INTAKE);
    setIntake(DEMO_INTAKE);
    setEligibility(result);
    setIsDemo(true);
    setScreen('eligibility');
  };

  const startDianaDemo = () => {
    const result = checkEligibility(DIANA_INTAKE);
    setIntake(DIANA_INTAKE);
    setEligibility(result);
    setIsDemo(true);
    setScreen('eligibility');
  };

  const reset = () => {
    setIntake(null);
    setEligibility(null);
    setIsDemo(false);
    setScreen('landing');
  };

  return (
    <>
      {screen === 'landing' && (
        <Landing onStart={() => setScreen('intake')} onDemo={startDemo} onDianaDemo={startDianaDemo} />
      )}
      {screen === 'intake' && (
        <IntakeForm onSubmit={handleIntakeSubmit} onBack={() => setScreen('landing')} />
      )}
      {screen === 'eligibility' && intake && eligibility && (
        <EligibilityResult
          intake={intake}
          result={eligibility}
          isDemo={isDemo}
          onGetPlan={() => setScreen('action-plan')}
          onBack={reset}
        />
      )}
      {screen === 'action-plan' && intake && eligibility && (
        <ActionPlan
          intake={intake}
          eligibility={eligibility}
          isDemo={isDemo}
          onBack={() => setScreen('eligibility')}
          onReset={reset}
        />
      )}
    </>
  );
}
