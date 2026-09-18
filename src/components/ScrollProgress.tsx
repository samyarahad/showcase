import { useEffect, useRef } from 'react';

/**
 * Subtle scroll progress indicator — a thin gradient line at the top of the
 * viewport whose width tracks the global scroll position.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${pct})`;
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
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 200,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        ref={ref}
        style={{
          height: '100%',
          width: '100%',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          background: 'linear-gradient(90deg, #6366f1, #a855f7, #d946ef)',
          boxShadow: '0 0 8px rgba(168, 85, 247, 0.55)',
        }}
      />
    </div>
  );
}
