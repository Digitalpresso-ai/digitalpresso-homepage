import Link from 'next/link';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string;
  delta?: number | null;
  lowerIsBetter?: boolean;
  color?: 'blue' | 'green' | 'gray';
  href?: string;
}

function formatDelta(delta: number) {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}%`;
}

export default function StatCard({ label, value, delta, lowerIsBetter, color = 'blue', href }: StatCardProps) {
  const hasDelta  = delta !== null && delta !== undefined;
  const isPositive = hasDelta && (lowerIsBetter ? delta < 0 : delta > 0);
  const isNegative = hasDelta && (lowerIsBetter ? delta > 0 : delta < 0);

  const inner = (
    <>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
      {hasDelta && (
        <span className={`${styles.delta} ${isPositive ? styles.up : isNegative ? styles.down : styles.neutral}`}>
          {isPositive ? '▲' : isNegative ? '▼' : '—'} {formatDelta(delta!)}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${styles.card} ${styles[`card_${color}`]} ${styles.cardLink}`}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={`${styles.card} ${styles[`card_${color}`]}`}>
      {inner}
    </div>
  );
}
