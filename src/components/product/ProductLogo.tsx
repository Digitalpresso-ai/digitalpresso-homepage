import Image from 'next/image';

/**
 * The RENAME DP wordmark used in the product mock-ups.
 * Rendered at ~100px wide from a 300px (3x) source so it stays crisp.
 */
export function ProductLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/main-renamedp-logo.webp"
      alt="RENAME DP"
      width={300}
      height={74}
      quality={88}
      sizes="110px"
      className={className}
    />
  );
}
