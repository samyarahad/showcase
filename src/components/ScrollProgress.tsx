import { useEffect, useRef, useState } from 'react';

/**
 * Premium scroll indicator: thin gradient line at the very top + a small
 * percentage counter fixed to the bottom-right that fades in/out.
 */
export function ScrollProgress() {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const pctVal = Math.round(p * 100);
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleX(${p})`;
      }
      if (counterRef.current) {
        counterRef.current.style.opacity = p > 0.02 && p < 0.98 ? '1' : '0';
      }
      setPct(pctVal);
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
    <>
      <div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, pointerEvents: 'none' }}>
        <div
          ref={lineRef}
          style={{
            height: '100%',
            width: '100%',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            background: 'linear-gradient(90deg, #2e7dff, #46b7ff, #8bf3e6)',
            boxShadow: '0 0 6px rgba(70, 183, 255, 0.6)',
          }}
        />
      </div>

      <div
        ref={counterRef}
        aria-hidden
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '32px',
          zIndex: 90,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.18em',
          color: 'var(--text-lo)',
          background: 'rgba(7, 8, 10, 0.7)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: 'var(--r-pill)',
          border: '1px solid var(--line)',
          opacity: 0,
          transition: 'opacity 0.4s var(--ease-out)',
          fontVariantNumeric: 'tabular-nums',
          pointerEvents: 'none',
        }}
      >
        {String(pct).padStart(3, '0')} <span style={{ color: 'var(--accent)' }}>/</span> 100
      </div>
    </>
  );
}
