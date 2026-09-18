import { useInView } from '../hooks/useInView';
import type { SectionMeta } from '../data/sections';

interface Props extends Pick<SectionMeta, 'eyebrow' | 'headline' | 'subline'> {
  /** Optional alignment */
  align?: 'left' | 'center';
  /** Optional id for scroll target */
  id?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'tight';
}

/**
 * Reusable section header: eyebrow → headline → subline, with reveal-on-scroll.
 * The headline may contain a "\n" to insert a manual line break.
 */
export function SectionHeader({ eyebrow, headline, subline, align = 'left', id, variant = 'default' }: Props) {
  const { ref } = useInView<HTMLDivElement>({ once: true });

  return (
    <div
      ref={ref}
      id={id}
      className={`section-header section-header--${align} section-header--${variant}`}
      style={{
        textAlign: align,
        marginLeft: align === 'center' ? 'auto' : undefined,
        marginRight: align === 'center' ? 'auto' : undefined,
        maxWidth: align === 'center' ? '880px' : '780px',
      }}
    >
      <span className="eyebrow" data-reveal>
        {eyebrow}
      </span>
      <h2 className="h-section" data-reveal style={{ marginTop: 'var(--sp-4)' }}>
        {headline.split('\n').map((line, i) => (
          <span key={i} style={{ display: 'block' }}>{line}</span>
        ))}
      </h2>
      {subline && (
        <p className="h-sub" data-reveal style={{ marginTop: 'var(--sp-4)', marginLeft: align === 'center' ? 'auto' : undefined, marginRight: align === 'center' ? 'auto' : undefined }}>
          {subline}
        </p>
      )}
      <style>{`
        .section-header { display: flex; flex-direction: column; gap: var(--sp-1); }
        .section-header--center { align-items: center; text-align: center; }
        .section-header--center .h-sub { margin-inline: auto; }
        .section-header--tight { gap: 0; }
      `}</style>
    </div>
  );
}
