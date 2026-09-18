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
  active?: boolean;
  className?: string;
}

/**
 * Procedural Canvas 2D — renders one of 10 abstract scene variants.
 * All variants share a single rAF loop and auto-pause when the tab is hidden.
 * Density auto-reduces on mobile and prefers-reduced-motion.
 */
export function ProceduralCanvas({ variant, active = true, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let t = 0;
    let raf = 0;
    let running = true;
    let particles: P[] = [];

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number; phase: number };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const isMobile = w < 768;
      if (variant === 'network' || variant === 'cloud' || variant === 'config' || variant === 'notifications') {
        const count = reducedMotion ? 18 : isMobile ? 28 : 50;
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.6 + 0.5,
          hue: 200 + Math.random() * 32,
          phase: Math.random() * Math.PI * 2,
        }));
      } else if (variant === 'traffic') {
        const count = reducedMotion ? 40 : isMobile ? 70 : 130;
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0.3 + Math.random() * 1.2,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.3 + 0.3,
          hue: 195 + Math.random() * 37,
          phase: Math.random() * Math.PI * 2,
        }));
      } else if (variant === 'reveal') {
        const count = reducedMotion ? 24 : 36;
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
            r: 1 + Math.random() * 1.8,
            hue: 200 + Math.random() * 30,
            phase: 0,
          };
        });
      }
    }

    function drawNetwork(alpha: number) {
      const maxD = 130;
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
            const a = (1 - d / maxD) * 0.3 * alpha;
            ctx!.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 85%, 68%, ${a})`;
            ctx!.lineWidth = 0.55;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        const pulse = 0.7 + Math.sin(t * 0.8 + p.phase) * 0.3;
        ctx!.fillStyle = `hsla(${p.hue}, 90%, 72%, ${0.75 * pulse * alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawGridScan(alpha: number) {
      const grid = 36;
      ctx!.strokeStyle = `rgba(46, 125, 255, ${0.06 * alpha})`;
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
      const scanX = (t * 50) % (w + 200) - 100;
      const grad = ctx!.createLinearGradient(scanX - 80, 0, scanX + 80, 0);
      grad.addColorStop(0, 'rgba(70, 183, 255, 0)');
      grad.addColorStop(0.5, `rgba(70, 183, 255, ${0.25 * alpha})`);
      grad.addColorStop(1, 'rgba(70, 183, 255, 0)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(scanX - 80, 0, 160, h);
      const nodeCount = reducedMotion ? 6 : 14;
      for (let i = 0; i < nodeCount; i++) {
        const px = (i * 137) % w;
        const py = (i * 79) % h;
        const pulse = (Math.sin(t * 1.4 + i * 0.7) + 1) * 0.5;
        ctx!.fillStyle = `rgba(70, 183, 255, ${(0.4 + pulse * 0.5) * alpha})`;
        ctx!.beginPath();
        ctx!.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawCloud(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 + t * 0.15;
        const r = 80 + Math.sin(t * 0.6 + i) * 20;
        const x = cx + Math.cos(ang) * r * 1.5;
        const y = cy + Math.sin(ang) * r * 0.9;
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, 120);
        grad.addColorStop(0, `rgba(70, 183, 255, ${0.18 * alpha})`);
        grad.addColorStop(0.5, `rgba(46, 125, 255, ${0.08 * alpha})`);
        grad.addColorStop(1, 'rgba(46, 125, 255, 0)');
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(x, y, 120, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.strokeStyle = `rgba(70, 183, 255, ${0.28 * alpha})`;
      ctx!.lineWidth = 0.8;
      for (let i = 0; i < 8; i++) {
        ctx!.beginPath();
        ctx!.moveTo((i / 8) * w, 0);
        ctx!.quadraticCurveTo(cx + Math.sin(t + i) * 80, cy, (i / 8) * w + 80, h);
        ctx!.stroke();
      }
    }

    function drawConfig(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      const r = 50 + Math.sin(t * 0.8) * 4;
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
      grad.addColorStop(0, `rgba(70, 183, 255, ${0.55 * alpha})`);
      grad.addColorStop(0.5, `rgba(46, 125, 255, ${0.25 * alpha})`);
      grad.addColorStop(1, 'rgba(46, 125, 255, 0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 2, 0, Math.PI * 2);
      ctx!.fill();
      const paramCount = 10;
      for (let i = 0; i < paramCount; i++) {
        const ang = (i / paramCount) * Math.PI * 2;
        const dist = 200 + Math.sin(t * 0.6 + i) * 30;
        const px = cx + Math.cos(ang) * dist;
        const py = cy + Math.sin(ang) * dist;
        const flow = (t * 0.5 + i * 0.3) % 1;
        ctx!.strokeStyle = `rgba(70, 183, 255, ${0.18 * alpha})`;
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.moveTo(px, py);
        ctx!.lineTo(cx, cy);
        ctx!.stroke();
        const dx = px + (cx - px) * flow;
        const dy = py + (cy - py) * flow;
        ctx!.fillStyle = `rgba(139, 243, 230, ${0.85 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawTraffic(alpha: number) {
      for (const p of particles) {
        p.x += p.vx;
        if (p.x > w + 10) p.x = -10;
        p.y += Math.sin(t * 0.5 + p.x * 0.02) * 0.12;
        ctx!.fillStyle = `hsla(${p.hue}, 90%, 72%, ${0.7 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
        const grad = ctx!.createLinearGradient(p.x - 18, p.y, p.x, p.y);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 72%, 0)`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 72%, ${0.3 * alpha})`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(p.x - 18, p.y - 0.5, 18, 1);
      }
    }

    function drawAnalytics(alpha: number) {
      const pad = 24;
      const cw = w - pad * 2;
      const ch = h - pad * 2;
      ctx!.strokeStyle = `rgba(255, 255, 255, ${0.08 * alpha})`;
      ctx!.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad + (i / 4) * ch;
        ctx!.beginPath();
        ctx!.moveTo(pad, y);
        ctx!.lineTo(w - pad, y);
        ctx!.stroke();
      }
      for (let l = 0; l < 3; l++) {
        const hue = 200 + l * 18;
        ctx!.strokeStyle = `hsla(${hue}, 85%, 68%, ${0.7 * alpha})`;
        ctx!.lineWidth = 1.6;
        ctx!.beginPath();
        const samples = 60;
        for (let i = 0; i <= samples; i++) {
          const x = pad + (i / samples) * cw;
          const phase = t * 0.6 + l * 1.3 + i * 0.18;
          const y = pad + ch / 2 + Math.sin(phase) * ch * 0.32 + Math.cos(phase * 0.7) * ch * 0.1;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
    }

    function drawFailover(alpha: number) {
      const pad = 32;
      const cy = h / 2;
      const phase = (Math.sin(t * 0.6) + 1) / 2;
      ctx!.strokeStyle = `rgba(46, 125, 255, ${(0.3 + (1 - phase) * 0.5) * alpha})`;
      ctx!.lineWidth = 2.4;
      ctx!.beginPath();
      ctx!.moveTo(pad, cy - 30);
      ctx!.lineTo(w - pad, cy - 30);
      ctx!.stroke();
      ctx!.strokeStyle = `rgba(139, 243, 230, ${(0.3 + phase * 0.6) * alpha})`;
      ctx!.lineWidth = 2.4;
      ctx!.setLineDash([6, 6]);
      ctx!.beginPath();
      ctx!.moveTo(pad, cy + 30);
      ctx!.bezierCurveTo(w * 0.3, cy + 80, w * 0.7, cy + 80, w - pad, cy + 30);
      ctx!.stroke();
      ctx!.setLineDash([]);
      for (const x of [pad, w - pad]) {
        for (const yy of [cy - 30, cy + 30]) {
          ctx!.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
          ctx!.beginPath();
          ctx!.arc(x, yy, 4, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.font = '500 11px "JetBrains Mono", monospace';
      ctx!.fillStyle = `rgba(70, 183, 255, ${0.7 * alpha})`;
      ctx!.textAlign = 'center';
      ctx!.fillText(phase > 0.5 ? 'CONNECTED · ALTERNATE' : 'PRIMARY ROUTE', w / 2, 24);
    }

    function drawLogs(alpha: number) {
      ctx!.font = '500 11px "JetBrains Mono", monospace';
      const lineCount = w < 768 ? 10 : 16;
      const lineH = h / lineCount;
      for (let i = 0; i < lineCount; i++) {
        const y = i * lineH + lineH * 0.6;
        const shift = Math.sin(t * 0.4 + i * 0.3) * 4;
        const opacity = (0.15 + (i / lineCount) * 0.5) * alpha;
        ctx!.fillStyle = `rgba(140, 150, 180, ${opacity * 0.7})`;
        ctx!.textAlign = 'left';
        ctx!.fillText(`12:${(40 + i).toString().padStart(2, '0')}:${(i * 7 % 60).toString().padStart(2, '0')}`, 16, y + shift);
        const levels = ['INFO', 'OK', 'WARN', 'INFO', 'OK'];
        const lvl = levels[i % levels.length];
        const lvlColors: Record<string, string> = {
          INFO: `rgba(46, 125, 255, ${opacity})`,
          OK: `rgba(139, 243, 230, ${opacity})`,
          WARN: `rgba(255, 180, 84, ${opacity})`,
        };
        ctx!.fillStyle = lvlColors[lvl];
        ctx!.fillText(lvl.padEnd(5, ' '), 100, y + shift);
        ctx!.fillStyle = `rgba(200, 204, 224, ${opacity * 0.85})`;
        const dots = '.'.repeat((i * 13) % 40 + 8);
        ctx!.fillText(`endpoint-${(i % 5) + 1} ${dots} ok`, 160, y + shift);
      }
    }

    function drawNotifications(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.5 + i * 0.4) % 1;
        const r = 30 + phase * 200;
        const a = (1 - phase) * 0.6 * alpha;
        ctx!.strokeStyle = `rgba(70, 183, 255, ${a})`;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.stroke();
      }
      ctx!.fillStyle = `rgba(255, 255, 255, ${0.85 * alpha})`;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx!.fill();
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 60);
      grad.addColorStop(0, `rgba(70, 183, 255, ${0.4 * alpha})`);
      grad.addColorStop(1, 'rgba(70, 183, 255, 0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawReveal(alpha: number) {
      const cx = w / 2;
      const cy = h / 2;
      for (const p of particles) {
        const pulse = (Math.sin(t * 0.8 + p.x * 0.01) + 1) * 0.5;
        ctx!.strokeStyle = `rgba(70, 183, 255, ${(0.18 + pulse * 0.18) * alpha})`;
        ctx!.lineWidth = 0.6;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(cx, cy);
        ctx!.stroke();
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
      const r = 24 + Math.sin(t * 1.2) * 4;
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * alpha})`);
      grad.addColorStop(0.2, `rgba(70, 183, 255, ${0.7 * alpha})`);
      grad.addColorStop(0.6, `rgba(46, 125, 255, ${0.25 * alpha})`);
      grad.addColorStop(1, 'rgba(46, 125, 255, 0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 3, 0, Math.PI * 2);
      ctx!.fill();
    }

    function draw() {
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
        case 'grid-scan': drawGridScan(alpha); break;
        case 'traffic': drawTraffic(alpha); break;
        case 'analytics': drawAnalytics(alpha); break;
        case 'failover': drawFailover(alpha); break;
        case 'logs': drawLogs(alpha); break;
        case 'reveal': drawReveal(alpha); break;
      }
      if (running) raf = requestAnimationFrame(draw);
    }

    resize();
    if (reducedMotion) {
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

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
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
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
        opacity: reducedMotion ? 0.5 : 1,
      }}
    />
  );
}
