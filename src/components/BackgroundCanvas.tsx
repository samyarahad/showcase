import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Fixed full-viewport canvas that paints a slow, atmospheric particle network.
 * Uses Canvas 2D (no WebGL) for maximum reliability across browsers.
 * Density is automatically reduced on mobile / reduced-motion.
 */
export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
    const isTablet = () => window.matchMedia('(max-width: 1180px)').matches;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let particles: P[] = [];
    const MAX_LINK_DIST = 140;

    function setup() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = reducedMotion ? 0.00004 : isMobile() ? 0.00008 : isTablet() ? 0.00012 : 0.00016;
      const count = Math.max(28, Math.min(140, Math.floor(w * h * density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.4 + 0.4,
        hue: Math.random() < 0.5 ? 250 : 280, // indigo or violet
      }));
    }

    function step() {
      ctx!.clearRect(0, 0, w, h);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < MAX_LINK_DIST * MAX_LINK_DIST) {
            const dist = Math.sqrt(dist2);
            const alpha = (1 - dist / MAX_LINK_DIST) * 0.18;
            ctx!.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 80%, 65%, ${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx!.fillStyle = `hsla(${p.hue}, 85%, 70%, 0.7)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    let rafId = 0;
    setup();
    if (!reducedMotion) {
      rafId = requestAnimationFrame(step);
    } else {
      // Static frame
      step();
      cancelAnimationFrame(rafId);
    }

    let resizeTimer: number | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        if (reducedMotion) {
          step();
          cancelAnimationFrame(rafId);
        }
      }, 180);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: reducedMotion ? 0.35 : 0.85,
      }}
    />
  );
}
