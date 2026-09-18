import { SectionHeader } from '../components/SectionHeader';
import { ProceduralCanvas, type ProceduralVariant } from '../components/ProceduralCanvas';
import { useInView } from '../hooks/useInView';

interface Props {
  id: string;
  eyebrow: string;
  headline: string;
  subline: string;
  variant: ProceduralVariant;
  features: { title: string; desc: string }[];
  /** Schematic chips — small labels rendered below the visual */
  chips?: string[];
  /** Section accent color hint for the glow ring around the visual */
  accent?: string;
  flip?: 'left' | 'right';
  fullBleedVisual?: boolean;
}

/**
 * Two-column section for the procedural scenes: header + features on one
 * side, an animated canvas visualization on the other.
 */
export function ProceduralSection({ id, eyebrow, headline, subline, variant, features, chips, flip = 'right', fullBleedVisual = false }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.15 });

  return (
    <section id={id} className={`section proc-section ${fullBleedVisual ? 'proc-section--bleed' : ''}`} aria-labelledby={`${id}-h`}>
      <div ref={ref} className="container-wide">
        <div className={`proc-section__grid proc-section__grid--${flip}`}>
          <div className="proc-section__visual" data-reveal="scale">
            <div className="proc-section__visual-frame">
              <div className="proc-section__visual-glow" aria-hidden />
              <ProceduralCanvas variant={variant} active={inView} />
              {chips && (
                <div className="proc-section__chips">
                  {chips.map((c) => (
                    <span key={c} className="proc-section__chip">{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="proc-section__text">
            <SectionHeader eyebrow={eyebrow} headline={headline} subline={subline} />
            <ul className="proc-section__features" style={{ marginTop: 'var(--sp-6)' }}>
              {features.map((f, i) => (
                <li key={f.title} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                  <span className="proc-section__feature-dot" aria-hidden />
                  <div>
                    <h3 className="proc-section__feature-title">{f.title}</h3>
                    <p className="proc-section__feature-desc">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        .proc-section__grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: var(--sp-7);
          align-items: center;
        }
        .proc-section__grid--left .proc-section__visual { order: 1; }
        .proc-section__grid--left .proc-section__text { order: 2; }
        .proc-section__grid--right .proc-section__visual { order: 2; }
        .proc-section__grid--right .proc-section__text { order: 1; }
        .proc-section__visual-frame {
          position: relative;
          aspect-ratio: 16 / 11;
          border-radius: var(--r-lg);
          background: linear-gradient(180deg, rgba(15, 16, 36, 0.8), rgba(7, 8, 21, 0.9));
          border: 1px solid var(--line-strong);
          overflow: hidden;
          box-shadow: var(--shadow-float);
        }
        .proc-section__visual-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168, 85, 247, 0.18), transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        .proc-section__visual-frame canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .proc-section__chips {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          pointer-events: none;
        }
        .proc-section__chip {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--r-pill);
          background: rgba(7, 8, 21, 0.7);
          border: 1px solid var(--line);
          color: var(--text-lo);
          backdrop-filter: blur(6px);
        }
        .proc-section__features {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }
        .proc-section__features li {
          display: flex;
          gap: var(--sp-4);
          padding: var(--sp-4);
          border-radius: var(--r-md);
          background: var(--bg-glass);
          border: 1px solid var(--line);
          backdrop-filter: blur(8px);
          transition: transform var(--dur) var(--ease-out), border-color var(--dur);
        }
        .proc-section__features li:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }
        .proc-section__feature-dot {
          width: 6px; height: 6px;
          margin-top: 8px;
          border-radius: 50%;
          background: var(--grad-brand);
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
          flex-shrink: 0;
        }
        .proc-section__feature-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-hi);
        }
        .proc-section__feature-desc {
          margin-top: 4px;
          font-size: 0.86rem;
          color: var(--text-mid);
          line-height: 1.55;
        }
        @media (max-width: 1024px) {
          .proc-section__grid {
            grid-template-columns: 1fr;
            gap: var(--sp-6);
          }
          .proc-section__grid--left .proc-section__visual,
          .proc-section__grid--right .proc-section__visual { order: 1; }
          .proc-section__grid--left .proc-section__text,
          .proc-section__grid--right .proc-section__text { order: 2; }
        }
      `}</style>
    </section>
  );
}
