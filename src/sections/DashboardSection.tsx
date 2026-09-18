import { SectionHeader } from '../components/SectionHeader';
import { ScreenshotFrame } from '../components/ScreenshotFrame';
import { useInView } from '../hooks/useInView';
import { sectionIndex } from '../data/sections';

const STATS = [
  { label: 'TOTAL USERS',         color: '#8bf3e6', desc: 'Every identity in your network' },
  { label: 'ACTIVE USERS',        color: '#46b7ff', desc: 'Currently provisioned access' },
  { label: 'ONLINE USERS',        color: '#46b7ff', desc: 'Connected right now' },
  { label: 'DAILY REQUESTS',      color: '#ffb454', desc: 'Aggregated across endpoints' },
  { label: 'ACTIVE SERVERS',      color: '#2e7dff', desc: 'Registered & responding' },
  { label: 'CLOUDFLARE ACCOUNTS', color: '#8bf3e6', desc: 'Linked infrastructure' },
  { label: 'TOTAL TRAFFIC',       color: '#46b7ff', desc: 'Sum across all routes' },
  { label: 'IP HEALTH',           color: '#ffb454', desc: 'Reachable / total' },
];

export function DashboardSection() {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id="dashboard" className="section dashboard" aria-labelledby="dashboard-h">
      <div ref={ref} className="container-wide">
        <SectionHeader
          eyebrow="DASHBOARD"
          headline="See everything\nat a glance."
          subline="A single panoramic view of users, servers, traffic and infrastructure health — every moving part, one screen."
          index={sectionIndex('dashboard')}
        />

        <div className="dashboard__layout">
          <div className="dashboard__shot" data-reveal="scale">
            <ScreenshotFrame
              src="./screenshot-dashboard.png"
              alt="Pixel & Ping dashboard — overview of users, servers, traffic and IP health"
              url="app.pixel-ping.io/dashboard"
              caption="Dashboard · Total panorama"
              index={sectionIndex('dashboard')}
            />
          </div>

          <div className="dashboard__side">
            <div className="dashboard__stats">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="dashboard__stat"
                  data-reveal
                  style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
                >
                  <span className="dashboard__stat-dot" style={{ background: s.color, boxShadow: `0 0 12px ${s.color}` }} aria-hidden />
                  <div>
                    <div className="dashboard__stat-label">{s.label}</div>
                    <div className="dashboard__stat-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .dashboard__layout {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: var(--sp-8);
          align-items: start;
          margin-top: var(--sp-10);
        }
        .dashboard__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-3);
          position: sticky;
          top: calc(var(--nav-h) + var(--sp-5));
        }
        .dashboard__stat {
          display: flex;
          align-items: flex-start;
          gap: var(--sp-3);
          padding: var(--sp-4);
          border-radius: var(--r-md);
          background: rgba(16, 19, 24, 0.42);
          border: 1px solid var(--line);
          backdrop-filter: blur(8px);
          transition: transform 0.4s var(--ease-out), border-color 0.4s, background 0.4s;
        }
        .dashboard__stat:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
          background: rgba(16, 19, 24, 0.62);
        }
        .dashboard__stat-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .dashboard__stat-label {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          color: var(--text-mid);
          text-transform: uppercase;
          line-height: 1.2;
        }
        .dashboard__stat-desc {
          margin-top: 6px;
          font-size: 0.72rem;
          color: var(--text-lo);
          line-height: 1.4;
        }
        @media (max-width: 1024px) {
          .dashboard__layout { grid-template-columns: 1fr; gap: var(--sp-7); }
          .dashboard__stats { position: static; grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .dashboard__stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
