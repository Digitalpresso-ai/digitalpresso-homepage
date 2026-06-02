'use client';

import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { trackEvent } from '@/lib/analytics/gtag';

type LinkProps = ComponentProps<typeof Link>;

interface TrackedLinkProps extends LinkProps {
  location: string;
}

export default function TrackedLink({ location, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent('cta_click', { location });
        onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
      }}
    />
  );
}
