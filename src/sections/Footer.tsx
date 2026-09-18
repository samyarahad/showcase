import { SOCIAL_LINKS } from '../data/sections';

export function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="./logo.webp" alt="" width={56} height={56} className="footer__logo" />
          <div>
            <div className="footer__name">PIXEL <span className="text-gradient">&amp;</span> PING</div>
            <div className="footer__tagline">A modern network management experience.</div>
          </div>
        </div>

        <ul className="footer__social">
          <li>
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pixel & Ping on Telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
              <span>Telegram</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pixel & Ping on YouTube"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Pixel &amp; Ping</span>
          <span className="footer__sep" aria-hidden>·</span>
          <span>Showcase experience — no backend, no accounts, no live data.</span>
        </div>
      </div>

      <style>{`
        .footer {
          position: relative;
          border-top: 1px solid var(--line);
          background: linear-gradient(180deg, transparent, rgba(7, 8, 21, 0.6));
          padding-top: var(--sp-8);
        }
        .footer__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-6);
          flex-wrap: wrap;
          padding-bottom: var(--sp-7);
        }
        .footer__brand { display: flex; align-items: center; gap: var(--sp-4); }
        .footer__logo {
          filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.4));
        }
        .footer__name {
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
        }
        .footer__tagline {
          margin-top: 4px;
          color: var(--text-lo);
          font-size: 0.85rem;
        }
        .footer__social {
          display: flex;
          gap: var(--sp-3);
        }
        .footer__social a {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: 0.6rem 1rem;
          border-radius: var(--r-pill);
          border: 1px solid var(--line);
          color: var(--text-mid);
          font-size: 0.85rem;
          font-weight: 500;
          transition: color var(--dur), border-color var(--dur), background var(--dur), transform var(--dur-fast);
        }
        .footer__social a:hover {
          color: var(--text-hi);
          border-color: var(--line-strong);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-1px);
        }
        .footer__bottom {
          padding-block: var(--sp-4);
          border-top: 1px solid var(--line);
          color: var(--text-lo);
          font-size: 0.78rem;
        }
        .footer__bottom .container {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          flex-wrap: wrap;
        }
        .footer__sep { color: var(--text-dim); }
        @media (max-width: 640px) {
          .footer__inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}
