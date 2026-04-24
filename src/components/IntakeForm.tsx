import { useState } from 'react';
import type { IntakeData } from '../types';

const STATES_WITH_COUNTIES: Record<string, string[]> = {
  Georgia:      ['Fulton', 'DeKalb', 'Gwinnett', 'Cobb', 'Clayton'],
  California:   ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Alameda'],
  Texas:        ['Harris', 'Dallas', 'Travis', 'Bexar', 'Tarrant'],
  'New York':   ['New York', 'Kings', 'Queens', 'Bronx', 'Erie'],
  Florida:      ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange'],
};
const OFFENSE_TYPES = ['Misdemeanor', 'Non-Violent Felony', 'Drug Possession', 'Other'];
const STEPS = [
  { title: 'Your location',  sub: 'Where was your case handled?' },
  { title: 'Your record',    sub: 'Tell us about the offense.' },
  { title: 'Your goals',     sub: "Let's plan your path forward." },
];

interface Props { onSubmit: (d: IntakeData) => void; onBack: () => void }

export default function IntakeForm({ onSubmit, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>({
    state: '', county: '', offenseType: '', yearCompleted: '', employmentGoal: '', skills: '',
  });

  const set = (f: keyof IntakeData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setData(d => ({ ...d, [f]: e.target.value }));

  const canNext = [
    () => !!(data.state && data.county),
    () => !!(data.offenseType && data.yearCompleted),
    () => !!data.employmentGoal,
  ][step];

  const next = () => step < 2 ? setStep(s => s + 1) : onSubmit(data);
  const prev = () => step === 0 ? onBack() : setStep(s => s - 1);
  const years = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', background: '#fff',
    }}>

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 480, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <button className="btn-ghost" onClick={prev}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="card animate-up" style={{ width: '100%', maxWidth: 480, padding: '32px' }}>

        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: 'var(--red)',
            textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8,
          }}>
            {STEPS[step].sub}
          </p>
          <h2>{STEPS[step].title}</h2>
        </div>

        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="label">State</label>
              <select className="input-field" value={data.state} onChange={set('state')}>
                <option value="">Select your state…</option>
                {Object.keys(STATES_WITH_COUNTIES).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">County</label>
              <select className="input-field" value={data.county} onChange={set('county')} disabled={!data.state}>
                <option value="">Select county…</option>
                {(STATES_WITH_COUNTIES[data.state] ?? []).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="label">Offense type</label>
              <select className="input-field" value={data.offenseType} onChange={set('offenseType')}>
                <option value="">Select offense type…</option>
                {OFFENSE_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year sentence completed</label>
              <select className="input-field" value={data.yearCompleted} onChange={set('yearCompleted')}>
                <option value="">Select year…</option>
                {years.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="label">Employment goal</label>
              <input className="input-field"
                placeholder="e.g. Remote customer service, warehouse, tech support…"
                value={data.employmentGoal} onChange={set('employmentGoal')} />
            </div>
            <div>
              <label className="label">
                Skills & work history{' '}
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>(optional)</span>
              </label>
              <textarea className="input-field" rows={3}
                placeholder="e.g. Customer service, forklift certified, computer skills…"
                value={data.skills} onChange={set('skills')} />
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={next} disabled={!canNext()}>
            {step < 2 ? 'Continue' : 'Check eligibility'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4"
                stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: 'var(--text-dim)', maxWidth: 480, textAlign: 'center' }}>
        SecondPath does not store your information. This is not legal advice.
      </p>
    </div>
  );
}
