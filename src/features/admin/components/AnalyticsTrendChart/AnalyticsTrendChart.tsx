'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TimelinePoint } from '@/lib/analytics/ga-data';

interface Props {
  data: TimelinePoint[];
  metricKey: 'views' | 'sessions' | 'users';
  label: string;
}

function formatDate(raw: string) {
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  return `${parseInt(m)}/${parseInt(d)}`;
}

export default function AnalyticsTrendChart({ data, metricKey, label }: Props) {
  const chartData = data.map(d => ({
    date: formatDate(d.date),
    value: d[metricKey],
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a0aec0' }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: '#a0aec0' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
          formatter={(v) => [(v as number).toLocaleString(), label]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#193cb8"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
