import { useState } from 'react';
import jsPDF from 'jspdf';
import type { IntakeData, EligibilityResult } from '../types';
import { generateGeorgiaRC1 } from '../lib/courtForm';
import employers from '../data/employers.json';
import legalAid from '../data/legalAid.json';

interface Plan {
  summary: string; legalSteps: string[]; workforceSteps: string[];
  resumeSummary: string; interviewScript: string;
  suggestedRoles: string[]; timeline: string;
}

interface Props {
  intake: IntakeData; eligibility: EligibilityResult;
  isDemo: boolean; onBack: () => void; onReset: () => void;
}

type Tab = 'legal' | 'career' | 'employers' | 'form' | 'legal-aid';
type FilingStage = 0 | 1 | 2 | 3 | 4;

const FILING_STAGES = [
  { label: 'Not started', desc: 'Begin your filing process' },
  { label: 'Form ready',  desc: 'Pre-filled form downloaded' },
  { label: 'Filed',       desc: 'Submitted to the courthouse' },
  { label: 'Pending',     desc: 'Awaiting court decision' },
  { label: 'Sealed ✓',   desc: 'Record restricted' },
];

function buildPlan(intake: IntakeData, eligibility: EligibilityResult): Plan {
  const { state, county, offenseType, yearCompleted, employmentGoal, skills } = intake;
  const eligible = eligibility.status === 'eligible';
  const rule = eligibility.rule;
  return {
    summary: eligible
      ? `Based on your ${offenseType?.toLowerCase()} record in ${county} County, ${state}, you appear to meet the eligibility requirements for record restriction. Clearing your record can unlock housing, employment, and licensing opportunities.`
      : `Your case in ${county} County may need additional review. You still have options — understanding them is the first step forward.`,
    legalSteps: rule ? rule.nextSteps : [
      'Contact your county court clerk to confirm expungement eligibility for your specific offense',
      'Request a certified copy of your criminal record from the state Department of Justice',
      'Consult a free legal aid clinic in your area for case-specific guidance',
      "Research your state's record restriction laws and applicable waiting periods",
    ],
    workforceSteps: [
      `Target "${employmentGoal || 'your goal field'}" roles at fair-chance employers`,
      'Complete a free skills certification (Google Career Certificates, Coursera)',
      'Build a one-page resume using the summary below — keep it skills-forward',
      'Practice your background disclosure script until it feels natural',
      'Apply to 5–10 fair-chance companies this week',
    ],
    resumeSummary: `Motivated professional with experience in ${skills || 'customer-facing and operational roles'}. Completed all requirements since ${yearCompleted} and actively pursuing growth in ${employmentGoal || 'a new field'}. Brings resilience, a strong work ethic, and a fresh perspective to every opportunity.`,
    interviewScript: `"I want to be upfront — I have a ${offenseType?.toLowerCase() || 'past record'} from ${yearCompleted}. I completed everything required of me, and since then I've focused on ${skills ? `developing skills in ${skills}` : 'personal and professional growth'}. I'm proud of where I stand and excited to contribute here."`,
    suggestedRoles: ['Customer Service Representative', 'Warehouse Associate', 'Delivery Driver', 'Call Center Agent', 'Maintenance Technician'],
    timeline: rule
      ? `If you begin filing this month, expect a decision within ${rule.timeline}. The sooner you file, the sooner doors open.`
      : 'Most cases resolve within 3–6 months of filing. Starting now — even just gathering records — puts you ahead.',
  };
}

