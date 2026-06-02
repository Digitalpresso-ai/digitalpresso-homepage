'use client';

import { useEffect, useRef, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';
import styles from './DateRangePicker.module.css';

interface Props {
  from: string;   // YYYY-MM-DD
  to: string;     // YYYY-MM-DD
  onChange: (from: string, to: string) => void;
}

const PRESETS = [
  { label: '7일',  days: 7 },
  { label: '14일', days: 14 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 },
] as const;

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseDate(s: string) {
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

function fmt(s: string) {
  const [y, m, d] = s.split('-');
  return `${y}.${m}.${d}`;
}

export default function DateRangePicker({ from, to, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({
    from: parseDate(from),
    to:   parseDate(to),
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRange({ from: parseDate(from), to: parseDate(to) });
  }, [from, to]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function applyPreset(days: number) {
    const toDate   = new Date();
    const fromDate = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - days + 1);
    const f = toISO(fromDate);
    const t = toISO(toDate);
    setRange({ from: fromDate, to: toDate });
    onChange(f, t);
    setOpen(false);
  }

  function apply() {
    if (!range.from || !range.to) return;
    onChange(toISO(range.from), toISO(range.to));
    setOpen(false);
  }

  const today = new Date();

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className={styles.icon}>📅</span>
        <span>{fmt(from)} ~ {fmt(to)}</span>
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.presets}>
            {PRESETS.map(p => (
              <button key={p.days} type="button" className={styles.preset} onClick={() => applyPreset(p.days)}>
                최근 {p.label}
              </button>
            ))}
          </div>

          <DayPicker
            mode="range"
            selected={range}
            onSelect={r => setRange(r ?? { from: undefined, to: undefined })}
            disabled={[{ after: today }]}
            locale={ko}
            numberOfMonths={2}
            className={styles.picker}
          />

          <div className={styles.footer}>
            <span className={styles.selectedRange}>
              {range.from ? fmt(toISO(range.from)) : '—'} ~ {range.to ? fmt(toISO(range.to)) : '—'}
            </span>
            <button
              type="button"
              className={styles.applyBtn}
              disabled={!range.from || !range.to}
              onClick={apply}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
