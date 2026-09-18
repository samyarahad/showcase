import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  src: string;
  alt: string;
  /** URL shown in the fake browser chrome address bar */
  url?: string;
  caption?: string;
  /** Index label like "01 / 05" */
  index?: string;
  /** Disable the hover tilt (still keeps parallax) */
  parallax?: boolean;
}

/**
 * Premium screenshot presentation:
 *   - Realistic browser chrome (traffic lights + address bar)
 *   - Soft, deep drop shadow
 *   - Scroll-driven 3D perspective tilt (subtle, no nausea)
 *   - Mouse-hover tilt + glow follow
 *   - Lazy-loaded with fade-in
 */
export function ScreenshotFrame({
  src,
  alt,
  url = 'app.pixel-ping.io',
  caption,
  index,
  parallax = true,
}: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  // Scroll-driven parallax tilt — feels like the screenshot is "looking at you"
  useEffect(() => {
    if (reducedMotion || !parallax) return;
    const el = frameRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const t = (center - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, t));
      const rotX = clamped * -5;
      const translateY = clamped * 24;
      el.style.setProperty('--scroll-rot', `${rotX}deg`);
      el.style.setProperty('--scroll-ty', `${translateY}px`);
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

  // Mouse-hover tilt + glow follow
  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const el = frameRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--hover-rot-x', `${-py * 5}deg`);
        el.style.setProperty('--hover-rot-y', `${px * 6}deg`);
        glow.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        glow.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--hover-rot-x', '0deg');
      el.style.setProperty('--hover-rot-y', '0deg');
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <figure className="shot">
      {index && <div className="shot__index" data-reveal="fade">{index}</div>}

      <div className="shot__stage">
        <div
          ref={frameRef}
          className="shot__frame"
          style={{
            '--hover-rot-x': '0deg',
            '--hover-rot-y': '0deg',
            '--scroll-rot': '0deg',
            '--scroll-ty': '0px',
          } as React.CSSProperties}
        >
          <div className="shot__chrome">
            <div className="shot__lights">
              <span className="shot__light shot__light--red" />
              <span className="shot__light shot__light--yellow" />
              <span className="shot__light shot__light--green" />
            </div>
            <div className="shot__url">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{url}</span>
            </div>
            <div className="shot__actions">
              <span className="shot__action" />
              <span className="shot__action" />
              <span className="shot__action" />
            </div>
          </div>

          <div className="shot__media">
            <div ref={glowRef} className="shot__glow" aria-hidden style={{ '--gx': '50%', '--gy': '50%' } as React.CSSProperties} />
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s var(--ease-out)' }}
            />
            <div className="shot__placeholder" aria-hidden style={{ opacity: loaded ? 0 : 1 }}>
              <div className="shot__placeholder-logo">P&amp;P</div>
            </div>
          </div>
        </div>
        <div className="shot__shadow" aria-hidden />
      </div>

      {caption && <figcaption className="shot__caption">{caption}</figcaption>}

      <style>{`
        .shot {
          --hover-rot-x: 0deg;
          --hover-rot-y: 0deg;
          --scroll-rot: 0deg;
          --scroll-ty: 0px;
          margin: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-5);
        }

        .shot__index {
          position: absolute;
          top: -32px;
          right: 0;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          z-index: 2;
        }

        .shot__stage {
          position: relative;
          width: 100%;
          perspective: 2000px;
          perspective-origin: 50% 30%;
        }

        .shot__frame {
          position: relative;
          width: 100%;
          border-radius: var(--r-xl);
          background: linear-gradient(180deg, #161a21 0%, #0c0e12 100%);
          border: 1px solid rgba(70, 183, 255, 0.18);
          overflow: hidden;
          transform-style: preserve-3d;
          transform:
            perspective(2000px)
            rotateX(var(--scroll-rot))
            rotateX(var(--hover-rot-x))
            rotateY(var(--hover-rot-y))
            translateY(var(--scroll-ty));
          transition: transform 0.6s var(--ease-out), border-color 0.4s var(--ease-out);
          box-shadow: var(--shadow-screenshot);
          z-index: 2;
        }
        .shot__frame:hover {
          border-color: rgba(70, 183, 255, 0.35);
        }

        .shot__chrome {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background: linear-gradient(180deg, rgba(22, 26, 33, 0.55), rgba(11, 13, 16, 0.55));
        }
        .shot__lights {
          display: flex;
          gap: 6px;
        }
        .shot__light {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          opacity: 0.75;
        }
        .shot__light--red { background: #ff5f5a; }
        .shot__light--yellow { background: #ffbd2e; }
        .shot__light--green { background: #27c93f; }

        .shot__url {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: var(--r-pill);
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.07);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-lo);
          flex: 1;
          max-width: 320px;
          margin: 0 auto;
        }
        .shot__url svg { opacity: 0.6; flex-shrink: 0; }

        .shot__actions {
          display: flex;
          gap: 8px;
        }
        .shot__action {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.11);
        }

        .shot__media {
          position: relative;
          overflow: hidden;
          background: #0b0d10;
        }
        .shot__media img {
          width: 100%;
          height: auto;
          display: block;
        }

        .shot__glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            circle 220px at var(--gx, 50%) var(--gy, 50%),
            rgba(70, 183, 255, 0.18),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.4s var(--ease-out);
          z-index: 1;
        }
        .shot__frame:hover .shot__glow { opacity: 1; }

        .shot__placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #111318, #0b0d10);
          transition: opacity 0.4s var(--ease-out);
          z-index: 0;
        }
        .shot__placeholder-logo {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          background: var(--grad-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.4;
        }

        .shot__shadow {
          position: absolute;
          inset: 5% 5% -20% 5%;
          background: radial-gradient(ellipse at center, rgba(46, 125, 255, 0.22), transparent 70%);
          filter: blur(40px);
          z-index: 0;
          pointer-events: none;
          transform: translateY(20px);
        }

        .shot__caption {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.28em;
          color: var(--text-lo);
          text-transform: uppercase;
        }

        @media (prefers-reduced-motion: reduce) {
          .shot__frame {
            transform: none !important;
            transition: none !important;
          }
        }
        @media (max-width: 768px) {
          .shot__chrome { padding: 9px 12px; gap: var(--sp-3); }
          .shot__url { font-size: 0.66rem; padding: 4px 10px; max-width: 180px; }
          .shot__actions { display: none; }
        }
      `}</style>
    </figure>
  );
}
