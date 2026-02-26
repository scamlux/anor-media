"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CalendarDayCard } from "@/components/features/CalendarDayCard";
import { PostGenerationModal } from "@/components/modals/PostGenerationModal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCalendar } from "@/hooks/useCalendar";

export default function CalendarPage() {
  const [projectId, setProjectId] = useState("");
  const [selectedPlanItemId, setSelectedPlanItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const calendar = useCalendar();

  return (
    <ProtectedRoute>
      <AppLayout>
        <h2 className="mb-4 text-2xl font-semibold">Calendar Scheduling</h2>
        <div className="mb-4 flex gap-2">
          <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project ID" />
          <Button
            onClick={() => {
              void calendar.load(projectId);
            }}
          >
            Load Calendar
          </Button>
        </div>

        {calendar.error ? <p className="mb-3 text-sm text-danger">{calendar.error}</p> : null}

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calendar.items.map((item) => (
            <CalendarDayCard
              key={item.plan_item_id}
              item={item}
              onGenerate={(planItemId) => {
                setSelectedPlanItemId(planItemId);
                setIsModalOpen(true);
              }}
            />
          ))}
        </section>

        <PostGenerationModal
          planItemId={selectedPlanItemId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlanItemId(null);
          }}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
