import { SplitText } from '../components/SplitText';
import { sectionIndex } from '../data/sections';

export function EmergeSection() {
  return (
    <section id="emerge" className="section section--full emerge" aria-labelledby="emerge-h">
      <div className="container emerge__content">
        <div className="emerge__top" data-reveal="fade">
          <span className="eyebrow">THE PRODUCT EMERGES</span>
          <span className="emerge__index">{sectionIndex('emerge')}</span>
        </div>
        <h2 id="emerge-h" className="h-display emerge__headline">
          <SplitText text={'From signal\nto surface.'} />
        </h2>
        <p className="h-large emerge__sub" data-reveal style={{ marginTop: 'var(--sp-6)' }}>
          The abstract network becomes the interface.
        </p>

        <div className="emerge__transition" aria-hidden>
          <div className="emerge__line emerge__line--1" />
          <div className="emerge__node emerge__node--1">SIGNAL</div>
          <div className="emerge__line emerge__line--2" />
          <div className="emerge__node emerge__node--2">NETWORK</div>
          <div className="emerge__line emerge__line--3" />
          <div className="emerge__node emerge__node--3">INTERFACE</div>
          <div className="emerge__arrow" />
        </div>
      </div>
      <style>{`
        .emerge {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .emerge__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-3);
        }
        .emerge__top {
          display: flex;
          align-items: center;
          gap: var(--sp-5);
          margin-bottom: var(--sp-4);
        }
        .emerge__index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .emerge__headline { text-align: center; max-width: 18ch; }
        .emerge__sub { color: var(--text-mid); text-align: center; max-width: 40ch; margin-inline: auto; }

        .emerge__transition {
          margin-top: var(--sp-9);
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: var(--sp-4);
          width: min(700px, 90vw);
        }
        .emerge__line {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--accent), transparent);
          position: relative;
          overflow: hidden;
        }
        .emerge__line::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 30%; height: 100%;
          background: linear-gradient(to right, transparent, #fff, transparent);
          animation: emerge-flow 3s ease-in-out infinite;
        }
        .emerge__node {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          color: var(--text-lo);
          padding: 6px 12px;
          border: 1px solid var(--line);
          border-radius: var(--r-pill);
          background: rgba(7, 8, 10, 0.7);
          backdrop-filter: blur(6px);
          white-space: nowrap;
        }
        .emerge__arrow {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--accent), transparent);
          animation: emerge-arrow-pulse 2.4s ease-in-out infinite;
        }

        @keyframes emerge-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes emerge-arrow-pulse {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .emerge__line::after, .emerge__arrow { animation: none; }
        }
        @media (max-width: 768px) {
          .emerge__transition {
            grid-template-columns: 1fr;
            gap: var(--sp-3);
          }
          .emerge__line { display: none; }
        }
      `}</style>
    </section>
  );
}
