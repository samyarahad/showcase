import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Subtle custom cursor: a small dot that follows the pointer with a soft glow,
 * and a larger ring that trails behind with eased motion. Disabled on touch
 * devices and when prefers-reduced-motion is set.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    if (window.innerWidth < 880) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      const t = e.target as HTMLElement;
      const interactive = !!t.closest('a, button, [data-cursor="hover"]');
      ring.classList.toggle('is-hover', interactive);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(168, 85, 247, 0.55)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
          transition: 'width 0.25s var(--ease-out), height 0.25s var(--ease-out), border-color 0.25s, opacity 0.3s',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 0 8px rgba(168, 85, 247, 0.85), 0 0 18px rgba(99, 102, 241, 0.55)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
        }}
      />
      <style>{`
        .is-hover {
          width: 56px !important;
          height: 56px !important;
          border-color: rgba(99, 102, 241, 0.85) !important;
          background: rgba(99, 102, 241, 0.08);
        }
        @media (hover: none), (pointer: coarse) {
          [class*="cursor"] { display: none !important; }
        }
        @media (max-width: 880px) {
          [class*="cursor"] { display: none !important; }
        }
      `}</style>
    </>
  );
}
