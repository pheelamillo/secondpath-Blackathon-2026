import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(ease * target));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const STATS = [
  { target: 50000, label: 'eligibility checks (yr 1 projection)' },
  { target: 20000, label: 'action plans (yr 1 projection)' },
  { target: 7500,  label: 'court forms filed (yr 1 projection)' },
];

export default function ImpactTicker() {
  const c0 = useCountUp(STATS[0].target);
  const c1 = useCountUp(STATS[1].target);
  const c2 = useCountUp(STATS[2].target);
  const counters = [c0, c1, c2];

  return (
    <div style={{ background: '#0A2342', borderTop: '1px solid #1A3A5C', borderBottom: '1px solid #1A3A5C', padding: 'clamp(24px, 4vw, 36px) clamp(20px, 5vw, 40px)' }}>
      <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#CC3333', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24 }}>
        Projected Impact
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        maxWidth: 560, margin: '0 auto',
      }}>
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            ref={counters[i].ref}
            style={{
              textAlign: 'center',
              padding: 'clamp(12px, 2vw, 16px)',
              borderRight: i < 2 ? '1px solid #1A3A5C' : 'none',
            }}
          >
            <div style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#FFF8E7', letterSpacing: '-1px', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
              {counters[i].count.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#6B7074' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
