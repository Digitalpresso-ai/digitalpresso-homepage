export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayStr(): string {
  return toISODate(new Date());
}

export function daysAgoStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toISODate(d);
}

export function computePrevRange(from: string, to: string) {
  const start = new Date(from);
  const end   = new Date(to);
  const dur   = Math.round((end.getTime() - start.getTime()) / 86400000);
  const prevEnd   = new Date(start); prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - dur);
  return { startDate: toISODate(prevStart), endDate: toISODate(prevEnd) };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateRange(
  fromParam?: string,
  toParam?: string,
  defaultDays = 30,
): { from: string; to: string } {
  const today = todayStr();
  return {
    from: fromParam && DATE_RE.test(fromParam) ? fromParam : daysAgoStr(defaultDays),
    to:   toParam   && DATE_RE.test(toParam)   ? toParam   : today,
  };
}

export function formatKo(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}.${m}.${d}`;
}
