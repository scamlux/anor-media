"use client";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color =
    status === "confirmed" || status === "approved"
      ? "bg-emerald-100 text-emerald-800"
      : status === "rejected"
        ? "bg-rose-100 text-rose-800"
        : "bg-amber-100 text-amber-800";

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>{status}</span>;
}
