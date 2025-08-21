import { ReactNode } from 'react';

export default function KpiCard({
  title,
  value,
}: {
  title: string;
  value: ReactNode;
}) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
