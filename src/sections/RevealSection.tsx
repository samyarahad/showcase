import { ProceduralCanvas } from '../components/ProceduralCanvas';
import { SplitText } from '../components/SplitText';
import { useInView } from '../hooks/useInView';
import { sectionIndex } from '../data/sections';

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
        <div className="reveal__top" data-reveal="fade">
          <span className="eyebrow">THE FULL SYSTEM</span>
          <span className="reveal__index">{sectionIndex('reveal')}</span>
        </div>
        <h2 id="reveal-h" className="h-display reveal__headline">
          <SplitText text={'Everything is\nconnected.'} />
        </h2>
        <p className="h-large reveal__sub" data-reveal style={{ marginTop: 'var(--sp-6)' }}>
          One product. One view. One network.
        </p>

        <div className="reveal__modules" aria-hidden>
          {ORBIT_ITEMS.map((item, i) => (
            <span
              key={item}
              className="reveal__module"
              data-reveal
              style={{ '--reveal-delay': `${i * 40}ms` } as React.CSSProperties}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .reveal {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .reveal__bg { position: absolute; inset: 0; z-index: 0; opacity: 0.8; }
        .reveal__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .reveal__top {
          display: flex;
          align-items: center;
          gap: var(--sp-5);
          margin-bottom: var(--sp-4);
        }
        .reveal__index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .reveal__headline { text-align: center; max-width: 18ch; }
        .reveal__sub { color: var(--text-mid); text-align: center; }

        .reveal__modules {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--sp-2);
          margin-top: var(--sp-9);
          max-width: 900px;
        }
        .reveal__module {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          padding: 8px 14px;
          border-radius: var(--r-pill);
          background: rgba(6, 7, 19, 0.7);
          border: 1px solid var(--line);
          color: var(--text-lo);
          backdrop-filter: blur(8px);
          transition: all 0.4s var(--ease-out);
        }
        .reveal__module:hover {
          background: rgba(168, 85, 247, 0.12);
          border-color: var(--accent);
          color: var(--text-hi);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
