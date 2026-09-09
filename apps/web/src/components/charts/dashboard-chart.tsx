import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export function DashboardChart({
  data,
}: {
  data: Array<{ date: string; views: number; modelOpens: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d9e2df" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="views" stroke="#118a68" strokeWidth={2} />
        <Line type="monotone" dataKey="modelOpens" stroke="#39d7a2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
