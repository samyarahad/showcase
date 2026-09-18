import { useReducedMotion } from '../hooks/useReducedMotion';

const WORDS = [
  'USERS',
  'SERVERS',
  'ENDPOINTS',
  'IP SCANNER',
  'PORTS',
  'CLOUDFLARE',
  'CONFIG',
  'TRAFFIC',
  'ANALYTICS',
  'FAILOVER',
  'LOGS',
  'NOTIFICATIONS',
];

/**
 * Scrolltide-style infinite marquee band — a hairline-bordered ticker that
 * separates the narrative acts and reinforces the module surface list.
 */
export function MarqueeBand() {
  const reducedMotion = useReducedMotion();

  const row = (ariaHidden: boolean) => (
    <div className="marquee__row" aria-hidden={ariaHidden}>
      {WORDS.map((w, i) => (
        <span className="marquee__item" key={`${w}-${i}`}>
          <span className="marquee__word">{w}</span>
          <span className="marquee__dot" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" role="presentation">
      <div className={`marquee__track ${reducedMotion ? 'is-static' : ''}`}>
        {row(true)}
        {row(true)}
      </div>
      <style>{`
        .marquee {
          position: relative;
          overflow: hidden;
          padding-block: var(--sp-5);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(11, 13, 16, 0.45);
          mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
        }
        .marquee__track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 46s linear infinite;
        }
        .marquee__row {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .marquee__item {
          display: inline-flex;
          align-items: center;
        }
        .marquee__word {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.34em;
          color: var(--text-lo);
          white-space: nowrap;
          padding-inline: var(--sp-5);
          transition: color 0.4s var(--ease-out);
        }
        .marquee:hover .marquee__word { color: var(--text-mid); }
        .marquee__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.55;
          flex-shrink: 0;
        }
        .marquee__track.is-static { animation: none; }

        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee__track { animation: none; }
        }
      `}</style>
    </div>
  );
}
