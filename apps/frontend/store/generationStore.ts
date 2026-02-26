import { create } from "zustand";
import type { PlanWithItems } from "@/types/api";

interface GenerationState {
  currentPlan: PlanWithItems | null;
  selectedDay: string | null;
  generationStatus: "idle" | "loading" | "completed" | "error";
  costEstimate: number;
  setPlan: (plan: PlanWithItems | null) => void;
  setSelectedDay: (day: string | null) => void;
  setGenerationStatus: (status: GenerationState["generationStatus"]) => void;
  setCostEstimate: (cost: number) => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  currentPlan: null,
  selectedDay: null,
  generationStatus: "idle",
  costEstimate: 0,
  setPlan: (currentPlan) => set({ currentPlan }),
  setSelectedDay: (selectedDay) => set({ selectedDay }),
  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  setCostEstimate: (costEstimate) => set({ costEstimate })
}));
