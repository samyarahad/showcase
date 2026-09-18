import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Lazy-load the 3D scene so the initial bundle stays small
const HeroScene = lazy(() =>
  import('../three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height;
      // Progress: 0 when hero is fully visible, 1 when scrolled fully past
      const p = Math.max(0, Math.min(1, -rect.top / total));
      setScrollProgress(p);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="section section--full hero"
      aria-label="Pixel & Ping — Hero"
    >
      <div className="hero__scene">
        <Suspense fallback={null}>
          <HeroScene scrollProgress={scrollProgress} />
        </Suspense>
      </div>

      <div className="hero__overlay container">
        <div className="hero__logo" data-reveal="scale">
          <img src="./logo.webp" alt="Pixel & Ping logo" width={120} height={120} />
        </div>
        <span className="hero__eyebrow eyebrow" data-reveal>
          PIXEL &amp; PING
        </span>
        <h1 className="hero__headline h-display" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
          Control your network.
          <br />
          <span className="text-gradient">See everything.</span>
        </h1>
        <p className="hero__sub h-sub" data-reveal style={{ marginTop: 'var(--sp-5)' }}>
          A modern network management experience.
        </p>
      </div>

      <div className="hero__scroll" aria-hidden={!reducedMotion}>
        <span className="hero__scroll-label">SCROLL</span>
        <span className="hero__scroll-line" />
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
        .hero__scene {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero__overlay {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: var(--nav-h);
          pointer-events: none;
        }
        .hero__logo {
          filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.45))
                  drop-shadow(0 0 80px rgba(99, 102, 241, 0.3));
          margin-bottom: var(--sp-5);
          animation: hero-logo-float 6s ease-in-out infinite;
        }
        .hero__logo img { width: 120px; height: 120px; }
        .hero__eyebrow {
          letter-spacing: 0.5em;
          font-size: 0.72rem;
          color: var(--accent-violet);
        }
        .hero__headline {
          max-width: 16ch;
          text-align: center;
        }
        .hero__sub {
          text-align: center;
          margin-inline: auto;
        }
        .hero__scroll {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          z-index: 3;
          opacity: 0.7;
          animation: hero-scroll-pulse 2.2s ease-in-out infinite;
        }
        .hero__scroll-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.4em;
          color: var(--text-lo);
        }
        .hero__scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, var(--accent-violet), transparent);
        }

        @keyframes hero-logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes hero-scroll-pulse {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__logo, .hero__scroll { animation: none; }
        }
        @media (max-width: 768px) {
          .hero__logo img { width: 90px; height: 90px; }
          .hero__scroll-line { height: 40px; }
        }
      `}</style>
    </section>
  );
}
