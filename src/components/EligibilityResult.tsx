import type { IntakeData, EligibilityResult as EligibilityResultType } from '../types';

interface Props {
  intake: IntakeData;
  result: EligibilityResultType;
  isDemo: boolean;
  onGetPlan: () => void;
  onBack: () => void;
}

export default function EligibilityResult({ intake, result, isDemo, onGetPlan, onBack }: Props) {
  const isEligible = result.status === 'eligible';
  const { rule } = result;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px, 5vw, 48px) clamp(16px, 4vw, 24px)', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 540 }} className="animate-up">

        {/* Demo banner */}
        {isDemo && (
          <div style={{
            background: '#0A2342', borderRadius: 10, padding: '10px 16px',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#CC3333', flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#FFF8E7', fontWeight: 500 }}>
              <strong style={{ color: '#CC3333' }}>Demo mode</strong> — {intake.county} County, {intake.state} · {intake.offenseType} · {intake.yearCompleted}.
            </p>
          </div>
        )}

        {/* Status card */}
        <div style={{
          background: isEligible ? '#FFF0F0' : '#FFFBF0',
          border: `1px solid ${isEligible ? '#F5C5C5' : '#F0DFA0'}`,
          borderRadius: 12, padding: 'clamp(18px, 3vw, 24px)', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: isEligible ? '#FFE0E0' : '#FFF3CC',
              border: `1px solid ${isEligible ? '#F5C5C5' : '#F0DFA0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isEligible ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.5 9.5L7 13L14.5 5" stroke="#CC3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="#996B00" strokeWidth="1.5"/>
                  <path d="M9 6v4M9 11.5v.5" stroke="#996B00" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isEligible ? '#CC3333' : '#996B00', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                {isEligible ? '✓ Likely Eligible' : '◎ Needs Review'}
              </div>
              <p style={{ fontSize: 12, color: '#6B7074' }}>
                {intake.offenseType} · {intake.county} County, {intake.state}
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 'clamp(17px, 3vw, 20px)', color: '#0A2342', marginBottom: 10 }}>
            {isEligible
              ? `You may qualify for record relief in ${intake.county} County, ${intake.state}.`
              : `Your case in ${intake.county} County needs additional review.`}
          </h2>
          <p style={{ fontSize: 14, color: '#4A4E52', lineHeight: 1.65 }}>
            {isEligible
              ? `Based on your answers, you likely meet the ${rule?.waitYears}-year waiting period for ${rule?.process}. You've waited ${result.yearsWaited} year${result.yearsWaited !== 1 ? 's' : ''}.`
              : result.rule
              ? `You've waited ${result.yearsWaited} year${result.yearsWaited !== 1 ? 's' : ''}, but the waiting period is ${rule?.waitYears} years. A legal aid attorney can clarify your options.`
              : "We don't have exact rules for your jurisdiction yet — your action plan will explore what's available."}
          </p>
        </div>

        {/* Process details */}
        {rule && (
          <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '18px', marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 14 }}>
              Process Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'Process',     value: rule.process },
                { label: 'Timeline',    value: rule.timeline },
                { label: 'Filing Fee',  value: rule.fee },
                { label: 'Wait Period', value: `${rule.waitYears} years` },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: '#FAFAF9', border: '1px solid #E8E5E0' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A2342' }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: '#FAFAF9', border: '1px solid #E8E5E0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Courthouse</p>
              <p style={{ fontSize: 13, color: '#0A2342', marginBottom: 2 }}>{rule.courtAddress}</p>
              <p style={{ fontSize: 13, color: '#CC3333', fontWeight: 600 }}>{rule.courtPhone}</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{ fontSize: 15, color: '#0A2342', marginBottom: 4 }}>Get Your Second Path Plan</h3>
            <p style={{ fontSize: 13, color: '#6B7074' }}>Legal steps · Career guidance · Pre-filled court form</p>
          </div>
          <button className="btn-primary" onClick={onGetPlan}>Build my plan →</button>
        </div>

        <button className="btn-ghost" onClick={onBack} style={{ marginTop: 16 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8 2L3 6.5l5 4.5" stroke="#8A8E92" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Start over
        </button>
      </div>
    </div>
  );
}
