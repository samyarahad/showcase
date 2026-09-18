import { SplitText } from '../components/SplitText';
import { useInView } from '../hooks/useInView';
import { sectionIndex } from '../data/sections';

export function FinalSection() {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id="final" className="section section--full final" aria-labelledby="final-h">
      <div ref={ref} className="container final__content">
        <div className="final__top" data-reveal="fade">
          <span className="eyebrow">PIXEL &amp; PING</span>
          <span className="final__index">{sectionIndex('final')}</span>
        </div>

        <div className="final__logo" data-reveal="scale">
          <img src="./logo.webp" alt="" width={120} height={120} />
        </div>

        <h2 id="final-h" className="h-hero final__headline">
          <SplitText text={'One view.\nOne network.'} />
        </h2>

        <div className="final__line" data-reveal />
      </div>
      <style>{`
        .final {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .final__content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .final__top {
          display: flex;
          align-items: center;
          gap: var(--sp-5);
          margin-bottom: var(--sp-7);
        }
        .final__index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .final__logo {
          filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.45))
                  drop-shadow(0 0 100px rgba(99, 102, 241, 0.25));
          animation: final-float 6s ease-in-out infinite;
          margin-bottom: var(--sp-6);
        }
        .final__headline { text-align: center; max-width: 14ch; }
        .final__line {
          margin-top: var(--sp-9);
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, var(--accent), transparent);
        }
        @keyframes final-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .final__logo { animation: none; }
        }
        @media (max-width: 768px) {
          .final__logo img { width: 90px; height: 90px; }
        }
      `}</style>
    </section>
  );
}
