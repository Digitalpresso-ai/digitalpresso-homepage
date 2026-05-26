'use client';

import { useEffect, useRef, type RefObject } from 'react';

interface UseIntersectionObserverOptions {
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver(
  callback: () => void,
  options: UseIntersectionObserverOptions = {},
): RefObject<HTMLDivElement | null> {
  const { enabled = true, rootMargin = '200px', threshold = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, enabled, rootMargin, threshold]);

  return ref;
}
