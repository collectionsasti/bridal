import { useEffect } from 'react';

/**
 * Adds the `is-visible` class to any element with the `reveal` class
 * once it scrolls into view. Re-runs whenever `dep` changes so that
 * freshly-mounted sections (after a view change) get observed too.
 *
 * Includes a safety fallback: any element still hidden shortly after
 * mount is forced visible, so content can never get stuck invisible.
 */
export function useRevealOnScroll(dep: unknown = null): void {
  useEffect(() => {
    const reveal = () => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
        .forEach((el) => {
          if (typeof IntersectionObserver === 'undefined') {
            el.classList.add('is-visible');
            return;
          }
          observer.observe(el);
        });
    };

    // Safety fallback: force-reveal anything still hidden after 800ms
    const fallback = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
        .forEach((el) => el.classList.add('is-visible'));
    }, 800);

    if (typeof IntersectionObserver === 'undefined') {
      document
        .querySelectorAll<HTMLElement>('.reveal')
        .forEach((el) => el.classList.add('is-visible'));
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    // Initial pass
    reveal();

    // Watch for dynamically added .reveal elements (e.g. products loading after fetch)
    const mutationObserver = new MutationObserver(() => reveal());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [dep]);
}
