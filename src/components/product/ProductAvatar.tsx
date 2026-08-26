import Image from 'next/image';

/**
 * The account avatar used in the product mock-ups.
 * Rendered at 24px from a 72px (3x) source.
 */
export function ProductAvatar({ className }: { className?: string }) {
  return (
    <Image
      src="/images/main-profile-sm.png"
      alt=""
      width={72}
      height={72}
      sizes="26px"
      className={className}
    />
  );
}
