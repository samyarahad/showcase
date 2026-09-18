import { SOCIAL_LINKS } from '../data/sections';

export function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container-wide">
        <div className="footer__top">
          <div className="footer__brand">
            <img src="./logo.webp" alt="" width={56} height={56} className="footer__logo" />
            <div>
              <div className="footer__name">PIXEL <span className="text-accent">&amp;</span> PING</div>
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
                data-cursor-label="Telegram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                </svg>
                <span>Telegram</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pixel & Ping on YouTube"
                data-cursor-label="YouTube"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>
                </svg>
                <span>YouTube</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__line" />

        <div className="footer__bottom">
          <div className="footer__left">
            <span className="footer__copy">© {new Date().getFullYear()} Pixel &amp; Ping</span>
            <span className="footer__sep" aria-hidden>·</span>
            <span className="footer__note">Showcase experience — no backend, no accounts, no live data.</span>
          </div>
          <div className="footer__right">
            <span className="footer__credit">Crafted with care.</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          position: relative;
          padding-top: var(--sp-10);
          border-top: 1px solid var(--line);
          background: linear-gradient(180deg, transparent, rgba(6, 7, 19, 0.6));
        }
        .footer__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-6);
          flex-wrap: wrap;
          padding-bottom: var(--sp-8);
        }
        .footer__brand { display: flex; align-items: center; gap: var(--sp-4); }
        .footer__logo {
          filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.4));
        }
        .footer__name {
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.04em;
        }
        .footer__tagline {
          margin-top: 4px;
          color: var(--text-lo);
          font-size: 0.82rem;
        }

        .footer__social {
          display: flex;
          gap: var(--sp-3);
        }
        .footer__social a {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: 0.7rem 1.2rem;
          border-radius: var(--r-pill);
          border: 1px solid var(--line-strong);
          color: var(--text-mid);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.4s var(--ease-out);
        }
        .footer__social a:hover {
          color: var(--text-hi);
          border-color: var(--accent);
          background: rgba(168, 85, 247, 0.08);
          transform: translateY(-2px);
        }
        .footer__social a svg:last-child {
          opacity: 0.5;
          transition: transform 0.4s var(--ease-out), opacity 0.4s;
        }
        .footer__social a:hover svg:last-child {
          opacity: 1;
          transform: translate(2px, -2px);
        }

        .footer__line {
          height: 1px;
          background: var(--line);
        }
        .footer__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-block: var(--sp-5);
          color: var(--text-lo);
          font-size: 0.78rem;
          flex-wrap: wrap;
          gap: var(--sp-3);
        }
        .footer__left { display: flex; align-items: center; gap: var(--sp-3); flex-wrap: wrap; }
        .footer__sep { color: var(--text-dim); }
        .footer__credit {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }

        @media (max-width: 720px) {
          .footer__top { flex-direction: column; align-items: flex-start; }
          .footer__bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}
