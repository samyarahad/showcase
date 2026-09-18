import { HeroCanvas } from '../components/HeroCanvas';
import { SplitText } from '../components/SplitText';
import { useInView } from '../hooks/useInView';

export function HeroSection() {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id="hero" className="hero" aria-label="Pixel & Ping — Hero">
      <div className="hero__canvas" aria-hidden>
        <HeroCanvas />
      </div>

      <div ref={ref} className="hero__content">
        <div className="hero__brand" data-reveal="fade">
          <img src="./logo.webp" alt="Pixel & Ping logo" width={64} height={64} className="hero__logo" />
          <div className="hero__brand-text">
            <div className="hero__brand-name">PIXEL <span className="text-accent">&amp;</span> PING</div>
            <div className="hero__brand-tag">NETWORK · CONTROL · v1.1.1</div>
          </div>
        </div>

        <h1 className="hero__headline h-hero">
          <SplitText text={'Control your\nnetwork.\nSee everything.'} />
        </h1>

        <p className="hero__sub" data-reveal>
          A modern network management experience —<br />
          one view, one network, every moving part in its place.
        </p>

        <div className="hero__meta" data-reveal>
          <div className="hero__meta-item">
            <span className="hero__meta-label">Status</span>
            <span className="hero__meta-value">
              <span className="hero__meta-dot" aria-hidden /> Operational
            </span>
          </div>
          <div className="hero__meta-divider" aria-hidden />
          <div className="hero__meta-item">
            <span className="hero__meta-label">Modules</span>
            <span className="hero__meta-value">14 surfaces</span>
          </div>
          <div className="hero__meta-divider" aria-hidden />
          <div className="hero__meta-item">
            <span className="hero__meta-label">Experience</span>
            <span className="hero__meta-value">Showcase</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden>
        <span className="hero__scroll-label">SCROLL</span>
        <span className="hero__scroll-line" />
        <span className="hero__scroll-arrow">↓</span>
      </div>

      <div className="hero__corner hero__corner--tl" aria-hidden>
        <span className="hero__corner-label">N 35.6892°</span>
        <span className="hero__corner-label">E 51.3890°</span>
      </div>
      <div className="hero__corner hero__corner--tr" aria-hidden>
        <span className="hero__corner-label">EST. 2026</span>
      </div>
      <div className="hero__corner hero__corner--bl" aria-hidden>
        <span className="hero__corner-label">PIXEL &amp; PING</span>
      </div>
      <div className="hero__corner hero__corner--br" aria-hidden>
        <span className="hero__corner-label">01 / 19</span>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          padding: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero__canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero__content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: var(--container);
          margin: 0 auto;
          padding: var(--nav-h) clamp(1.5rem, 5vw, 4rem) 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--sp-6);
          pointer-events: none;
        }

        .hero__brand {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-3) var(--sp-4);
          border-radius: var(--r-pill);
          background: rgba(6, 7, 19, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid var(--line);
        }
        .hero__logo {
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.45));
          animation: hero-logo-float 6s ease-in-out infinite;
        }
        .hero__brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .hero__brand-name {
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.04em;
        }
        .hero__brand-tag {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          color: var(--text-lo);
          margin-top: 2px;
        }

        .hero__headline {
          max-width: 14ch;
          text-align: left;
        }

        .hero__sub {
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          line-height: 1.55;
          color: var(--text-mid);
          max-width: 44ch;
        }

        .hero__meta {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-3) var(--sp-5);
          border-radius: var(--r-pill);
          background: rgba(6, 7, 19, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid var(--line);
        }
        .hero__meta-item { display: flex; flex-direction: column; gap: 2px; }
        .hero__meta-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .hero__meta-value {
          font-size: 0.85rem;
          color: var(--text-hi);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .hero__meta-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 8px #2dd4bf;
          animation: hero-meta-pulse 2s ease-in-out infinite;
        }
        .hero__meta-divider {
          width: 1px;
          height: 24px;
          background: var(--line-strong);
        }

        .hero__scroll {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 3;
          opacity: 0.7;
          animation: hero-scroll-pulse 2.4s ease-in-out infinite;
        }
        .hero__scroll-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.4em;
          color: var(--text-lo);
        }
        .hero__scroll-line {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, transparent, var(--accent), transparent);
        }
        .hero__scroll-arrow {
          color: var(--accent);
          font-size: 0.85rem;
        }

        .hero__corner {
          position: absolute;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 4px;
          pointer-events: none;
        }
        .hero__corner--tl { top: calc(var(--nav-h) + 24px); left: clamp(1.5rem, 5vw, 4rem); }
        .hero__corner--tr { top: calc(var(--nav-h) + 24px); right: clamp(1.5rem, 5vw, 4rem); align-items: flex-end; }
        .hero__corner--bl { bottom: 32px; left: clamp(1.5rem, 5vw, 4rem); }
        .hero__corner--br { bottom: 32px; right: clamp(1.5rem, 5vw, 4rem); align-items: flex-end; }
        .hero__corner-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }

        @keyframes hero-logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes hero-meta-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #2dd4bf; }
          50% { opacity: 0.6; box-shadow: 0 0 4px #2dd4bf; }
        }
        @keyframes hero-scroll-pulse {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__logo, .hero__scroll, .hero__meta-dot { animation: none; }
        }
        @media (max-width: 768px) {
          .hero__content { padding-top: calc(var(--nav-h) + 24px); gap: var(--sp-5); }
          .hero__meta {
            flex-wrap: wrap;
            gap: var(--sp-3);
            padding: var(--sp-3);
          }
          .hero__meta-divider { display: none; }
          .hero__corner { display: none; }
          .hero__brand { padding: var(--sp-2) var(--sp-3); }
          .hero__logo { width: 44px; height: 44px; }
          .hero__brand-name { font-size: 0.82rem; }
          .hero__scroll-line { height: 36px; }
        }
      `}</style>
    </section>
  );
}
