import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Refined cursor: a small dot + a larger trailing ring.
 * Ring grows when hovering interactive elements and shows the element's
 * data-cursor-label text. Disabled on touch and reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    if (window.innerWidth < 980) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const labelEl = labelRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      const t = e.target as HTMLElement;
      const interactive = t.closest('a, button, [data-cursor]');
      if (interactive) {
        ring.classList.add('is-hover');
        const customLabel = interactive.getAttribute('data-cursor-label');
        setLabel(customLabel || '');
        labelEl.style.opacity = customLabel ? '1' : '0';
      } else {
        ring.classList.remove('is-hover');
        setLabel('');
        labelEl.style.opacity = '0';
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      labelEl.style.transform = `translate3d(${rx + 18}px, ${ry + 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      labelEl.style.opacity = '0';
      visible = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={labelRef} className="cursor-label" aria-hidden>{label}</div>
      <style>{`
        .cursor-dot, .cursor-ring, .cursor-label {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: screen;
          opacity: 0;
          transition: opacity 0.3s var(--ease-out);
        }
        .cursor-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.9);
        }
        .cursor-ring {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(168, 85, 247, 0.5);
          transition:
            opacity 0.3s var(--ease-out),
            width 0.4s var(--ease-out),
            height 0.4s var(--ease-out),
            border-color 0.4s var(--ease-out),
            background 0.4s var(--ease-out);
        }
        .cursor-ring.is-hover {
          width: 64px;
          height: 64px;
          border-color: rgba(168, 85, 247, 0.9);
          background: rgba(168, 85, 247, 0.06);
        }
        .cursor-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-hi);
          background: rgba(6, 7, 19, 0.85);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: var(--r-pill);
          border: 1px solid var(--line-strong);
          white-space: nowrap;
        }
        @media (hover: none), (pointer: coarse), (max-width: 980px) {
          .cursor-dot, .cursor-ring, .cursor-label { display: none !important; }
        }
      `}</style>
    </>
  );
}
