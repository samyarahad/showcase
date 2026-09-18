import { useInView } from '../hooks/useInView';

export function FinalSection() {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <section id="final" className="section section--full final" aria-labelledby="final-h">
      <div ref={ref} className="container final__content">
        <div className="final__logo" data-reveal="scale">
          <img src="./logo.webp" alt="" width={140} height={140} />
        </div>
        <span className="eyebrow" data-reveal style={{ marginTop: 'var(--sp-5)', letterSpacing: '0.5em' }}>
          PIXEL &amp; PING
        </span>
        <h2 id="final-h" className="h-display" data-reveal style={{ marginTop: 'var(--sp-4)', textAlign: 'center' }}>
          One view.
          <br />
          <span className="text-gradient">One network.</span>
        </h2>
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
        .final__logo {
          filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.45))
                  drop-shadow(0 0 100px rgba(99, 102, 241, 0.25));
          animation: final-float 6s ease-in-out infinite;
        }
        .final__logo img { width: 140px; height: 140px; }
        @keyframes final-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .final__logo { animation: none; }
        }
        @media (max-width: 768px) {
          .final__logo img { width: 100px; height: 100px; }
        }
      `}</style>
    </section>
  );
}