export default function ActionPlan({ intake, eligibility, isDemo, onReset }: Props) {
  const [plan] = useState<Plan>(() => buildPlan(intake, eligibility));
  const [tab, setTab] = useState<Tab>('legal');
  const [downloaded, setDownloaded] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [generatingForm, setGeneratingForm] = useState(false);
  const [filingStage, setFilingStage] = useState<FilingStage>(0);
  const [copied, setCopied] = useState(false);

  const legalAidInfo = (legalAid as Record<string, { org: string; url: string; phone: string; note: string }>)[intake.state];

  const downloadGuidancePDF = () => {
    const doc = new jsPDF(); const M = 20; let y = M;
    const write = (t: string, size = 11, bold = false) => {
      doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(t, 170); doc.text(lines, M, y);
      y += lines.length * (size * 0.45) + 4; if (y > 270) { doc.addPage(); y = M; }
    };
    const sp = (h = 6) => { y += h; };
    write('SecondPath — Second Path Plan', 18, true); sp(2);
    write(`${intake.state} · ${intake.county} · ${intake.offenseType} · ${intake.yearCompleted}`, 10); sp(8);
    write(plan.summary); sp(8);
    write('Legal Next Steps', 14, true); sp(2); plan.legalSteps.forEach((s, i) => write(`${i + 1}. ${s}`)); sp(8);
    write('Workforce Steps', 14, true); sp(2); plan.workforceSteps.forEach((s, i) => write(`${i + 1}. ${s}`)); sp(8);
    write('Resume Summary', 14, true); sp(2); write(plan.resumeSummary); sp(8);
    write('Interview Script', 14, true); sp(2); write(plan.interviewScript); sp(8);
    write('Timeline', 14, true); sp(2); write(plan.timeline); sp(12);
    write('Not legal advice. Consult a licensed attorney for your specific situation.', 9);
    doc.save('secondpath-plan.pdf'); setDownloaded(true);
  };

  const downloadForm = async () => {
    setGeneratingForm(true);
    try {
      const bytes = await generateGeorgiaRC1(intake, eligibility);
      const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: 'GA-RC1-SecondPath.pdf' });
      a.click(); URL.revokeObjectURL(url);
      setFormDone(true);
      setFilingStage(1);
    } finally { setGeneratingForm(false); }
  };

  const emailPlan = () => {
    const subject = encodeURIComponent('My SecondPath Plan');
    const body = encodeURIComponent(
      `SecondPath — Second Path Plan\n` +
      `${intake.state} · ${intake.county} · ${intake.offenseType} · ${intake.yearCompleted}\n\n` +
      `${plan.summary}\n\n` +
      `LEGAL NEXT STEPS:\n${plan.legalSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n` +
      `TIMELINE: ${plan.timeline}\n\n` +
      `Visit secondpath.app to download your pre-filled court form.\n\n` +
      `---\nNot legal advice. Consult a licensed attorney.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'legal',     label: 'Legal Steps' },
    { key: 'career',    label: 'Career Plan' },
    { key: 'employers', label: 'Employers' },
    { key: 'form',      label: 'Court Form' },
    { key: 'legal-aid', label: 'Free Legal Help' },
  ];

  const Num = ({ n, amber }: { n: number; amber?: boolean }) => (
    <div style={{
      minWidth: 24, height: 24, borderRadius: 6, flexShrink: 0,
      background: amber ? '#FFFBF0' : '#FFF0F0',
      border: `1px solid ${amber ? '#F0DFA0' : '#F5C5C5'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 800, color: amber ? '#996B00' : '#CC3333',
    }}>{n}</div>
  );

  const Row = ({ children, last }: { children: React.ReactNode; last?: boolean }) => (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: last ? 'none' : '1px solid #E8E5E0' }}>
      {children}
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(24px, 4vw, 36px) clamp(16px, 4vw, 24px) 60px', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 640 }} className="animate-up">

        {/* Demo banner */}
        {isDemo && (
          <div style={{
            background: '#0A2342', borderRadius: 10, padding: '10px 16px',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#CC3333', flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#FFF8E7', fontWeight: 500 }}>
              <strong style={{ color: '#CC3333' }}>Demo mode</strong> — Marcus · Fulton County, GA · Misdemeanor · 2019
            </p>
          </div>
        )}

        {/* ── Filing status tracker ── */}
        <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              Filing Status
            </p>
            <p style={{ fontSize: 12, color: '#CC3333', fontWeight: 600 }}>
              {FILING_STAGES[filingStage].label}
            </p>
          </div>

          {/* Stage dots + line */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <div style={{
              position: 'absolute', top: 10, left: '5%', right: '5%',
              height: 2, background: '#E8E5E0', zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', top: 10, left: '5%',
              width: `${(filingStage / 4) * 90}%`,
              height: 2, background: '#CC3333', zIndex: 1,
              transition: 'width 0.4s ease',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {FILING_STAGES.map((stage, i) => (
                <button key={i} onClick={() => setFilingStage(i as FilingStage)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  minWidth: 0,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: i <= filingStage ? '#CC3333' : '#fff',
                    border: `2px solid ${i <= filingStage ? '#CC3333' : '#D4CFC8'}`,
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i < filingStage && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: i === filingStage ? 700 : 500,
                    color: i === filingStage ? '#CC3333' : i < filingStage ? '#4A4E52' : '#8A8E92',
                    whiteSpace: 'nowrap',
                  }}>
                    {stage.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#6B7074', textAlign: 'center', marginTop: 8 }}>
            {FILING_STAGES[filingStage].desc} · <span style={{ color: '#4A4E52' }}>Click a stage to update your progress</span>
          </p>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#CC3333', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
            ✓ Your Second Path Plan
          </div>
          <h2 style={{ color: '#0A2342', marginBottom: 8, fontSize: 'clamp(18px, 3vw, 24px)' }}>Here's your personalized path forward.</h2>
          <p style={{ color: '#4A4E52', fontSize: 15 }}>{plan.summary}</p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={downloadGuidancePDF} style={{ fontSize: 13, padding: '9px 18px' }}>
            {downloaded ? '✓ Downloaded' : '↓ Download Plan PDF'}
          </button>
          <button className="btn-secondary" onClick={emailPlan} style={{ fontSize: 13, padding: '9px 16px' }}>
            ✉ Email to myself
          </button>
          <button className="btn-secondary" onClick={copyLink} style={{ fontSize: 13, padding: '9px 16px' }}>
            {copied ? '✓ Copied!' : '⎘ Copy link'}
          </button>
          <button className="btn-ghost" onClick={onReset} style={{ fontSize: 13, marginLeft: 'auto' }}>
            Start over
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8E5E0', marginBottom: 22, overflowX: 'auto' }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '9px 14px', fontSize: 13, whiteSpace: 'nowrap',
              fontWeight: tab === key ? 700 : 500,
              color: tab === key ? '#0A2342' : '#8A8E92',
              borderBottom: tab === key ? '2px solid #CC3333' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s', fontFamily: 'inherit',
            }}>
              {key === 'form' && <span style={{ color: '#CC3333', marginRight: 4 }}>●</span>}
              {label}
            </button>
          ))}
        </div>

        {/* ── Legal Steps ── */}
        {tab === 'legal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>Legal Next Steps</p>
              {plan.legalSteps.map((step, i) => (
                <Row key={i} last={i === plan.legalSteps.length - 1}>
                  <Num n={i + 1} />
                  <p style={{ fontSize: 14, color: '#0A2342', lineHeight: 1.55 }}>{step}</p>
                </Row>
              ))}
            </div>
            {eligibility.rule && (
              <div style={{ background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 12, padding: '18px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Courthouse</p>
                <p style={{ fontSize: 14, color: '#0A2342', marginBottom: 3 }}>{eligibility.rule.courtAddress}</p>
                <p style={{ fontSize: 14, color: '#CC3333', fontWeight: 600, marginBottom: 10 }}>{eligibility.rule.courtPhone}</p>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span style={{ fontSize: 12, color: '#4A4E52' }}>Fee: <strong style={{ color: '#0A2342' }}>{eligibility.rule.fee}</strong></span>
                  <span style={{ fontSize: 12, color: '#4A4E52' }}>Timeline: <strong style={{ color: '#0A2342' }}>{eligibility.rule.timeline}</strong></span>
                </div>
              </div>
            )}
            <p style={{ fontSize: 13, color: '#4A4E52' }}><strong style={{ color: '#996B00' }}>Timeline — </strong>{plan.timeline}</p>
          </div>
        )}

        {/* ── Career Plan ── */}
        {tab === 'career' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>Workforce Steps</p>
              {plan.workforceSteps.map((step, i) => (
                <Row key={i} last={i === plan.workforceSteps.length - 1}>
                  <Num n={i + 1} amber />
                  <p style={{ fontSize: 14, color: '#0A2342', lineHeight: 1.55 }}>{step}</p>
                </Row>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Resume Summary</p>
              <p style={{ fontSize: 14, color: '#0A2342', lineHeight: 1.65, padding: '14px 16px', background: '#FAFAF9', borderRadius: 8, border: '1px solid #E8E5E0', fontStyle: 'italic' }}>"{plan.resumeSummary}"</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 6 }}>Interview Script</p>
              <p style={{ fontSize: 12, color: '#6B7074', marginBottom: 10 }}>When asked about your background:</p>
              <p style={{ fontSize: 14, color: '#0A2342', lineHeight: 1.65, padding: '14px 16px', background: '#FAFAF9', borderRadius: 8, border: '1px solid #E8E5E0', fontStyle: 'italic' }}>"{plan.interviewScript}"</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Suggested Roles</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {plan.suggestedRoles.map(role => (
                  <span key={role} style={{ padding: '6px 14px', borderRadius: 20, background: '#FFF0F0', border: '1px solid #F5C5C5', fontSize: 13, color: '#CC3333', fontWeight: 600 }}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Employers ── */}
        {tab === 'employers' && (
          <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 4 }}>Fair Chance Employers</p>
            <p style={{ fontSize: 13, color: '#6B7074', marginBottom: 20 }}>Companies known to hire people with records.</p>
            {employers.map((emp, i) => (
              <Row key={emp.company} last={i === employers.length - 1}>
                <div style={{ minWidth: 36, height: 36, borderRadius: 8, flexShrink: 0, background: '#FFF0F0', border: '1px solid #F5C5C5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#CC3333' }}>
                  {emp.company[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0A2342' }}>{emp.company}</span>
                    {emp.remote && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#FFF0F0', color: '#CC3333', border: '1px solid #F5C5C5', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Remote</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#6B7074' }}>{emp.industry} · {emp.note}</p>
                </div>
              </Row>
            ))}
          </div>
        )}

        {/* ── Court Form ── */}
        {tab === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 12, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
                <div style={{ minWidth: 42, height: 42, borderRadius: 10, flexShrink: 0, background: '#FFE0E0', border: '1px solid #F5C5C5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="1" width="14" height="18" rx="2" stroke="#CC3333" strokeWidth="1.5"/>
                    <path d="M7 6h6M7 10h6M7 14h4" stroke="#CC3333" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, color: '#0A2342', marginBottom: 4 }}>Georgia Petition for Record Restriction</h3>
                  <p style={{ fontSize: 13, color: '#4A4E52' }}>Form RC-1 · O.C.G.A. § 35-3-37 · {intake.county} County Superior Court</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#0A2342', lineHeight: 1.65, marginBottom: 18 }}>
                SecondPath has pre-filled this court form with your intake data. Download, complete the remaining fields, then bring it to the courthouse.
              </p>
              <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #E8E5E0', marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Pre-filled from your intake</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                  {[
                    { label: 'County',       value: intake.county },
                    { label: 'State',        value: intake.state },
                    { label: 'Offense',      value: intake.offenseType },
                    { label: 'Year',         value: intake.yearCompleted },
                    { label: 'Court',        value: `${intake.county} County Superior Court` },
                    { label: 'Eligibility',  value: eligibility.status === 'eligible' ? 'Likely Eligible' : 'Needs Review' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ fontSize: 10, color: '#8A8E92', marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0A2342' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#FFFBF0', borderRadius: 8, padding: '12px 14px', border: '1px solid #F0DFA0', marginBottom: 18 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#996B00', marginBottom: 8 }}>Still needs to be filled in:</p>
                {['Full legal name & date of birth', 'Current address & phone', 'Exact dates of arrest and disposition', 'Case number (from your court records)', 'Signature and date'].map(f => (
                  <p key={f} style={{ fontSize: 13, color: '#0A2342', marginBottom: 3 }}>· {f}</p>
                ))}
              </div>
              <button className="btn-primary" onClick={downloadForm} disabled={generatingForm} style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}>
                {generatingForm ? 'Generating…' : formDone ? '✓ Downloaded — check your downloads' : '↓ Download Pre-filled GA Form RC-1'}
              </button>
            </div>

            {/* Filing checklist */}
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>Filing Checklist</p>
              {[
                'Download and review your pre-filled RC-1 form',
                'Complete all remaining blank fields',
                'Gather your certified court records and case number',
                `Go to ${eligibility.rule?.courtAddress ?? 'the courthouse'} during business hours`,
                `Pay filing fee (${eligibility.rule?.fee ?? 'confirm with clerk'}) — ask about fee waivers`,
                'Get a date-stamped copy of your petition',
                `Follow up if no decision within ${eligibility.rule?.timeline ?? '90 days'}`,
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid #E8E5E0' : 'none' }}>
                  <div style={{ minWidth: 18, height: 18, borderRadius: 4, flexShrink: 0, border: '1.5px solid #D4CFC8', background: '#FAFAF9', marginTop: 2 }} />
                  <p style={{ fontSize: 14, color: '#0A2342', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Free Legal Help ── */}
        {tab === 'legal-aid' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {legalAidInfo ? (
              <div style={{ background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 12, padding: '24px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>
                  Free Legal Help in {intake.state}
                </p>
                <h3 style={{ fontSize: 17, color: '#0A2342', marginBottom: 6 }}>{legalAidInfo.org}</h3>
                <p style={{ fontSize: 14, color: '#4A4E52', marginBottom: 16, lineHeight: 1.6 }}>{legalAidInfo.note}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <a href={`tel:${legalAidInfo.phone}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '10px 18px', borderRadius: 9,
                    background: '#CC3333', color: '#fff',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  }}>
                    📞 {legalAidInfo.phone}
                  </a>
                  <a href={legalAidInfo.url} target="_blank" rel="noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '10px 18px', borderRadius: 9,
                    background: '#fff', color: '#0A2342',
                    fontWeight: 600, fontSize: 14, textDecoration: 'none',
                    border: '1px solid #D4CFC8',
                  }}>
                    ↗ Visit website
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ background: '#FFFBF0', border: '1px solid #F0DFA0', borderRadius: 12, padding: '24px' }}>
                <h3 style={{ fontSize: 16, color: '#0A2342', marginBottom: 8 }}>Find free legal help in {intake.state}</h3>
                <p style={{ fontSize: 14, color: '#4A4E52', marginBottom: 16 }}>
                  Search for legal aid organizations in your state at LawHelp.org — a national directory of free civil legal services.
                </p>
                <a href="https://www.lawhelp.org" target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '10px 18px', borderRadius: 9,
                  background: '#CC3333', color: '#fff',
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                }}>
                  ↗ Find help at LawHelp.org
                </a>
              </div>
            )}

            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>
                National Resources
              </p>
              {[
                { name: 'Reentry Council', desc: 'ABA resource guide for people with criminal records', url: 'https://www.americanbar.org/groups/criminal_justice/reentry/' },
                { name: 'Clean Slate Initiative', desc: 'Advocates for automatic record-clearing laws nationwide', url: 'https://cleanslateinitiative.org' },
                { name: 'Collateral Consequences Resource Center', desc: 'State-by-state guide to legal consequences of conviction', url: 'https://ccresourcecenter.org' },
              ].map((r, i, arr) => (
                <Row key={r.name} last={i === arr.length - 1}>
                  <div>
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: '#CC3333', textDecoration: 'none' }}>{r.name} ↗</a>
                    <p style={{ fontSize: 13, color: '#6B7074', marginTop: 2 }}>{r.desc}</p>
                  </div>
                </Row>
              ))}
            </div>
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 11, color: '#8A8E92', lineHeight: 1.5 }}>
          Not legal advice. Consult a licensed attorney for guidance specific to your case.
        </p>
      </div>
    </div>
  );
}
