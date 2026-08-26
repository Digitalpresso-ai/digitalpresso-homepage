/* Lucide icons referenced by the Figma design, inlined to match how the rest
   of the codebase ships icons (no icon package is installed). */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function BrainCogIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 7.5v1M12 15.5v1M16 12h-1M9 12H8M14.8 9.2l-.7.7M9.9 14.1l-.7.7M14.8 14.8l-.7-.7M9.9 9.9l-.7-.7" />
      <path d="M4.5 10a2.5 2.5 0 0 1-.4-4.9 2.5 2.5 0 0 1 3.2-3A2.5 2.5 0 0 1 12 3.5a2.5 2.5 0 0 1 4.7-.4 2.5 2.5 0 0 1 3.2 3 2.5 2.5 0 0 1-.4 4.9" />
      <path d="M4.5 14a2.5 2.5 0 0 0-.4 4.9 2.5 2.5 0 0 0 3.2 3 2.5 2.5 0 0 0 4.7.4 2.5 2.5 0 0 0 4.7-.4 2.5 2.5 0 0 0 3.2-3 2.5 2.5 0 0 0-.4-4.9" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BotIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
    </svg>
  );
}
