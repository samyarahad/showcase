import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  src: string;
  alt: string;
  /** Optional caption label below the screenshot */
  caption?: string;
  /** Optional floating tilt on hover (desktop only) */
  tilt?: boolean;
  /** Apply a perspective tilt that responds to scroll position */
  parallax?: boolean;
}

/**
 * Premium screenshot presentation: a glass frame with subtle border glow,
 * scroll-driven 3D perspective tilt, and a soft reflection underneath.
 */
export function ScreenshotFrame({ src, alt, caption, tilt = true, parallax = true }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  // ---- Scroll-driven parallax tilt ----
  useEffect(() => {
    if (reducedMotion || !parallax) return;
    const el = frameRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: -1 when section is below viewport, 0 when centered, +1 when above
      const center = rect.top + rect.height / 2;
      const t = (center - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, t));
      const rotX = clamped * -8; // tilt as you scroll
      const translateY = clamped * 16;
      el.style.transform = `perspective(1600px) rotateX(${rotX}deg) translateY(${translateY}px)`;
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, parallax]);

  // ---- Mouse-driven hover tilt (desktop) ----
  useEffect(() => {
    if (reducedMotion || !tilt) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const el = frameRef.current;
    if (!el) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rotY = px * 6;
        const rotX = -py * 6;
        el.style.setProperty('--hover-rot-x', `${rotX}deg`);
        el.style.setProperty('--hover-rot-y', `${rotY}deg`);
        el.style.setProperty('--hover-tx', `${px * 8}px`);
        el.style.setProperty('--hover-ty', `${py * 8}px`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--hover-rot-x', '0deg');
      el.style.setProperty('--hover-rot-y', '0deg');
      el.style.setProperty('--hover-tx', '0px');
      el.style.setProperty('--hover-ty', '0px');
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, tilt]);

  return (
    <figure className="shot" style={{ '--hover-rot-x': '0deg', '--hover-rot-y': '0deg', '--hover-tx': '0px', '--hover-ty': '0px' } as React.CSSProperties}>
      <div className="shot__stage">
        <div
          ref={frameRef}
          className="shot__frame"
          style={{ transform: 'perspective(1600px) rotateX(0deg)' }}
        >
          <div className="shot__glow" aria-hidden />
          <div className="shot__chrome" aria-hidden>
            <span className="shot__dot" />
            <span className="shot__dot" />
            <span className="shot__dot" />
          </div>
          <div className="shot__media">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s var(--ease-out)' }}
            />
          </div>
        </div>
        <div className="shot__reflection" aria-hidden />
      </div>
      {caption && <figcaption className="shot__caption">{caption}</figcaption>}
      <style>{`
        .shot {
          --hover-rot-x: 0deg;
          --hover-rot-y: 0deg;
          --hover-tx: 0px;
          --hover-ty: 0px;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-4);
        }
        .shot__stage {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          perspective: 1600px;
        }
        .shot__frame {
          position: relative;
          width: 100%;
          border-radius: var(--r-lg);
          background: linear-gradient(180deg, #14162e, #0a0b1a);
          border: 1px solid var(--line-strong);
          padding: 10px;
          box-shadow: var(--shadow-float);
          transform-style: preserve-3d;
          transform: perspective(1600px) rotateX(var(--hover-rot-x)) rotateY(var(--hover-rot-y)) translate3d(var(--hover-tx), var(--hover-ty), 0);
          transition: transform 0.5s var(--ease-out), box-shadow 0.6s var(--ease-out);
        }
        .shot__frame:hover {
          box-shadow: var(--shadow-float), 0 0 0 1px rgba(168, 85, 247, 0.32), 0 0 80px -10px rgba(168, 85, 247, 0.45);
        }
        .shot__glow {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(168, 85, 247, 0.18));
          filter: blur(20px);
          opacity: 0.55;
          z-index: -1;
          pointer-events: none;
        }
        .shot__chrome {
          display: flex;
          gap: 6px;
          padding: 8px 10px 10px;
        }
        .shot__dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: rgba(255,255,255,0.18);
        }
        .shot__dot:nth-child(1) { background: rgba(255, 95, 86, 0.55); }
        .shot__dot:nth-child(2) { background: rgba(255, 189, 46, 0.55); }
        .shot__dot:nth-child(3) { background: rgba(39, 201, 63, 0.55); }
        .shot__media {
          position: relative;
          border-radius: var(--r-md);
          overflow: hidden;
          background: #0a0b1a;
          border: 1px solid rgba(124, 134, 178, 0.10);
        }
        .shot__media img {
          width: 100%;
          height: auto;
          display: block;
        }
        .shot__reflection {
          width: 88%;
          height: 40px;
          margin-top: -4px;
          background: radial-gradient(ellipse at center top, rgba(99, 102, 241, 0.16), transparent 70%);
          filter: blur(8px);
          opacity: 0.7;
          pointer-events: none;
        }
        .shot__caption {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.24em;
          color: var(--text-lo);
          text-transform: uppercase;
        }
        @media (prefers-reduced-motion: reduce) {
          .shot__frame { transform: none !important; transition: none !important; }
        }
        @media (max-width: 768px) {
          .shot__frame { padding: 6px; }
          .shot__chrome { padding: 6px; }
        }
      `}</style>
    </figure>
  );
}
