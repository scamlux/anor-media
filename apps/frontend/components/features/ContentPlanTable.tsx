"use client";

import type { PlanWithItems } from "@/types/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface ContentPlanTableProps {
  plan: PlanWithItems;
  onConfirm: (planId: string) => Promise<void>;
}

export function ContentPlanTable({ plan, onConfirm }: ContentPlanTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Content Plan</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={plan.plan.status} />
          {plan.plan.status === "draft" ? (
            <Button onClick={() => void onConfirm(plan.plan.id)}>Confirm plan</Button>
          ) : null}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Goal</th>
              <th className="p-2">Format</th>
            </tr>
          </thead>
          <tbody>
            {plan.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.topic}</td>
                <td className="p-2">{item.goal}</td>
                <td className="p-2">{item.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
