import { ProceduralCanvas } from '../components/ProceduralCanvas';
import { useInView } from '../hooks/useInView';

const ORBIT_ITEMS = [
  'DASHBOARD', 'USERS', 'SERVERS', 'ENDPOINTS', 'IP SCANNER', 'PORTS',
  'CLOUDFLARE', 'CONFIG', 'TRAFFIC', 'ANALYTICS', 'FAILOVER', 'LOGS',
  'NOTIFICATIONS', 'SETTINGS',
];

export function RevealSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.2 });

  return (
    <section id="reveal" className="section section--full reveal" aria-labelledby="reveal-h">
      <div className="reveal__bg" aria-hidden>
        <ProceduralCanvas variant="reveal" active={inView} />
      </div>
      <div ref={ref} className="container reveal__content">
        <span className="eyebrow" data-reveal>THE FULL SYSTEM</span>
        <h2 id="reveal-h" className="h-section" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
          Everything is connected.
        </h2>
        <p className="h-sub" data-reveal style={{ marginTop: 'var(--sp-4)', marginInline: 'auto', textAlign: 'center' }}>
          One product. One view. One network.
        </p>

        <ul className="reveal__orbit" aria-hidden>
          {ORBIT_ITEMS.map((item, i) => (
            <li
              key={item}
              data-reveal
              style={{
                '--reveal-delay': `${i * 50}ms`,
                '--angle': `${(i / ORBIT_ITEMS.length) * 360}deg`,
              } as React.CSSProperties}
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .reveal {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .reveal__bg { position: absolute; inset: 0; z-index: 0; }
        .reveal__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .reveal__content .h-section { text-align: center; max-width: 18ch; }
        .reveal__orbit {
          position: relative;
          width: min(680px, 80vw);
          height: min(680px, 80vw);
          margin-top: var(--sp-7);
          display: grid;
          place-items: center;
        }
        .reveal__orbit li {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-46%) rotate(calc(var(--angle) * -1));
          padding: 4px 12px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          color: var(--text-lo);
          border: 1px solid var(--line);
          border-radius: var(--r-pill);
          background: rgba(7, 8, 21, 0.7);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          animation: reveal-orbit 30s linear infinite;
        }
        @keyframes reveal-orbit {
          from { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-46%) rotate(calc(var(--angle) * -1)); }
          to   { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 360deg)) translateY(-46%) rotate(calc((var(--angle) + 360deg) * -1)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal__orbit li { animation: none; }
        }
        @media (max-width: 768px) {
          .reveal__orbit { width: 90vw; height: 90vw; }
          .reveal__orbit li { font-size: 0.55rem; padding: 3px 8px; }
        }
      `}</style>
    </section>
  );
}
