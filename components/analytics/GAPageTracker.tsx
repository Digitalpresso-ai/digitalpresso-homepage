'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window?.gtag === 'undefined') return;
    if (pathname.startsWith('/admin')) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    window.gtag('config', GA_ID, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

// useSearchParams는 Suspense 경계가 필요
import { Suspense } from 'react';

export default function GAPageTracker() {
  if (!GA_ID) return null;
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
