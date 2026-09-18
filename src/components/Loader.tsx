import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Premium intro loader: a counter 00 → 100 over ~2s, with the logo fading in.
 * Then the curtain slides up to reveal the hero.
 */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Skip animation entirely
      setCount(100);
      setDone(true);
      const t = setTimeout(onComplete, 200);
      return () => clearTimeout(t);
    }
    const start = performance.now();
    const duration = 2000;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        // Hold for 200ms, then animate curtain up
        setTimeout(() => setDone(true), 220);
        setTimeout(onComplete, 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, onComplete]);

  return (
    <div
      ref={rootRef}
      className={`loader ${done ? 'loader--done' : ''}`}
      aria-hidden={done}
      style={{ pointerEvents: done ? 'none' : 'auto' }}
    >
      <div className="loader__inner">
        <div className="loader__brand">
          <img src="./logo.webp" alt="" className="loader__logo" width={64} height={64} />
          <div className="loader__brand-text">
            <div className="loader__brand-name">PIXEL <span className="text-accent">&amp;</span> PING</div>
            <div className="loader__brand-tag">NETWORK · CONTROL</div>
          </div>
        </div>

        <div className="loader__counter">
          <span className="loader__count">{String(count).padStart(3, '0')}</span>
          <span className="loader__pct">%</span>
        </div>

        <div className="loader__bar" aria-hidden>
          <div className="loader__bar-fill" style={{ transform: `scaleX(${count / 100})` }} />
        </div>

        <div className="loader__hint">Preparing the experience…</div>
      </div>

      <div className="loader__curtain loader__curtain--top" aria-hidden />
      <div className="loader__curtain loader__curtain--bottom" aria-hidden />

      <style>{`
        .loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--bg-0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.4s var(--ease-out);
        }
        .loader--done { opacity: 0; }

        .loader__inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-6);
          transform: translateY(0);
          transition: transform 0.8s var(--ease-out), opacity 0.6s var(--ease-out);
        }
        .loader--done .loader__inner { transform: translateY(-30px); opacity: 0; }

        .loader__brand {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
        }
        .loader__logo {
          filter: hue-rotate(-62deg) saturate(1.15) drop-shadow(0 0 16px rgba(70, 183, 255, 0.5));
          animation: loader-logo-pulse 2s ease-in-out infinite;
        }
        .loader__brand-text { display: flex; flex-direction: column; gap: 2px; }
        .loader__brand-name {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .loader__brand-tag {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.32em;
          color: var(--text-lo);
        }

        .loader__counter {
          font-family: var(--font-display);
          font-size: clamp(5rem, 14vw, 11rem);
          font-weight: 200;
          line-height: 1;
          letter-spacing: -0.05em;
          color: var(--text-hi);
          display: flex;
          align-items: flex-start;
          gap: 0.2em;
        }
        .loader__count {
          font-variant-numeric: tabular-nums;
        }
        .loader__pct {
          font-size: 0.3em;
          margin-top: 0.4em;
          color: var(--accent);
          font-weight: 400;
        }

        .loader__bar {
          width: min(280px, 60vw);
          height: 1px;
          background: var(--line-strong);
          overflow: hidden;
        }
        .loader__bar-fill {
          height: 100%;
          width: 100%;
          transform-origin: left center;
          background: var(--grad-brand);
          box-shadow: 0 0 8px rgba(70, 183, 255, 0.6);
        }

        .loader__hint {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.32em;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .loader__curtain {
          position: absolute;
          left: 0;
          right: 0;
          height: 51%;
          background: var(--bg-0);
          z-index: 1;
          transition: transform 0.9s var(--ease-expo);
        }
        .loader__curtain--top { top: 0; transform: translateY(0); }
        .loader__curtain--bottom { bottom: 0; transform: translateY(0); }
        .loader--done .loader__curtain--top { transform: translateY(-100%); }
        .loader--done .loader__curtain--bottom { transform: translateY(100%); }

        @keyframes loader-logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader__logo { animation: none; }
          .loader__curtain { transition: none; }
          .loader--done .loader__curtain--top,
          .loader--done .loader__curtain--bottom { transform: none; }
        }
        @media (max-width: 560px) {
          .loader__counter { font-size: clamp(4rem, 18vw, 7rem); }
        }
      `}</style>
    </div>
  );
}
