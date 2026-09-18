import { SectionHeader } from '../components/SectionHeader';
import { ScreenshotFrame } from '../components/ScreenshotFrame';
import { useInView } from '../hooks/useInView';

const STATS = [
  { label: 'TOTAL USERS',          color: 'var(--accent-teal)' },
  { label: 'ACTIVE USERS',         color: 'var(--accent-violet)' },
  { label: 'ONLINE USERS',         color: 'var(--accent-teal)' },
  { label: 'DAILY REQUESTS',       color: 'var(--accent-amber)' },
  { label: 'ACTIVE SERVERS',       color: 'var(--accent-blue)' },
  { label: 'CLOUDFLARE ACCOUNTS',  color: 'var(--accent-teal)' },
  { label: 'TOTAL TRAFFIC',        color: 'var(--accent-pink)' },
  { label: 'IP HEALTH',            color: 'var(--accent-amber)' },
];

export function DashboardSection() {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id="dashboard" className="section dashboard" aria-labelledby="dashboard-h">
      <div ref={ref} className="container-wide">
        <SectionHeader
          eyebrow="DASHBOARD"
          headline="See everything at a glance."
          subline="A single panoramic view of users, servers, traffic and infrastructure health."
        />

        <div className="dashboard__grid" style={{ marginTop: 'var(--sp-7)' }}>
          <div className="dashboard__shot" data-reveal="scale">
            <ScreenshotFrame
              src="./screenshot-dashboard.png"
              alt="Pixel & Ping dashboard — overview of users, servers, traffic and IP health"
              caption="Pixel & Ping · Dashboard"
            />
          </div>

          <ul className="dashboard__stats">
            {STATS.map((s, i) => (
              <li key={s.label} data-reveal style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}>
                <span className="dashboard__stat-dot" style={{ background: s.color }} aria-hidden />
                <span className="dashboard__stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        .dashboard__grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: var(--sp-7);
          align-items: center;
        }
        .dashboard__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-3);
        }
        .dashboard__stats li {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-4);
          border-radius: var(--r-md);
          background: var(--bg-glass);
          border: 1px solid var(--line);
          backdrop-filter: blur(8px);
          transition: transform var(--dur) var(--ease-out), border-color var(--dur);
        }
        .dashboard__stats li:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }
        .dashboard__stat-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 12px currentColor;
          flex-shrink: 0;
        }
        .dashboard__stat-label {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--text-mid);
        }
        @media (max-width: 1024px) {
          .dashboard__grid { grid-template-columns: 1fr; gap: var(--sp-6); }
          .dashboard__stats { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .dashboard__stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
