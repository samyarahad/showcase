import { ProceduralCanvas } from '../components/ProceduralCanvas';
import { useInView } from '../hooks/useInView';

export function NetworkSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.2 });

  return (
    <section id="network" className="section section--full network" aria-labelledby="network-h">
      <div className="network__bg" aria-hidden>
        <ProceduralCanvas variant="network" active={inView} />
      </div>
      <div ref={ref} className="container network__content">
        <span className="eyebrow" data-reveal>THE NETWORK</span>
        <h2 id="network-h" className="h-section" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
          Everything connected.
        </h2>
        <p className="h-sub" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
          One place to understand the moving parts of your network.
        </p>
      </div>
      <style>{`
        .network { position: relative; min-height: 100vh; display: flex; align-items: center; }
        .network__bg { position: absolute; inset: 0; z-index: 0; }
        .network__content { position: relative; z-index: 1; max-width: 720px; }
        .network__content .h-section { font-size: clamp(2.4rem, 5vw, 4rem); }
      `}</style>
    </section>
  );
}
