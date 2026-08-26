/* Inline SVG charts for the cash-flow board.

   Palette: #1d4ed8 (billed / actual) against #38bdf8 (scheduled) — the pair
   clears the CVD and normal-vision separation checks against a white surface.
   Every arc segment is separated by a 2px surface gap rather than a stroke. */

import styles from './HomeScheduleSection.module.css';

const BLUE = '#1d4ed8';
const SKY = '#38bdf8';
const TRACK = '#e5e7eb';

/* An arc path on a circle of radius r, swept clockwise from `from` to `to`
   (turns, 0 = 12 o'clock). Drawn as a stroked path so the ring keeps an even
   width without any fill maths. */
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const pt = (turn: number) => {
    const a = (turn - 0.25) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const [x1, y1] = pt(from);
  const [x2, y2] = pt(to);
  const large = to - from > 0.5 ? 1 : 0;
  return `M${x1} ${y1}A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/* ─── Donut: billed vs remaining ─── */
export function BilledDonut({ billed, billedPct }: { billed: number; billedPct: string }) {
  const R = 46;
  const W = 26;
  /* A 2px surface gap at each junction, expressed in turns. */
  const gap = 2 / (2 * Math.PI * R);

  return (
    <svg viewBox="0 0 160 160" className={styles.donut} role="img" aria-hidden>
      <path
        d={arc(80, 80, R, gap, billed - gap)}
        fill="none"
        stroke={BLUE}
        strokeWidth={W}
      />
      <path
        d={arc(80, 80, R, billed + gap, 1 - gap)}
        fill="none"
        stroke={TRACK}
        strokeWidth={W}
      />
      {/* The headline share sits in the hole, where it cannot clip; the
          legend below names both segments. */}
      <text x={80} y={80} className={styles.donutCentre} textAnchor="middle" dominantBaseline="central">
        {billedPct}
      </text>
    </svg>
  );
}

/* ─── Concentric rings: billed progress vs schedule progress ─── */
export function ProgressRings({ done, plan }: { done: number; plan: number }) {
  const gap = 0.004;
  return (
    <svg viewBox="0 0 160 160" className={styles.donut} role="img" aria-hidden>
      {/* Outer ring — billed progress */}
      <circle cx={80} cy={80} r={58} fill="none" stroke={TRACK} strokeWidth={16} />
      {done > gap && (
        <path
          d={arc(80, 80, 58, 0, done)}
          fill="none"
          stroke={BLUE}
          strokeWidth={16}
          strokeLinecap="butt"
        />
      )}
      {/* Inner ring — schedule progress */}
      <circle cx={80} cy={80} r={36} fill="none" stroke={TRACK} strokeWidth={16} />
      {plan > gap && (
        <path
          d={arc(80, 80, 36, 0, plan)}
          fill="none"
          stroke={SKY}
          strokeWidth={16}
          strokeLinecap="butt"
        />
      )}
    </svg>
  );
}

/* ─── Column chart: cumulative billing by period ─── */
export function TrendBars({
  values,
  axis,
  contract,
}: {
  values: number[];
  axis: string[];
  contract: string;
}) {
  const W = 320;
  const H = 170;
  const PAD_L = 44;
  const PAD_B = 22;
  const TOP = 14;
  /* The contract value caps the scale, so the reference line reads as the
     ceiling the bars are climbing towards. */
  const max = 110;
  const plot = H - PAD_B - TOP;
  const band = (W - PAD_L) / values.length;
  const bar = Math.min(24, band * 0.5); /* capped at 24px — never fill the band */
  const y = (v: number) => TOP + plot * (1 - v / max);

  const ticks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.trend} role="img" aria-hidden>
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={PAD_L}
            x2={W}
            y1={y(v)}
            y2={y(v)}
            stroke="#eef0f3"
            strokeWidth={1}
          />
          <text x={PAD_L - 6} y={y(v) + 3} className={styles.axisLabel} textAnchor="end">
            {v === 0 ? '0' : `${v}억`}
          </text>
        </g>
      ))}

      {/* The contract ceiling, as a reference line rather than a second axis. */}
      <line
        x1={PAD_L}
        x2={W}
        y1={y(100)}
        y2={y(100)}
        stroke={BLUE}
        strokeWidth={2}
        strokeDasharray="7 5"
      />
      <text x={PAD_L + 10} y={y(100) - 7} className={styles.refLabel}>
        {contract}
      </text>

      {values.map((v, i) => {
        const cx = PAD_L + band * (i + 0.5);
        const top = y(v);
        return (
          <g key={i}>
            {/* 4px rounded data-end, square at the baseline */}
            <path
              d={`M${cx - bar / 2} ${y(0)}V${top + 4}a4 4 0 0 1 4-4h${bar - 8}a4 4 0 0 1 4 4V${y(0)}z`}
              fill={BLUE}
            />
            <text
              x={cx}
              y={H - 7}
              className={styles.axisLabel}
              textAnchor="middle"
            >
              {axis[i]}
            </text>
            <title>{`${axis[i]} · ${v}억 원`}</title>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Half gauge: progress against target cost ─── */
export function CostGauge({ ratio, value }: { ratio: number; value: string }) {
  /* The dial spans 0–200% with 100% at the apex, drawn as a half turn from
     9 o'clock to 3 o'clock. */
  const R = 62;
  const clamped = Math.max(0, Math.min(1, ratio / 2));
  const from = 0.75;
  const to = from + clamped * 0.5;

  return (
    <svg viewBox="0 0 180 116" className={styles.gauge} role="img" aria-hidden>
      <g transform="translate(0 8)">
        <path
          d={arc(90, 82, R, 0.75, 1.25)}
          fill="none"
          stroke="#c9ccd2"
          strokeWidth={22}
        />
        {clamped > 0.004 && (
          <path
            d={arc(90, 82, R, from, to)}
            fill="none"
            stroke={BLUE}
            strokeWidth={22}
          />
        )}
        <text x={90} y={74} className={styles.gaugeValue} textAnchor="middle">
          {value}
        </text>
      </g>
    </svg>
  );
}
