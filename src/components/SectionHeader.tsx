import { useInView } from '../hooks/useInView';
import { SplitText } from './SplitText';

interface Props {
  eyebrow: string;
  headline: string;
  subline?: string;
  align?: 'left' | 'center';
  index?: string;
}

export function SectionHeader({ eyebrow, headline, subline, align = 'left', index }: Props) {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <div
      ref={ref}
      className={`section-header section-header--${align}`}
      style={{ textAlign: align }}
    >
      <div className="section-header__top" data-reveal="fade">
        <span className="eyebrow">{eyebrow}</span>
        {index && <span className="section-header__index">{index}</span>}
      </div>
      <h2 className="h-section section-header__headline" style={{ marginTop: 'var(--sp-5)' }}>
        <SplitText text={headline} />
      </h2>
      {subline && (
        <p className="h-body section-header__sub" data-reveal style={{ marginTop: 'var(--sp-5)', marginLeft: align === 'center' ? 'auto' : undefined, marginRight: align === 'center' ? 'auto' : undefined }}>
          {subline}
        </p>
      )}
      <style>{`
        .section-header { display: flex; flex-direction: column; gap: var(--sp-1); }
        .section-header--center { align-items: center; }
        .section-header--center .section-header__sub { margin-inline: auto; }
        .section-header__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-4);
        }
        .section-header--center .section-header__top { justify-content: center; }
        .section-header__index {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: var(--text-dim);
        }
        .section-header__headline { max-width: 18ch; }
        .section-header--center .section-header__headline { max-width: none; }
      `}</style>
    </div>
  );
}
