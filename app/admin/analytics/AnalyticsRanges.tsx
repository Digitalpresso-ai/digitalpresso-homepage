'use client';

import { useRouter } from 'next/navigation';
import DateRangePicker from '@/src/features/admin/components/DateRangePicker/DateRangePicker';

interface Props {
  metric: string;
  from: string;
  to: string;
}

export default function AnalyticsRanges({ metric, from, to }: Props) {
  const router = useRouter();

  function onChange(f: string, t: string) {
    router.push(`/admin/analytics?metric=${metric}&from=${f}&to=${t}`);
  }

  return <DateRangePicker from={from} to={to} onChange={onChange} />;
}
