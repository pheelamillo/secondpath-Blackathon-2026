import StateMap from './StateMap';
import ImpactTicker from './ImpactTicker';
import marcusImg from '../assets/marcus.jpg';
import dianaImg from '../assets/diana.jpg';

interface Props { onStart: () => void; onDemo: () => void; onDianaDemo: () => void }

export default function Landing({ onStart, onDemo, onDianaDemo }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 58,
        borderBottom: '1px solid #E8E5E0',
        position: 'sticky', top: 0, background: '#fff', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: '#0E1A2D',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="3.5" y1="13" x2="7" y2="1.5" stroke="#FAF3E0" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="13" x2="10.5" y2="1.5" stroke="#FAF3E0" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <circle cx="10.5" cy="1.5" r="2" fill="#C0392B"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0A2342', letterSpacing: '-0.4px' }}>
            SecondPath
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onDemo} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#4A4E52', padding: '7px 14px',
            fontFamily: 'inherit', fontWeight: 500,
          }}>
            See demo
          </button>
          <button className="btn-primary" onClick={onStart} style={{ fontSize: 13, padding: '8px 18px' }}>
            Get started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(48px, 8vw, 96px) clamp(20px, 5vw, 40px) 0',
        textAlign: 'center',
      }}>
        <div className="animate-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 13px', borderRadius: 20, marginBottom: 28,
            background: '#FFF0F0', border: '1px solid #F5C5C5',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC3333' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#CC3333', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              AI-powered record relief
            </span>
          </div>

          <h1 style={{ color: '#0A2342', marginBottom: 20, fontSize: 'clamp(32px, 6vw, 54px)' }}>
            Where AI once filtered<br />
            people out,{' '}
            <span style={{ color: '#CC3333' }}>we use it</span>
            <br />to bring them back.
          </h1>

          <p style={{
            maxWidth: 480, margin: '0 auto 36px',
            fontSize: 'clamp(15px, 2vw, 18px)', color: '#4A4E52', lineHeight: 1.7,
          }}>
            Answer a few questions. See your expungement eligibility.
            Get a personalized action plan and a pre-filled court form — in minutes.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onStart}
              style={{ fontSize: 16, padding: '14px 32px' }}>
              Check Your Second Path
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M3 7.5h9M8.5 4l4 3.5-4 3.5" stroke="white" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-secondary" onClick={onDemo}
              style={{ fontSize: 14, padding: '14px 22px' }}>
              ▶ Watch demo (30s)
            </button>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: '#8A8E92' }}>
            Free · No account needed · 2 minutes
          </p>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section style={{
        margin: 'clamp(40px, 6vw, 72px) clamp(20px, 5vw, 40px) 0',
        background: '#0A2342', borderRadius: 16, padding: 'clamp(28px, 4vw, 44px)',
        maxWidth: 780, alignSelf: 'center', width: 'calc(100% - 40px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#CC3333', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
            The Problem
          </p>
          <h2 style={{ color: '#FFF8E7', marginBottom: 10, fontSize: 'clamp(18px, 3vw, 26px)' }}>
            The lawyer barrier is the problem.
          </h2>
          <p style={{ color: '#6B7074', fontSize: 15, maxWidth: 500, margin: '0 auto 24px' }}>
            70 million Americans have a record. Most qualify for expungement. Almost none file — because they can't afford a lawyer.
          </p>
          {/* Inline stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 4vw, 48px)', flexWrap: 'wrap' }}>
            {[
              { value: '70M+', label: 'Americans with a record' },
              { value: '44',   label: 'States with expungement laws' },
              { value: '60%',  label: 'Eligible but never apply' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#FFF8E7', letterSpacing: '-1px', marginBottom: 2 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#6B7074' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Average lawyer fee', value: '$3,000', sub: 'Per expungement case', bad: true },
            { label: 'SecondPath cost', value: '$0', sub: 'Always free to use', bad: false },
            { label: 'Time with a lawyer', value: '3–6 mo', sub: 'Scheduling, paperwork, delays', bad: true },
            { label: 'Time with SecondPath', value: '2 min', sub: 'To your first action plan', bad: false },
          ].map(({ label, value, sub, bad }) => (
            <div key={label} style={{
              background: bad ? 'rgba(255,255,255,0.04)' : 'rgba(204,51,51,0.12)',
              border: `1px solid ${bad ? 'rgba(255,255,255,0.08)' : 'rgba(204,51,51,0.3)'}`,
              borderRadius: 12, padding: '20px',
            }}>
              <p style={{ fontSize: 11, color: '#6B7074', marginBottom: 8 }}>{label}</p>
              <p style={{
                fontSize: 30, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4,
                color: bad ? '#8A8E92' : '#FFF8E7',
                textDecoration: bad ? 'line-through' : 'none',
              }}>
                {value}
              </p>
              <p style={{ fontSize: 12, color: bad ? '#6B7074' : '#CC3333' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Case studies ── */}
      <section style={{
        padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 40px)',
        background: '#FAFAF9', borderTop: '1px solid #E8E5E0',
        marginTop: 'clamp(32px, 5vw, 56px)',
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#CC3333', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, textAlign: 'center' }}>
            Real stories
          </p>
          <h2 style={{ color: '#0A2342', textAlign: 'center', marginBottom: 8, fontSize: 'clamp(18px, 3vw, 24px)' }}>
            They did their time. They deserve a door.
          </h2>
          <p style={{ color: '#6B7074', fontSize: 14, textAlign: 'center', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
            Two people. Two paths blocked by one mistake. Watch SecondPath open both.
          </p>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>

            {/* Marcus card */}
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(10,35,66,0.07)' }}>
              {/* Photo strip */}
              <div style={{ display: 'flex', gap: 14, padding: '18px 18px 14px', alignItems: 'flex-end', borderBottom: '1px solid #F0EDE8' }}>
                <div style={{ width: 72, height: 90, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid #E8E5E0' }}>
                  <img src={marcusImg} alt="Marcus" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0A2342', marginBottom: 2 }}>Marcus, 34</p>
                  <p style={{ fontSize: 12, color: '#8A8E92', marginBottom: 8 }}>Atlanta, GA · Fulton County</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 20, padding: '3px 9px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#CC3333' }}>Wrongful Conviction · 2019</span>
                  </div>
                </div>
              </div>

              {/* Court record */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Court Record</p>
                {[
                  { label: 'Charge',    value: 'Simple Assault', red: false },
                  { label: 'Verdict',   value: 'Guilty — Forced Plea', red: false },
                  { label: 'Note',      value: 'No counsel — could not afford', red: true },
                  { label: 'Sentence',  value: '12 mo. probation', red: false },
                  { label: 'Completed', value: 'March 2020', red: false },
                ].map(({ label, value, red }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F8F6F3' }}>
                    <span style={{ fontSize: 11, color: '#8A8E92' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: red ? '#CC3333' : '#0A2342', textAlign: 'right', maxWidth: 160 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>His Journey</p>
                {[
                  { year: '2019', text: 'Witnesses said he was defending himself. No lawyer. Took the plea or face 2 years inside.', dim: true },
                  { year: '2020', text: 'Probation completed. Zero violations. Maintained his innocence throughout.', dim: true },
                  { year: '2021–25', text: 'Applied to 40+ jobs. That one checkbox ended every application.', dim: true },
                  { year: '2026 ✦', text: 'SecondPath: eligible, pre-filled form, filed free.', dim: false },
                ].map(({ year, text, dim }) => (
                  <div key={year} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: dim ? '#8A8E92' : '#CC3333', whiteSpace: 'nowrap', paddingTop: 1 }}>{year}</span>
                    <span style={{ fontSize: 12, color: dim ? '#8A8E92' : '#0A2342', lineHeight: 1.5, fontWeight: dim ? 400 : 600 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Goal + CTA */}
              {/* Quote */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8' }}>
                <div style={{ borderLeft: '3px solid #CC3333', paddingLeft: 12 }}>
                  <p style={{ fontSize: 13, color: '#4A4E52', lineHeight: 1.65, fontStyle: 'italic' }}>
                    "I didn't do it. But I couldn't afford a lawyer, so I took the plea. Now that checkbox follows me everywhere. I just want my name back."
                  </p>
                  <p style={{ fontSize: 11, color: '#8A8E92', marginTop: 6 }}>— Marcus, 34 · Atlanta</p>
                </div>
              </div>
              <div style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: 12, color: '#4A4E52', marginBottom: 14, lineHeight: 1.55 }}>
                  Goal: <strong style={{ color: '#0A2342' }}>Remote customer service.</strong> Wrongfully convicted because he couldn't afford counsel. SecondPath gives him his name back.
                </p>
                <button className="btn-primary" onClick={onDemo} style={{ fontSize: 13, padding: '10px 20px', width: '100%', justifyContent: 'center' }}>
                  ▶ Run Marcus's demo
                </button>
              </div>
            </div>

            {/* Diana card */}
            <div style={{ background: '#fff', border: '1px solid #E8E5E0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(10,35,66,0.07)' }}>
              {/* Photo strip */}
              <div style={{ display: 'flex', gap: 14, padding: '18px 18px 14px', alignItems: 'flex-end', borderBottom: '1px solid #F0EDE8' }}>
                <div style={{ width: 72, height: 90, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid #E8E5E0' }}>
                  <img src={dianaImg} alt="Diana" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0A2342', marginBottom: 2 }}>Diana, 31 · Mom of 2</p>
                  <p style={{ fontSize: 12, color: '#8A8E92', marginBottom: 8 }}>Los Angeles, CA · LA County</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FFF0F0', border: '1px solid #F5C5C5', borderRadius: 20, padding: '3px 9px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#CC3333' }}>Marijuana · Now Legal in CA</span>
                  </div>
                </div>
              </div>

              {/* Court record */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Court Record</p>
                {[
                  { label: 'Charge',    value: 'Marijuana Possession (HS 11357)', red: false },
                  { label: 'Verdict',   value: 'Guilty — Plea', red: false },
                  { label: 'Sentence',  value: '18 mo. probation', red: false },
                  { label: 'Completed', value: 'January 2020', red: false },
                  { label: 'CA Law',    value: 'Now legal under Prop 64 (2016)', red: true },
                ].map(({ label, value, red }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F8F6F3' }}>
                    <span style={{ fontSize: 11, color: '#8A8E92' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: red ? '#CC3333' : '#0A2342', textAlign: 'right', maxWidth: 160 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#8A8E92', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>Her Journey</p>
                {[
                  { year: '2016', text: 'California legalizes marijuana under Prop 64. Diana already had a conviction on her record.', dim: true },
                  { year: '2018–20', text: 'Convicted for marijuana possession. Completed probation. Two kids to raise alone.', dim: true },
                  { year: '2021–25', text: 'CNA license denied twice. Dispensaries opened on her block. Her record never changed.', dim: true },
                  { year: '2026 ✦', text: 'SecondPath: Prop 64 makes her eligible. Form filed. License path finally open.', dim: false },
                ].map(({ year, text, dim }) => (
                  <div key={year} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: dim ? '#8A8E92' : '#CC3333', whiteSpace: 'nowrap', paddingTop: 1 }}>{year}</span>
                    <span style={{ fontSize: 12, color: dim ? '#8A8E92' : '#0A2342', lineHeight: 1.5, fontWeight: dim ? 400 : 600 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Goal + CTA */}
              {/* Quote */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8' }}>
                <div style={{ borderLeft: '3px solid #CC3333', paddingLeft: 12 }}>
                  <p style={{ fontSize: 13, color: '#4A4E52', lineHeight: 1.65, fontStyle: 'italic' }}>
                    "They legalized it. They opened dispensaries on every corner. But my record is still there — and it's still keeping me from caring for people who need me."
                  </p>
                  <p style={{ fontSize: 11, color: '#8A8E92', marginTop: 6 }}>— Diana, 31 · Los Angeles</p>
                </div>
              </div>
              <div style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: 12, color: '#4A4E52', marginBottom: 14, lineHeight: 1.55 }}>
                  Goal: <strong style={{ color: '#0A2342' }}>Certified Nursing Assistant.</strong> Convicted for something California made legal. Prop 64 makes her eligible — SecondPath gets her there.
                </p>
                <button className="btn-primary" onClick={onDianaDemo} style={{ fontSize: 13, padding: '10px 20px', width: '100%', justifyContent: 'center' }}>
                  ▶ Run Diana's demo
                </button>
              </div>
            </div>

          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#8A8E92' }}>No sign-up · Free · 2 minutes</p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 40px)', borderTop: '1px solid #E8E5E0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#CC3333', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, textAlign: 'center' }}>
            How it works
          </p>
          <h2 style={{ color: '#0A2342', textAlign: 'center', marginBottom: 32, fontSize: 'clamp(18px, 3vw, 24px)' }}>
            From record to relief in 4 steps.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { n: '01', title: 'Answer questions', desc: 'State, offense, year completed — takes under 2 minutes.' },
              { n: '02', title: 'See eligibility',  desc: 'Instant rules-based result with your specific waiting period.' },
              { n: '03', title: 'Get your plan',    desc: 'Legal steps, career guidance, and fair-chance employers.' },
              { n: '04', title: 'Download form',    desc: 'Pre-filled court PDF, ready to sign and file.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ padding: '20px', border: '1px solid #E8E5E0', borderRadius: 12, background: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#CC3333', letterSpacing: '1px', marginBottom: 10 }}>{n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0A2342', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#6B7074', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projected Impact ── */}
      <div>
        <ImpactTicker />
      </div>

      {/* ── State coverage map ── */}
      <section style={{
        padding: 'clamp(32px, 5vw, 56px) clamp(20px, 5vw, 40px)',
        borderTop: '1px solid #E8E5E0',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#CC3333', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
            Coverage
          </p>
          <h2 style={{ color: '#0A2342', marginBottom: 8, fontSize: 'clamp(18px, 3vw, 24px)' }}>
            5 states. Expanding fast.
          </h2>
          <p style={{ color: '#6B7074', fontSize: 14, marginBottom: 28 }}>
            Georgia, California, Texas, New York, and Florida — covering 35% of the US population.
          </p>
          <StateMap />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '18px 32px', borderTop: '1px solid #E8E5E0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#fff', flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontSize: 12, color: '#8A8E92' }}>© 2026 SecondPath · Not legal advice</span>
        <span style={{ fontSize: 12, color: '#8A8E92' }}>Built for the people.</span>
      </footer>
    </div>
  );
}
