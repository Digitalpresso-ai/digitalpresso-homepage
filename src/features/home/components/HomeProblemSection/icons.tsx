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

export function ConstructionIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7M7 14v7M17 3v3M7 3v3M10 14 2.3 6.3M14 6l7.7 7.7M8 6l8 8" />
    </svg>
  );
}

export function FileXIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M8 12.5l5 5M13 12.5l-5 5" />
    </svg>
  );
}

export function FolderOpenIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function ClockArrowDownIcon() {
  return (
    <svg {...base} width="40" height="40" aria-hidden>
      <path d="M12.338 21.994A10 10 0 1 1 21.925 13.227M12 6v6l2 1" />
      <path d="m14 18 4 4 4-4M18 14v8" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg {...base} width="32" height="32" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
