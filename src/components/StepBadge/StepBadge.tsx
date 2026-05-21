import type { CSSProperties, ReactNode } from 'react';
import styles from './StepBadge.module.css';

type StepBadgeVariant = 'active' | 'disabled' | 'light' | 'neutral' | 'sky';
type StepBadgeSize = 'small' | 'large';

interface StepBadgeProps {
  variant?: StepBadgeVariant;
  size?: StepBadgeSize;
  label?: string;
  children?: ReactNode;
  className?: string;
}

const SIZE_CONFIG = {
  small: {
    frame: 48,
    outer: 42,
    inner: 36,
    border: 1.125,
    padding: 3,
    arcRadius: 22,
    arcStroke: 1.5,
    contentFontSize: 16,
  },
  large: {
    frame: 128,
    outer: 112,
    inner: 96,
    border: 3,
    padding: 8,
    arcRadius: 62.5,
    arcStroke: 3,
    contentFontSize: 40,
  },
} as const;

function DecorativeArcs({
  frame,
  arcRadius,
  arcStroke,
}: {
  frame: number;
  arcRadius: number;
  arcStroke: number;
}) {
  const cx = frame / 2;
  const cy = frame / 2;
  const circumference = 2 * Math.PI * arcRadius;
  const arcLength = circumference * (90 / 360);
  const gapLength = circumference - arcLength;

  return (
    <svg
      className={styles.arcs}
      width={frame}
      height={frame}
      viewBox={`0 0 ${frame} ${frame}`}
      aria-hidden="true"
    >
      <circle
        cx={cx}
        cy={cy}
        r={arcRadius}
        fill="none"
        stroke="currentColor"
        strokeWidth={arcStroke}
        strokeDasharray={`${arcLength} ${gapLength}`}
        strokeLinecap="round"
        transform={`rotate(180 ${cx} ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={arcRadius}
        fill="none"
        stroke="currentColor"
        strokeWidth={arcStroke}
        strokeDasharray={`${arcLength} ${gapLength}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StepBadge({
  variant = 'active',
  size = 'small',
  label,
  children,
  className,
}: StepBadgeProps) {
  const cfg = SIZE_CONFIG[size];

  const cssVars: CSSProperties = {
    '--badge-frame': `${cfg.frame}px`,
    '--badge-outer': `${cfg.outer}px`,
    '--badge-inner': `${cfg.inner}px`,
    '--badge-border': `${cfg.border}px`,
    '--badge-padding': `${cfg.padding}px`,
    '--badge-content-size': `${cfg.contentFontSize}px`,
  } as CSSProperties;

  const rootClassName = [
    styles.root,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName} style={cssVars}>
      <div className={styles.frame}>
        <span className={styles.arcsWrapper} aria-hidden="true">
          <DecorativeArcs
            frame={cfg.frame}
            arcRadius={cfg.arcRadius}
            arcStroke={cfg.arcStroke}
          />
        </span>
        <div className={styles.outerRing}>
          <div className={styles.innerCircle}>
            {typeof children === 'string' || typeof children === 'number' ? (
              <span className={styles.text}>{children}</span>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
