import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type ProceduralVariant =
  | 'network'
  | 'grid-scan'
  | 'cloud'
  | 'config'
  | 'traffic'
  | 'analytics'
  | 'failover'
  | 'logs'
  | 'notifications'
  | 'reveal';

interface Props {
  variant: ProceduralVariant;
  /** Active state — when false, render a static frame */
  active?: boolean;
  className?: string;
}

/**
 * A single canvas component that renders many procedural visualizations.
 * All variants share a 2D canvas + rAF loop. Density auto-reduces on mobile
 * and when prefers-reduced-motion is set.
 */
export function ProceduralCanvas({ variant, active = true, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- Variant-specific state ----
    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let particles: P[] = [];
    let t = 0;
    let raf = 0;

    function seedNetwork() {
      const density = reducedMotion ? 0.00012 : isMobile() ? 0.00025 : 0.0005;
      const count = Math.max(20, Math.min(140, Math.floor(w * h * density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.8,
        hue: 245 + Math.random() * 35,
      }));
    }

    function seedTraffic() {
      const count = reducedMotion ? 60 : isMobile() ? 120 : 240;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0.4 + Math.random() * 1.4,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.3,
        hue: 220 + Math.random() * 60,
      }));
    }

    function seedReveal() {
      const count = reducedMotion ? 60 : 80;
      const cx = w / 2;
      const cy = h / 2;
      particles = Array.from({ length: count }, () => {
        const ang = Math.random() * Math.PI * 2;
        const r = 60 + Math.random() * Math.min(w, h) * 0.42;
        return {
          x: cx + Math.cos(ang) * r,
          y: cy + Math.sin(ang) * r,
          vx: 0,
          vy: 0,
          r: 1 + Math.random() * 2,
          hue: 240 + Math.random() * 50,
        };
      });
    }

    function seedLogs() {
      const count = reducedMotion ? 8 : isMobile() ? 12 : 18;
      particles = Array.from({ length: count }, () => ({
        x: 0,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        r: 0,
        hue: 0,
      }));
    }

    function init() {
      if (variant === 'network' || variant === 'cloud' || variant === 'config') seedNetwork();
      else if (variant === 'traffic') seedTraffic();
      else if (variant === 'reveal') seedReveal();
      else if (variant === 'logs') seedLogs();
      else if (variant === 'notifications') seedNetwork();
      else if (variant === 'analytics' || variant === 'failover' || variant === 'grid-scan') {
        // No particles for these
      }
    }
    init();

    // ---- Variant-specific draw ----
    function drawNetwork(alpha: number) {
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
          const maxD = 130;
          if (d2 < maxD * maxD) {
            const d = Math.sqrt(d2);
            const a = (1 - d / maxD) * 0.32 * alpha;
            ctx!.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 85%, 68%, ${a})`;
            ctx!.lineWidth = 0.7;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx!.fillStyle = `hsla(${p.hue}, 90%, 72%, ${0.8 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawGridScan(alpha: number) {
      const grid = 36;
      ctx!.strokeStyle = `rgba(99, 102, 241, ${0.08 * alpha})`;
      ctx!.lineWidth = 1;
      for (let x = 0; x <= w; x += grid) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let y = 0; y <= h; y += grid) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }
      // Scanning sweep
      const scanX = (t * 60) % (w + 200) - 100;
      const grad = ctx!.createLinearGradient(scanX - 80, 0, scanX + 80, 0);
      grad.addColorStop(0, 'rgba(168, 85, 247, 0)');
      grad.addColorStop(0.5, `rgba(168, 85, 247, ${0.28 * alpha})`);
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(scanX - 80, 0, 160, h);

      // Nodes
      const nodeCount = reducedMotion ? 6 : isMobile() ? 10 : 16;
      for (let i = 0; i < nodeCount; i++) {
        const px = (i * 137) % w;
        const py = ((i * 79) % h);
        const pulse = (Math.sin(t * 1.4 + i * 0.7) + 1) * 0.5;
        ctx!.fillStyle = `rgba(168, 85, 247, ${(0.4 + pulse * 0.5) * alpha})`;
        ctx!.beginPath();
        ctx!.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawCloud(alpha: number) {
      // Soft cloud-like blobs with data paths
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 + t * 0.15;
        const r = 80 + Math.sin(t * 0.6 + i) * 20;
        const x = cx + Math.cos(ang) * r * 1.5;
        const y = cy + Math.sin(ang) * r * 0.9;
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, 120);
        grad.addColorStop(0, `rgba(168, 85, 247, ${0.18 * alpha})`);
        grad.addColorStop(0.5, `rgba(99, 102, 241, ${0.08 * alpha})`);
        grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(x, y, 120, 0, Math.PI * 2);
        ctx!.fill();
      }
      // Data paths
      ctx!.strokeStyle = `rgba(168, 85, 247, ${0.3 * alpha})`;
      ctx!.lineWidth = 0.8;
      for (let i = 0; i < 8; i++) {
        const offset = (t * 0.4 + i * 0.4) % 1;
        const sx = (i / 8) * w;
        ctx!.beginPath();
        ctx!.moveTo(sx, 0);
        ctx!.quadraticCurveTo(cx + Math.sin(t + i) * 80, cy, sx + 80, h);
        ctx!.stroke();
      }
    }

    function drawConfig(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      // Central config object
      const r = 50 + Math.sin(t * 0.8) * 4;
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
      grad.addColorStop(0, `rgba(168, 85, 247, ${0.55 * alpha})`);
      grad.addColorStop(0.5, `rgba(99, 102, 241, ${0.25 * alpha})`);
      grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 2, 0, Math.PI * 2);
      ctx!.fill();

      // Incoming parameter lines
      const paramCount = 10;
      for (let i = 0; i < paramCount; i++) {
        const ang = (i / paramCount) * Math.PI * 2;
        const dist = 200 + Math.sin(t * 0.6 + i) * 30;
        const px = cx + Math.cos(ang) * dist;
        const py = cy + Math.sin(ang) * dist;
        const flow = (t * 0.5 + i * 0.3) % 1;

        ctx!.strokeStyle = `rgba(168, 85, 247, ${0.18 * alpha})`;
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.moveTo(px, py);
        ctx!.lineTo(cx, cy);
        ctx!.stroke();

        // Moving dot
        const dx = px + (cx - px) * flow;
        const dy = py + (cy - py) * flow;
        ctx!.fillStyle = `rgba(217, 70, 239, ${0.85 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawTraffic(alpha: number) {
      for (const p of particles) {
        p.x += p.vx;
        if (p.x > w + 10) p.x = -10;
        // Subtle wave
        p.y += Math.sin(t * 0.5 + p.x * 0.02) * 0.15;

        ctx!.fillStyle = `hsla(${p.hue}, 90%, 72%, ${0.7 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();

        // Trailing streak
        const grad = ctx!.createLinearGradient(p.x - 20, p.y, p.x, p.y);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 72%, 0)`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 72%, ${0.3 * alpha})`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(p.x - 20, p.y - 0.5, 20, 1);
      }
    }

    function drawAnalytics(alpha: number) {
      // Three chart lines that form gradually
      const pad = 24;
      const cw = w - pad * 2;
      const ch = h - pad * 2;
      const lines = 3;
      for (let l = 0; l < lines; l++) {
        const hue = 245 + l * 15;
        ctx!.strokeStyle = `hsla(${hue}, 85%, 68%, ${0.7 * alpha})`;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        const samples = 50;
        for (let i = 0; i <= samples; i++) {
          const x = pad + (i / samples) * cw;
          const phase = t * 0.6 + l * 1.3 + i * 0.18;
          const y = pad + ch / 2 + Math.sin(phase) * ch * 0.32 + Math.cos(phase * 0.7) * ch * 0.1;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
      // Faint grid
      ctx!.strokeStyle = `rgba(124, 134, 178, ${0.12 * alpha})`;
      ctx!.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad + (i / 4) * ch;
        ctx!.beginPath();
        ctx!.moveTo(pad, y);
        ctx!.lineTo(w - pad, y);
        ctx!.stroke();
      }
    }

    function drawFailover(alpha: number) {
      const pad = 32;
      const cy = h / 2;
      const phase = (Math.sin(t * 0.6) + 1) / 2; // 0..1 oscillation

      // Primary route (dimming)
      ctx!.strokeStyle = `rgba(99, 102, 241, ${(0.3 + (1 - phase) * 0.5) * alpha})`;
      ctx!.lineWidth = 2.4;
      ctx!.beginPath();
      ctx!.moveTo(pad, cy - 30);
      ctx!.lineTo(w - pad, cy - 30);
      ctx!.stroke();

      // Alternate route (brightening)
      ctx!.strokeStyle = `rgba(217, 70, 239, ${(0.3 + phase * 0.6) * alpha})`;
      ctx!.lineWidth = 2.4;
      ctx!.setLineDash([6, 6]);
      ctx!.beginPath();
      ctx!.moveTo(pad, cy + 30);
      ctx!.bezierCurveTo(w * 0.3, cy + 80, w * 0.7, cy + 80, w - pad, cy + 30);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Endpoints
      for (const x of [pad, w - pad]) {
        for (const yy of [cy - 30, cy + 30]) {
          ctx!.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
          ctx!.beginPath();
          ctx!.arc(x, yy, 4, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Status label
      ctx!.font = '500 11px "JetBrains Mono", monospace';
      ctx!.fillStyle = `rgba(168, 85, 247, ${0.7 * alpha})`;
      ctx!.textAlign = 'center';
      ctx!.fillText(phase > 0.5 ? 'CONNECTED — ALTERNATE ROUTE' : 'PRIMARY ROUTE', w / 2, 24);
    }

    function drawLogs(alpha: number) {
      // Stream of abstract log lines
      ctx!.font = '500 11px "JetBrains Mono", monospace';
      const lineCount = isMobile() ? 10 : 16;
      const lineH = h / lineCount;
      for (let i = 0; i < lineCount; i++) {
        const y = i * lineH + lineH * 0.6;
        const shift = Math.sin(t * 0.4 + i * 0.3) * 4;
        const opacity = (0.15 + (i / lineCount) * 0.5) * alpha;

        // Timestamp
        ctx!.fillStyle = `rgba(140, 150, 180, ${opacity * 0.7})`;
        ctx!.textAlign = 'left';
        ctx!.fillText(`12:${(40 + i).toString().padStart(2, '0')}:${(i * 7 % 60).toString().padStart(2, '0')}`, 16, y + shift);

        // Level chip
        const levels = ['INFO', 'OK', 'WARN', 'INFO', 'OK'];
        const lvl = levels[i % levels.length];
        const lvlColors: Record<string, string> = {
          INFO: `rgba(99, 102, 241, ${opacity})`,
          OK: `rgba(45, 212, 191, ${opacity})`,
          WARN: `rgba(245, 158, 11, ${opacity})`,
        };
        ctx!.fillStyle = lvlColors[lvl];
        ctx!.fillText(lvl.padEnd(5, ' '), 100, y + shift);

        // Abstract event text
        ctx!.fillStyle = `rgba(200, 204, 224, ${opacity * 0.85})`;
        const dots = '.'.repeat((i * 13) % 40 + 8);
        ctx!.fillText(`endpoint-${(i % 5) + 1} ${dots} ok`, 160, y + shift);
      }
    }

    function drawNotifications(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      // Pulse rings
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.5 + i * 0.4) % 1;
        const r = 30 + phase * 200;
        const a = (1 - phase) * 0.6 * alpha;
        ctx!.strokeStyle = `rgba(168, 85, 247, ${a})`;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.stroke();
      }
      // Center bell dot
      ctx!.fillStyle = `rgba(255, 255, 255, ${0.85 * alpha})`;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx!.fill();
      // Soft glow
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 60);
      grad.addColorStop(0, `rgba(168, 85, 247, ${0.4 * alpha})`);
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawReveal(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      // Lines from particles to center
      for (const p of particles) {
        const pulse = (Math.sin(t * 0.8 + p.x * 0.01) + 1) * 0.5;
        ctx!.strokeStyle = `rgba(168, 85, 247, ${(0.18 + pulse * 0.18) * alpha})`;
        ctx!.lineWidth = 0.6;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(cx, cy);
        ctx!.stroke();

        // Slow orbit
        const dx = p.x - cx;
        const dy = p.y - cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        const ang = Math.atan2(dy, dx) + 0.002;
        p.x = cx + Math.cos(ang) * r;
        p.y = cy + Math.sin(ang) * r;

        ctx!.fillStyle = `hsla(${p.hue}, 90%, 70%, ${0.7 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      // Central core
      const r = 24 + Math.sin(t * 1.2) * 4;
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * alpha})`);
      grad.addColorStop(0.2, `rgba(168, 85, 247, ${0.7 * alpha})`);
      grad.addColorStop(0.6, `rgba(99, 102, 241, ${0.25 * alpha})`);
      grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 3, 0, Math.PI * 2);
      ctx!.fill();
    }

    function step() {
      t += 0.016;
      ctx!.clearRect(0, 0, w, h);
      const alpha = active ? 1 : 0.4;

      switch (variant) {
        case 'network':
        case 'cloud':
        case 'config':
        case 'notifications':
          drawNetwork(alpha * 0.5);
          if (variant === 'cloud') drawCloud(alpha);
          if (variant === 'config') drawConfig(alpha);
          if (variant === 'notifications') drawNotifications(alpha);
          break;
        case 'grid-scan':
          drawGridScan(alpha);
          break;
        case 'traffic':
          drawTraffic(alpha);
          break;
        case 'analytics':
          drawAnalytics(alpha);
          break;
        case 'failover':
          drawFailover(alpha);
          break;
        case 'logs':
          drawLogs(alpha);
          break;
        case 'reveal':
          drawReveal(alpha);
          break;
      }
      raf = requestAnimationFrame(step);
    }

    if (reducedMotion) {
      // Render one frame only
      t = 0;
      step();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
    }

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [variant, active, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        opacity: reducedMotion ? 0.55 : 1,
      }}
    />
  );
}
