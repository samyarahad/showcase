import { SectionHeader } from '../components/SectionHeader';
import { ScreenshotFrame } from '../components/ScreenshotFrame';
import { useInView } from '../hooks/useInView';
import { sectionIndex } from '../data/sections';

interface Props {
  id: string;
  eyebrow: string;
  headline: string;
  subline: string;
  screenshot: string;
  alt: string;
  url?: string;
  caption?: string;
  features: { title: string; desc: string }[];
  flip?: 'left' | 'right';
}

export function ScreenshotSection({ id, eyebrow, headline, subline, screenshot, alt, url, caption, features, flip = 'right' }: Props) {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id={id} className="section shot-section" aria-labelledby={`${id}-h`}>
      <div ref={ref} className="container-wide">
        <div className={`shot-section__grid shot-section__grid--${flip}`}>
          <div className="shot-section__media" data-reveal="scale">
            <ScreenshotFrame
              src={screenshot}
              alt={alt}
              url={url}
              caption={caption}
              index={sectionIndex(id)}
            />
          </div>
          <div className="shot-section__text">
            <SectionHeader eyebrow={eyebrow} headline={headline} subline={subline} index={sectionIndex(id)} />
            <ul className="shot-section__features" style={{ marginTop: 'var(--sp-7)' }}>
              {features.map((f, i) => (
                <li key={f.title} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                  <span className="shot-section__feature-index">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="shot-section__feature-title">{f.title}</h3>
                    <p className="shot-section__feature-desc">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        .shot-section__grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--sp-10);
          align-items: center;
        }
        .shot-section__grid--left .shot-section__media { order: 1; }
        .shot-section__grid--left .shot-section__text { order: 2; }
        .shot-section__grid--right .shot-section__media { order: 2; }
        .shot-section__grid--right .shot-section__text { order: 1; }

        .shot-section__features {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }
        .shot-section__features li {
          display: flex;
          gap: var(--sp-5);
          padding: var(--sp-5) 0;
          border-top: 1px solid var(--line);
          transition: padding 0.4s var(--ease-out);
        }
        .shot-section__features li:last-child { border-bottom: 1px solid var(--line); }
        .shot-section__features li:hover { padding-left: var(--sp-3); }
        .shot-section__feature-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: var(--accent);
          flex-shrink: 0;
          padding-top: 2px;
        }
        .shot-section__feature-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-hi);
          letter-spacing: -0.01em;
        }
        .shot-section__feature-desc {
          margin-top: 6px;
          font-size: 0.88rem;
          color: var(--text-mid);
          line-height: 1.55;
        }

        @media (max-width: 1024px) {
          .shot-section__grid {
            grid-template-columns: 1fr;
            gap: var(--sp-8);
          }
          .shot-section__grid--left .shot-section__media,
          .shot-section__grid--right .shot-section__media { order: 1; }
          .shot-section__grid--left .shot-section__text,
          .shot-section__grid--right .shot-section__text { order: 2; }
        }
      `}</style>
    </section>
  );
}
