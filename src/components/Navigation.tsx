import { useEffect, useRef } from 'react';
import { NAV_ITEMS } from '../data/sections';

/**
 * Minimal top navigation. Transparent at the top, blurs into a glass bar as
 * the user scrolls. Active section is highlighted via IntersectionObserver.
 * On mobile, collapses into a slide-down menu.
 */
export function Navigation() {
  const navRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastY = window.scrollY;
    let raf = 0;

    const update = () => {
      const y = window.scrollY;
      const isPastHero = y > 80;
      nav.classList.toggle('is-scrolled', isPastHero);

      // Auto-hide on fast down-scroll, show on up-scroll
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (isPastHero && goingDown && y > 400) {
        nav.classList.add('is-hidden');
      } else if (goingUp || !isPastHero) {
        nav.classList.remove('is-hidden');
      }
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

  // ---- Scroll spy: highlight active nav item ----
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      Boolean,
    ) as HTMLElement[];
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
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const openMenu = () => mobileMenuRef.current?.classList.add('is-open');
  const closeMenu = () => mobileMenuRef.current?.classList.remove('is-open');

  return (
    <>
      <nav ref={navRef} className="nav" aria-label="Primary">
        <div className="nav__inner container-wide">
          <a href="#hero" className="nav__brand" aria-label="Pixel & Ping — Home">
            <span className="nav__logo" aria-hidden>
              <svg viewBox="0 0 32 32" width="28" height="28">
                <defs>
                  <linearGradient id="navLogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="#0a0b1a" />
                <path
                  d="M11 7h7a6 6 0 0 1 0 12h-4v6h-3V7zm3 3v6h4a3 3 0 0 0 0-6h-4z"
                  fill="url(#navLogo)"
                />
              </svg>
            </span>
            <span className="nav__brand-text">
              <span className="nav__brand-name">PIXEL <span className="text-gradient">&amp;</span> PING</span>
              <span className="nav__brand-tag">v1.1.1</span>
            </span>
          </a>

          <ul className="nav__items">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-nav-item={item.id}
                  className="nav__item"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="nav__burger"
            aria-label="Open menu"
            aria-expanded="false"
            onClick={(e) => {
              const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
              e.currentTarget.setAttribute('aria-expanded', String(!expanded));
              if (!expanded) openMenu();
              else closeMenu();
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div ref={indicatorRef} className="nav__line" aria-hidden />
      </nav>

      {/* Mobile menu */}
      <div ref={mobileMenuRef} className="nav-mobile" aria-hidden>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => {
                  closeMenu();
                  document.querySelector('.nav__burger')?.setAttribute('aria-expanded', 'false');
                }}
              >
                {item.label}
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
          transition: transform 0.4s var(--ease-out), background 0.4s var(--ease-out), backdrop-filter 0.4s var(--ease-out);
          transform: translateY(0);
        }
        .nav.is-scrolled {
          background: rgba(7, 8, 21, 0.72);
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          border-bottom: 1px solid var(--line);
        }
        .nav.is-hidden { transform: translateY(-110%); }

        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-h);
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
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          color: var(--text-hi);
        }
        .nav__brand-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-lo);
          letter-spacing: 0.06em;
        }

        .nav__items {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .nav__item {
          position: relative;
          padding: 0.55rem 0.95rem;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--text-lo);
          transition: color var(--dur) var(--ease-out);
          border-radius: var(--r-pill);
        }
        .nav__item:hover { color: var(--text-hi); }
        .nav__item.is-active { color: var(--text-hi); }
        .nav__item.is-active::after {
          content: '';
          position: absolute;
          left: 50%; bottom: -2px;
          transform: translateX(-50%);
          width: 14px; height: 2px;
          background: var(--grad-brand);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.7);
        }

        .nav__line {
          position: absolute;
          left: 0; bottom: 0;
          height: 1px; width: 0%;
          background: var(--grad-brand);
          opacity: 0;
          transition: opacity var(--dur) var(--ease-out);
        }
        .nav.is-scrolled .nav__line { opacity: 0.5; }

        .nav__burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          border-radius: var(--r-sm);
        }
        .nav__burger span {
          display: block;
          width: 24px; height: 2px;
          background: var(--text-hi);
          border-radius: 2px;
          transition: transform var(--dur) var(--ease-out), opacity var(--dur) var(--ease-out);
        }

        .nav-mobile {
          position: fixed;
          top: var(--nav-h); left: 0; right: 0;
          z-index: 99;
          background: rgba(7, 8, 21, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--line);
          clip-path: inset(0 0 100% 0);
          transition: clip-path 0.45s var(--ease-out);
          pointer-events: none;
        }
        .nav-mobile.is-open {
          clip-path: inset(0 0 0 0);
          pointer-events: auto;
        }
        .nav-mobile ul {
          display: flex;
          flex-direction: column;
          padding: var(--sp-4) var(--sp-5);
          gap: var(--sp-1);
        }
        .nav-mobile a {
          display: block;
          padding: var(--sp-3) var(--sp-4);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          font-weight: 500;
          color: var(--text-mid);
          border-radius: var(--r-md);
          transition: background var(--dur), color var(--dur);
        }
        .nav-mobile a:hover { background: rgba(255,255,255,0.04); color: var(--text-hi); }

        @media (max-width: 880px) {
          .nav__items { display: none; }
          .nav__burger { display: flex; }
        }
      `}</style>
    </>
  );
}
