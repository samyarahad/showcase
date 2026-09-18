import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../data/sections';
import { useMagnetic } from '../hooks/useMagnetic';

export function Navigation() {
  const navRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const brandRef = useMagnetic<HTMLAnchorElement>(0.2);

  // Live clock for the right side — gives the nav a "control panel" feel
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = d.getUTCHours().toString().padStart(2, '0');
      const mm = d.getUTCMinutes().toString().padStart(2, '0');
      const ss = d.getUTCSeconds().toString().padStart(2, '0');
      setTime(`${hh}:${mm}:${ss} UTC`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let lastY = window.scrollY;
    let raf = 0;

    const update = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (y > 400 && goingDown) nav.classList.add('is-hidden');
      else if (goingUp || y < 40) nav.classList.remove('is-hidden');
      lastY = y;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('[data-nav-item]').forEach((el) => {
              el.classList.toggle('is-active', el.getAttribute('data-nav-item') === id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav ref={navRef} className="nav" aria-label="Primary">
        <div className="nav__inner">
          <a ref={brandRef} href="#hero" className="nav__brand" aria-label="Pixel & Ping — Home">
            <span className="nav__logo" aria-hidden>
              <svg viewBox="0 0 32 32" width="32" height="32">
                <defs>
                  <linearGradient id="navLogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="#0a0b1a" stroke="rgba(168,85,247,0.3)" />
                <path
                  d="M11 7h7a6 6 0 0 1 0 12h-4v6h-3V7zm3 3v6h4a3 3 0 0 0 0-6h-4z"
                  fill="url(#navLogo)"
                />
              </svg>
            </span>
            <span className="nav__brand-text">
              <span className="nav__brand-name">PIXEL <span className="text-accent">&amp;</span> PING</span>
              <span className="nav__brand-tag">v1.1.1 · showcase</span>
            </span>
          </a>

          <ul className="nav__items">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <span className="nav__index">{String(i + 1).padStart(2, '0')}</span>
                <a href={`#${item.id}`} data-nav-item={item.id} className="nav__item">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__meta">
            <span className="nav__time">{time}</span>
            <button
              className="nav__burger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <div ref={mobileMenuRef} className={`nav-mobile ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-mobile__index">{String(i + 1).padStart(2, '0')}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: transform 0.6s var(--ease-out), background 0.4s var(--ease-out), border-color 0.4s var(--ease-out);
          transform: translateY(0);
          border-bottom: 1px solid transparent;
        }
        .nav.is-scrolled {
          background: rgba(6, 7, 19, 0.65);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-bottom-color: var(--line);
        }
        .nav.is-hidden { transform: translateY(-110%); }

        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-h);
          padding-inline: clamp(1.5rem, 4vw, 3rem);
          gap: var(--sp-5);
        }

        .nav__brand { display: inline-flex; align-items: center; gap: var(--sp-3); }
        .nav__logo {
          display: inline-flex;
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.35));
        }
        .nav__brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .nav__brand-name {
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.04em;
          color: var(--text-hi);
        }
        .nav__brand-tag {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-lo);
          letter-spacing: 0.16em;
          margin-top: 2px;
        }

        .nav__items {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .nav__items li {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding-inline: var(--sp-4);
        }
        .nav__index {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--text-dim);
          letter-spacing: 0.1em;
        }
        .nav__item {
          position: relative;
          padding: 0.4rem 0;
          font-size: 0.74rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--text-mid);
          transition: color 0.4s var(--ease-out);
        }
        .nav__item:hover { color: var(--text-hi); }
        .nav__item.is-active { color: var(--text-hi); }
        .nav__item.is-active::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          bottom: -4px;
          height: 1px;
          background: var(--grad-brand);
          box-shadow: 0 0 6px rgba(168, 85, 247, 0.7);
        }

        .nav__meta { display: flex; align-items: center; gap: var(--sp-4); }
        .nav__time {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: var(--text-lo);
          font-variant-numeric: tabular-nums;
        }

        .nav__burger {
          display: none;
          flex-direction: column;
          gap: 6px;
          padding: 10px;
          position: relative;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
        }
        .nav__burger span {
          display: block;
          width: 22px; height: 1.5px;
          background: var(--text-hi);
          border-radius: 2px;
          transition: transform 0.4s var(--ease-out), opacity 0.3s var(--ease-out);
        }
        .nav__burger[aria-expanded="true"] span:nth-child(1) {
          transform: translateY(3.75px) rotate(45deg);
        }
        .nav__burger[aria-expanded="true"] span:nth-child(2) {
          transform: translateY(-3.75px) rotate(-45deg);
        }

        .nav-mobile {
          position: fixed;
          top: var(--nav-h); left: 0; right: 0;
          z-index: 99;
          background: rgba(6, 7, 19, 0.96);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--line);
          clip-path: inset(0 0 100% 0);
          transition: clip-path 0.5s var(--ease-out);
          pointer-events: none;
        }
        .nav-mobile.is-open {
          clip-path: inset(0 0 0 0);
          pointer-events: auto;
        }
        .nav-mobile ul {
          display: flex;
          flex-direction: column;
          padding: var(--sp-4) clamp(1.5rem, 4vw, 3rem);
          gap: var(--sp-1);
        }
        .nav-mobile a {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-4) var(--sp-3);
          font-size: 0.95rem;
          letter-spacing: 0.22em;
          font-weight: 500;
          color: var(--text-mid);
          border-radius: var(--r-md);
          transition: background 0.3s, color 0.3s;
        }
        .nav-mobile a:hover { background: rgba(255,255,255,0.04); color: var(--text-hi); }
        .nav-mobile__index {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--accent);
          letter-spacing: 0.1em;
        }

        @media (max-width: 980px) {
          .nav__items { display: none; }
          .nav__time { display: none; }
          .nav__burger { display: flex; }
        }
      `}</style>
    </>
  );
}
