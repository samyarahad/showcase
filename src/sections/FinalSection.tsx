import { SplitText } from '../components/SplitText';
import { useInView } from '../hooks/useInView';
import { sectionIndex, SOCIAL_LINKS } from '../data/sections';

export function FinalSection() {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id="final" className="section section--full final" aria-labelledby="final-h">
      <div ref={ref} className="container final__content">
        <div className="final__top" data-reveal="fade">
          <span className="eyebrow">PIXEL &amp; PING</span>
          <span className="final__index">{sectionIndex('final')}</span>
        </div>

        <div className="final__logo" data-reveal="scale">
          <img src="./logo.webp" alt="" width={120} height={120} />
        </div>

        <h2 id="final-h" className="h-hero final__headline">
          <SplitText text={'One view.\nOne network.'} />
        </h2>

        <div className="final__cta-row" data-reveal>
          <a
            className="btn btn--brand final__cta"
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noreferrer noopener"
          >
            Join the channel
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            className="btn btn--ghost final__cta"
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noreferrer noopener"
          >
            Watch on YouTube
          </a>
        </div>

        <div className="final__line" data-reveal />
      </div>
      <style>{`
        .final {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .final__content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .final__top {
          display: flex;
          align-items: center;
          gap: var(--sp-5);
          margin-bottom: var(--sp-7);
        }
        .final__index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .final__logo {
          filter: hue-rotate(-62deg) saturate(1.15) drop-shadow(0 0 40px rgba(70, 183, 255, 0.45))
                  drop-shadow(0 0 100px rgba(46, 125, 255, 0.25));
          animation: final-float 6s ease-in-out infinite;
          margin-bottom: var(--sp-6);
        }
        .final__headline { text-align: center; max-width: 14ch; }
        .final__cta-row {
          margin-top: var(--sp-7);
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          flex-wrap: wrap;
          justify-content: center;
        }
        .final__line {
          margin-top: var(--sp-9);
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, var(--accent), transparent);
        }
        @keyframes final-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .final__logo { animation: none; }
        }
        @media (max-width: 768px) {
          .final__logo img { width: 90px; height: 90px; }
        }
      `}</style>
    </section>
  );
}
