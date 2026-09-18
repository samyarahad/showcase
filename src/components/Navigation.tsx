import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../data/sections';
import { useMagnetic } from '../hooks/useMagnetic';

export function Navigation() {
  const navRef = useRef<HTMLElement | null>(null);
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
        <div className="nav__pill">
          <a ref={brandRef} href="#hero" className="nav__brand" aria-label="Pixel & Ping — Home">
            <span className="nav__logo" aria-hidden>
              <svg viewBox="0 0 32 32" width="30" height="30">
                <defs>
                  <linearGradient id="navLogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2e7dff" />
                    <stop offset="100%" stopColor="#8bf3e6" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="9" fill="#0b0d10" stroke="rgba(70,183,255,0.3)" />
                <path
                  d="M11 7h7a6 6 0 0 1 0 12h-4v6h-3V7zm3 3v6h4a3 3 0 0 0 0-6h-4z"
                  fill="url(#navLogo)"
                />
              </svg>
            </span>
            <span className="nav__brand-text">
              <span className="nav__brand-name">PIXEL <span className="nav__amp">&amp;</span> PING</span>
              <span className="nav__brand-tag">v1.1.1 · showcase</span>
            </span>
          </a>

          <ul className="nav__items">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} data-nav-item={item.id} className="nav__item">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__meta">
            <span className="nav__time">{time}</span>
            <a href="#final" className="nav__cta">
              Experience
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
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

      <div className={`nav-mobile ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
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
          padding-top: 14px;
          transition: transform 0.6s var(--ease-out);
          transform: translateY(0);
        }
        .nav.is-hidden { transform: translateY(-130%); }

        /* Scrolltide-style floating pill container */
        .nav__pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-4);
          height: 60px;
          margin-inline: auto;
          max-width: var(--container-wide);
          width: calc(100% - clamp(1.5rem, 4vw, 3rem) * 2);
          padding-inline: var(--sp-3) var(--sp-3);
          border-radius: var(--r-pill);
          border: 1px solid var(--line);
          background: rgba(7, 8, 10, 0.55);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          box-shadow: 0 12px 40px -16px rgba(0, 0, 0, 0.6);
          transition: background 0.5s var(--ease-out), border-color 0.5s var(--ease-out), box-shadow 0.5s var(--ease-out);
        }
        .nav.is-scrolled .nav__pill {
          background: rgba(7, 8, 10, 0.78);
          border-color: var(--line-strong);
          box-shadow: 0 18px 60px -18px rgba(0, 0, 0, 0.75), 0 8px 40px -20px rgba(70, 183, 255, 0.25);
        }

        .nav__brand { display: inline-flex; align-items: center; gap: var(--sp-3); padding-inline: var(--sp-2); }
        .nav__logo {
          display: inline-flex;
          filter: drop-shadow(0 0 12px rgba(70, 183, 255, 0.35));
        }
        .nav__brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .nav__brand-name {
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.05em;
          color: var(--text-hi);
          white-space: nowrap;
        }
        .nav__amp {
          background: var(--grad-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .nav__brand-tag {
          font-family: var(--font-mono);
          font-size: 0.56rem;
          color: var(--text-lo);
          letter-spacing: 0.16em;
          margin-top: 2px;
        }

        .nav__items {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav__item {
          display: inline-block;
          padding: 0.44rem 0.85rem;
          border-radius: var(--r-pill);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--text-mid);
          transition: color 0.4s var(--ease-out), background 0.4s var(--ease-out);
        }
        .nav__item:hover { color: var(--text-hi); background: rgba(255, 255, 255, 0.05); }
        .nav__item.is-active {
          color: var(--text-hi);
          background: rgba(70, 183, 255, 0.12);
          box-shadow: inset 0 0 0 1px rgba(70, 183, 255, 0.22);
        }

        .nav__meta { display: flex; align-items: center; gap: var(--sp-3); }
        .nav__time {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          color: var(--text-lo);
          font-variant-numeric: tabular-nums;
        }
        .nav__cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          border-radius: var(--r-pill);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #04121f;
          background: var(--grad-brand);
          box-shadow: 0 6px 24px -8px rgba(70, 183, 255, 0.55);
          transition: transform 0.5s var(--ease-out), box-shadow 0.5s var(--ease-out);
        }
        .nav__cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 40px -12px rgba(70, 183, 255, 0.7);
        }
        .nav__cta svg { transition: transform 0.5s var(--ease-out); }
        .nav__cta:hover svg { transform: translateX(2px); }

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
          top: 84px; left: 0; right: 0;
          z-index: 99;
          padding-inline: clamp(1rem, 3vw, 2rem);
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
          padding: var(--sp-3);
          gap: 2px;
          border-radius: var(--r-xl);
          border: 1px solid var(--line);
          background: rgba(7, 8, 10, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8);
        }
        .nav-mobile a {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-4) var(--sp-3);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
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

        @media (max-width: 1120px) {
          .nav__time { display: none; }
        }
        @media (max-width: 980px) {
          .nav__items { display: none; }
          .nav__cta { display: none; }
          .nav__burger { display: flex; }
        }
      `}</style>
    </>
  );
}
