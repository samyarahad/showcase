import { ProceduralCanvas } from '../components/ProceduralCanvas';
import { SplitText } from '../components/SplitText';
import { useInView } from '../hooks/useInView';
import { sectionIndex } from '../data/sections';

export function NetworkSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.2 });

  return (
    <section id="network" className="section section--full network" aria-labelledby="network-h">
      <div className="network__bg" aria-hidden>
        <ProceduralCanvas variant="network" active={inView} />
      </div>
      <div ref={ref} className="container network__content">
        <div className="network__top" data-reveal="fade">
          <span className="eyebrow">THE NETWORK</span>
          <span className="network__index">{sectionIndex('network')}</span>
        </div>
        <h2 id="network-h" className="h-display network__headline">
          <SplitText text={'Everything\nconnected.'} />
        </h2>
        <p className="h-large network__sub" data-reveal style={{ marginTop: 'var(--sp-6)' }}>
          One place to understand the moving parts of your network.
        </p>
        <div className="network__meta" data-reveal>
          <div className="network__meta-item">
            <span className="network__meta-label">Nodes</span>
            <span className="network__meta-value">∞</span>
          </div>
          <div className="network__meta-divider" />
          <div className="network__meta-item">
            <span className="network__meta-label">Routes</span>
            <span className="network__meta-value">Dynamic</span>
          </div>
          <div className="network__meta-divider" />
          <div className="network__meta-item">
            <span className="network__meta-label">Topology</span>
            <span className="network__meta-value">Mesh</span>
          </div>
        </div>
      </div>
      <style>{`
        .network {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .network__bg { position: absolute; inset: 0; z-index: 0; opacity: 0.7; }
        .network__content { position: relative; z-index: 1; max-width: 720px; }
        .network__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-4);
          margin-bottom: var(--sp-5);
        }
        .network__index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .network__headline { max-width: 14ch; }
        .network__sub { color: var(--text-mid); max-width: 44ch; }
        .network__meta {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          margin-top: var(--sp-7);
          padding: var(--sp-4) var(--sp-5);
          border-radius: var(--r-pill);
          background: rgba(6, 7, 19, 0.55);
          backdrop-filter: blur(12px);
          border: 1px solid var(--line);
          width: fit-content;
        }
        .network__meta-item { display: flex; flex-direction: column; gap: 4px; }
        .network__meta-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .network__meta-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-hi);
        }
        .network__meta-divider {
          width: 1px; height: 28px;
          background: var(--line-strong);
        }
        @media (max-width: 640px) {
          .network__meta { flex-wrap: wrap; gap: var(--sp-3); }
          .network__meta-divider { display: none; }
        }
      `}</style>
    </section>
  );
}
