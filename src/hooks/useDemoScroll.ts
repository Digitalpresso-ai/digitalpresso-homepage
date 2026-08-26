'use client';

import { useCallback, useRef } from 'react';

/**
 * Scroll bookkeeping shared by the product-demo mocks: each demo's card body
 * (`.sheet`) scrolls independently as its content grows, and two moments
 * need explicit control rather than whatever position the visitor left it
 * at — advancing to a new step should always start at the top, and adding
 * a file/result to the current step should bring that new content into
 * view instead of leaving it hidden below the fold.
 */
export function useDemoScroll<T extends HTMLElement = HTMLDivElement>() {
  const sheetRef = useRef<T>(null);

  /** Jump the sheet back to its top — call this when moving to a new step. */
  const scrollToTop = useCallback(() => {
    sheetRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Scroll the sheet down to its current bottom — call this after content
      (e.g. an uploaded file) is added below the fold. */
  const scrollToBottom = useCallback(() => {
    const el = sheetRef.current;
    if (!el) return;
    // Wait a frame so the newly-rendered content is already laid out and
    // scrollHeight reflects it.
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  /** Bring a specific just-revealed element into view — use this instead of
      scrollToBottom when the sheet has more content after the new piece
      (e.g. later checklist items), so the scroll stops at the new content
      rather than sailing past it to the sheet's actual bottom. */
  const scrollToElement = useCallback((target: HTMLElement | null) => {
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, []);

  return { sheetRef, scrollToTop, scrollToBottom, scrollToElement };
}
