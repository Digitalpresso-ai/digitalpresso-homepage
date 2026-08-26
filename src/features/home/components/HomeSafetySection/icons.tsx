/* Inline SVG icons for the safety-checklist demo. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function CameraIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function SparkleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="M9 3 10.4 7.6 15 9l-4.6 1.4L9 15l-1.4-4.6L3 9l4.6-1.4Z" />
      <path d="M18 13.5 18.8 16l2.5.8-2.5.8L18 20l-.8-2.4-2.5-.8 2.5-.8Z" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function FileIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function RefreshIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />
    </svg>
  );
}

export function InfoCircleIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function ChecklistIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <path d="m3 7 2 2 3-3M3 15l2 2 3-3M12 8h9M12 16h9" />
    </svg>
  );
}

export function ImagePlaceholderIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m21 16-5-5-6 6-2-2-5 5" />
    </svg>
  );
}
