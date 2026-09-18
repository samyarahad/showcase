import { SectionHeader } from '../components/SectionHeader';
import { ScreenshotFrame } from '../components/ScreenshotFrame';
import { useInView } from '../hooks/useInView';

interface Props {
  id: string;
  eyebrow: string;
  headline: string;
  subline: string;
  screenshot: string;
  alt: string;
  caption: string;
  features: { title: string; desc: string }[];
  /** 'left' = screenshot on the left, 'right' = screenshot on the right */
  flip?: 'left' | 'right';
}

/**
 * Reusable two-column section: header + features on one side, screenshot on
 * the other. Alternates orientation per section for visual rhythm.
 */
export function ScreenshotSection({ id, eyebrow, headline, subline, screenshot, alt, caption, features, flip = 'right' }: Props) {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id={id} className="section shot-section" aria-labelledby={`${id}-h`}>
      <div ref={ref} className="container-wide">
        <div className={`shot-section__grid shot-section__grid--${flip}`}>
          <div className="shot-section__media" data-reveal="scale">
            <ScreenshotFrame src={screenshot} alt={alt} caption={caption} />
          </div>
          <div className="shot-section__text">
            <SectionHeader eyebrow={eyebrow} headline={headline} subline={subline} />
            <ul className="shot-section__features" style={{ marginTop: 'var(--sp-6)' }}>
              {features.map((f, i) => (
                <li key={f.title} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                  <span className="shot-section__feature-dot" aria-hidden />
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
          grid-template-columns: 1.4fr 1fr;
          gap: var(--sp-7);
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
          gap: var(--sp-4);
          padding: var(--sp-4);
          border-radius: var(--r-md);
          background: var(--bg-glass);
          border: 1px solid var(--line);
          backdrop-filter: blur(8px);
          transition: transform var(--dur) var(--ease-out), border-color var(--dur);
        }
        .shot-section__features li:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }
        .shot-section__feature-dot {
          width: 6px; height: 6px;
          margin-top: 8px;
          border-radius: 50%;
          background: var(--grad-brand);
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
          flex-shrink: 0;
        }
        .shot-section__feature-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-hi);
          letter-spacing: 0.01em;
        }
        .shot-section__feature-desc {
          margin-top: 4px;
          font-size: 0.86rem;
          color: var(--text-mid);
          line-height: 1.55;
        }
        @media (max-width: 1024px) {
          .shot-section__grid {
            grid-template-columns: 1fr;
            gap: var(--sp-6);
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
