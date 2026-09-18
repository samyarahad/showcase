export function EmergeSection() {
  return (
    <section id="emerge" className="section section--full emerge" aria-labelledby="emerge-h">
      <div className="container emerge__content">
        <span className="eyebrow" data-reveal>THE PRODUCT EMERGES</span>
        <h2 id="emerge-h" className="h-section" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
          From signal to surface.
        </h2>
        <p className="h-sub" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
          The abstract network becomes the interface.
        </p>
        <div className="emerge__arrow" aria-hidden data-reveal>
          <span />
          <span />
          <span />
        </div>
      </div>
      <style>{`
        .emerge { position: relative; min-height: 80vh; display: flex; align-items: center; text-align: center; }
        .emerge__content { display: flex; flex-direction: column; align-items: center; gap: var(--sp-2); }
        .emerge__content .h-sub { margin-inline: auto; text-align: center; }
        .emerge__arrow {
          margin-top: var(--sp-7);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: emerge-arrow 2.4s ease-in-out infinite;
        }
        .emerge__arrow span {
          display: block;
          width: 2px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, var(--accent-violet));
          border-radius: 2px;
        }
        .emerge__arrow span:nth-child(2) { opacity: 0.6; }
        .emerge__arrow span:nth-child(3) { opacity: 0.3; }
        @keyframes emerge-arrow {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .emerge__arrow { animation: none; }
        }
      `}</style>
    </section>
  );
}
