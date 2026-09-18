import { SectionHeader } from '../components/SectionHeader';
import { ProceduralCanvas, type ProceduralVariant } from '../components/ProceduralCanvas';
import { useInView } from '../hooks/useInView';
import { sectionIndex } from '../data/sections';

interface Props {
  id: string;
  eyebrow: string;
  headline: string;
  subline: string;
  variant: ProceduralVariant;
  features: { title: string; desc: string }[];
  chips?: string[];
  flip?: 'left' | 'right';
}

export function ProceduralSection({ id, eyebrow, headline, subline, variant, features, chips, flip = 'right' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.15 });

  return (
    <section id={id} className="section proc-section" aria-labelledby={`${id}-h`}>
      <div ref={ref} className="container-wide">
        <div className={`proc-section__grid proc-section__grid--${flip}`}>
          <div className="proc-section__visual" data-reveal="scale">
            <div className="proc-section__visual-frame">
              <div className="proc-section__visual-glow" aria-hidden />
              <ProceduralCanvas variant={variant} active={inView} />
              <div className="proc-section__overlay">
                <div className="proc-section__overlay-tl">
                  <span className="proc-section__overlay-dot" />
                  <span className="proc-section__overlay-text">LIVE PREVIEW</span>
                </div>
                <div className="proc-section__overlay-br">
                  <span className="proc-section__overlay-text">{sectionIndex(id)}</span>
                </div>
              </div>
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
            <SectionHeader eyebrow={eyebrow} headline={headline} subline={subline} index={sectionIndex(id)} />
            <ul className="proc-section__features" style={{ marginTop: 'var(--sp-7)' }}>
              {features.map((f, i) => (
                <li key={f.title} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                  <span className="proc-section__feature-index">{String(i + 1).padStart(2, '0')}</span>
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
          gap: var(--sp-10);
          align-items: center;
        }
        .proc-section__grid--left .proc-section__visual { order: 1; }
        .proc-section__grid--left .proc-section__text { order: 2; }
        .proc-section__grid--right .proc-section__visual { order: 2; }
        .proc-section__grid--right .proc-section__text { order: 1; }

        .proc-section__visual-frame {
          position: relative;
          aspect-ratio: 16 / 11;
          border-radius: var(--r-2xl);
          background:
            radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.06), transparent 60%),
            linear-gradient(180deg, rgba(15, 16, 36, 0.85), rgba(7, 8, 21, 0.95));
          border: 1px solid var(--line-strong);
          overflow: hidden;
          box-shadow: var(--shadow-float);
        }
        .proc-section__visual-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168, 85, 247, 0.14), transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        .proc-section__visual-frame canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .proc-section__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .proc-section__overlay-tl {
          position: absolute;
          top: 18px;
          left: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .proc-section__overlay-br {
          position: absolute;
          bottom: 18px;
          right: 18px;
        }
        .proc-section__overlay-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 8px #2dd4bf;
          animation: proc-pulse 1.8s ease-in-out infinite;
        }
        .proc-section__overlay-text {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--text-lo);
        }

        .proc-section__chips {
          position: absolute;
          bottom: 18px;
          left: 18px;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          pointer-events: none;
        }
        .proc-section__chip {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--r-pill);
          background: rgba(6, 7, 19, 0.7);
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
          gap: var(--sp-5);
          padding: var(--sp-5) 0;
          border-top: 1px solid var(--line);
          transition: padding 0.4s var(--ease-out);
        }
        .proc-section__features li:last-child { border-bottom: 1px solid var(--line); }
        .proc-section__features li:hover { padding-left: var(--sp-3); }
        .proc-section__feature-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: var(--accent);
          flex-shrink: 0;
          padding-top: 2px;
        }
        .proc-section__feature-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-hi);
          letter-spacing: -0.01em;
        }
        .proc-section__feature-desc {
          margin-top: 6px;
          font-size: 0.88rem;
          color: var(--text-mid);
          line-height: 1.55;
        }

        @keyframes proc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .proc-section__overlay-dot { animation: none; }
        }
        @media (max-width: 1024px) {
          .proc-section__grid {
            grid-template-columns: 1fr;
            gap: var(--sp-8);
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
