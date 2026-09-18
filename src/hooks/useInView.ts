import { useEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * IntersectionObserver-based "in view" hook.
 * Adds the `is-visible` class to [data-reveal] descendants when they enter.
 * Also supports [data-reveal-lines] containers — animates inner `.line > span`.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(opts: Options = {}) {
  const { threshold = 0.18, rootMargin = '0px 0px -8% 0px', once = true } = opts;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            el.classList.add('is-visible');

            // Cascade reveal [data-reveal] descendants
            const items = entry.target.querySelectorAll('[data-reveal]');
            items.forEach((item, i) => {
              const el = item as HTMLElement;
              if (!el.style.getPropertyValue('--reveal-delay')) {
                el.style.setProperty('--reveal-delay', `${Math.min(i * 70, 560)}ms`);
              }
              // Double rAF to ensure the delay applies
              requestAnimationFrame(() =>
                requestAnimationFrame(() => item.classList.add('is-visible')),
              );
            });

            // Animate [data-reveal-lines] children
            const lineContainers = entry.target.querySelectorAll('[data-reveal-lines]');
            lineContainers.forEach((container) => {
              container.classList.add('is-visible');
              const lines = container.querySelectorAll('.line > span');
              lines.forEach((span, i) => {
                const el = span as HTMLElement;
                el.style.setProperty('--line-delay', `${i * 0.08 + 0.1}s`);
              });
            });

            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
            el.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
