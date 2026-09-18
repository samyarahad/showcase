import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Lightweight WebGL-free hero canvas. Combines:
 *   - A drifting particle field with connection lines (Constellation)
 *   - A central glowing "core" with concentric rings
 *   - A subtle vignette that pulses with the core
 *
 * Uses Canvas 2D for ~60fps on most devices at a fraction of Three.js cost.
 * Falls back to a static frame for prefers-reduced-motion.
 */
export function HeroCanvas() {
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
    let particles: P[] = [];
    let t = 0;
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number; phase: number };

    function setup() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = w < 768;
      const count = reducedMotion ? 40 : isMobile ? 70 : 140;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.4,
        hue: 245 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // ---- Soft radial atmosphere ----
      const cx = w / 2;
      const cy = h / 2;
      const atmo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      atmo.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
      atmo.addColorStop(0.4, 'rgba(168, 85, 247, 0.04)');
      atmo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx!.fillStyle = atmo;
      ctx!.fillRect(0, 0, w, h);

      // ---- Particle network ----
      const maxD = Math.min(w, h) * 0.18;
      const maxD2 = maxD * maxD;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const d = Math.sqrt(d2);
            const a = (1 - d / maxD) * 0.18;
            ctx!.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 85%, 68%, ${a})`;
            ctx!.lineWidth = 0.55;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }
      }

      // Particles on top
      for (const p of particles) {
        const pulse = 0.7 + Math.sin(t * 0.8 + p.phase) * 0.3;
        ctx!.fillStyle = `hsla(${p.hue}, 90%, 72%, ${0.7 * pulse})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // ---- Central glowing core ----
      // Outer halo
      const haloR = 180 + Math.sin(t * 0.6) * 12;
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
      halo.addColorStop(0.3, 'rgba(99, 102, 241, 0.12)');
      halo.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx!.fill();

      // Rotating rings
      ctx!.save();
      ctx!.translate(cx, cy);
      for (let i = 0; i < 3; i++) {
        const ringR = 70 + i * 30 + Math.sin(t * 0.4 + i) * 6;
        const rot = t * (0.1 + i * 0.04) * (i % 2 === 0 ? 1 : -1);
        ctx!.rotate(rot);
        ctx!.strokeStyle = `rgba(168, 85, 247, ${0.32 - i * 0.08})`;
        ctx!.lineWidth = 0.8;
        ctx!.setLineDash(i === 0 ? [] : [4, 8]);
        ctx!.beginPath();
        ctx!.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.setLineDash([]);
        ctx!.rotate(-rot);
      }
      ctx!.restore();

      // Inner bright core
      const coreR = 28 + Math.sin(t * 1.2) * 4;
      const core = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.5);
      core.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      core.addColorStop(0.2, 'rgba(217, 70, 239, 0.6)');
      core.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
      core.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx!.fillStyle = core;
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
      ctx!.fill();

      // ---- Vignette ----
      const vig = ctx!.createRadialGradient(cx, cy, Math.min(w, h) * 0.3, cx, cy, Math.max(w, h) * 0.75);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, 'rgba(6, 7, 19, 0.7)');
      ctx!.fillStyle = vig;
      ctx!.fillRect(0, 0, w, h);

      t += 0.016;
      if (running) raf = requestAnimationFrame(draw);
    }

    setup();
    if (reducedMotion) {
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    let resizeTimer: number | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        if (reducedMotion) {
          running = true;
          draw();
          running = false;
          cancelAnimationFrame(raf);
        }
      }, 150);
    };
    window.addEventListener('resize', onResize);

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reducedMotion) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
