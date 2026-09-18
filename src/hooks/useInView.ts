import { useEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * IntersectionObserver-based "in view" hook.
 * Adds the `is-visible` class to [data-reveal] children when they enter.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(opts: Options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = opts;
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
            // Cascade reveal of [data-reveal] descendants
            const items = entry.target.querySelectorAll('[data-reveal]');
            items.forEach((item, i) => {
              const el = item as HTMLElement;
              el.style.setProperty('--reveal-delay', `${Math.min(i * 80, 480)}ms`);
              requestAnimationFrame(() => item.classList.add('is-visible'));
            });
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
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
