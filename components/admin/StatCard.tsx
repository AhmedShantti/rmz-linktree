interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-rmz-black/10 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-rmz-black/40">{label}</p>
      <p className="mt-2 text-3xl font-bold text-rmz-black">{value}</p>
    </div>
  );
}
