import { useMemo } from 'react';

interface Props {
  text: string;
  /** Split character — default "\n" for explicit line breaks */
  splitBy?: string;
  className?: string;
  /** Tag to render */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Splits text into lines wrapped in overflow-hidden containers, ready for the
 * [data-reveal-lines] animation. Each line is a `<span class="line">` with an
 * inner `<span>` that translates up from below.
 */
export function SplitText({ text, splitBy = '\n', className, as = 'span' }: Props) {
  // Normalize literal "\n" sequences (JSX attribute strings do not process
  // escape sequences) into real newlines before splitting.
  const lines = useMemo(() => text.replace(/\\n/g, '\n').split(splitBy), [text, splitBy]);
  const Tag = as as any;

  return (
    <Tag className={className} data-reveal-lines>
      {lines.map((line, i) => (
        <span key={i} className="line">
          <span style={{ '--line-delay': `${i * 0.08 + 0.1}s` } as React.CSSProperties}>
            {line || '\u00A0'}
          </span>
        </span>
      ))}
    </Tag>
  );
}
