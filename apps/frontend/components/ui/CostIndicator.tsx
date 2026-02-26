"use client";

interface CostIndicatorProps {
  cost: number;
}

export function CostIndicator({ cost }: CostIndicatorProps) {
  const color = cost > 500 ? "text-danger" : "text-accent";
  return <span className={`font-semibold ${color}`}>${cost.toFixed(2)}</span>;
}
