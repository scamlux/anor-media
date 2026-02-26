"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface CalendarDayCardProps {
  item: {
    plan_item_id: string;
    schedule_date: string;
    topic: string;
    format: string;
    plan_status: string;
    post_id?: string;
    post_status?: string;
  };
  onGenerate: (planItemId: string) => void;
}

export function CalendarDayCard({ item, onGenerate }: CalendarDayCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold">{item.schedule_date}</h4>
        <StatusBadge status={item.post_status ?? item.plan_status} />
      </div>
      <p className="text-sm font-medium">{item.topic}</p>
      <p className="mb-3 text-xs text-slate-500">{item.format}</p>
      <Button onClick={() => onGenerate(item.plan_item_id)} disabled={item.plan_status !== "confirmed"}>
        Generate
      </Button>
    </article>
  );
}
