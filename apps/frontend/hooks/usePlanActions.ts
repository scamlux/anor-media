"use client";

import { useState } from "react";
import { confirmPlan, generatePlan, listPlans } from "@/services/plans.service";
import type { PlanWithItems } from "@/types/api";

export function usePlanActions(projectId: string) {
  const [plans, setPlans] = useState<PlanWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPlans = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      setPlans(await listPlans(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  const requestGeneration = async (payload: {
    period_days: number;
    campaign_type: string;
    compliance_mode: boolean;
  }): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await generatePlan(projectId, payload);
      await refreshPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate plan failed");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  const confirm = async (planId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await confirmPlan(projectId, planId);
      await refreshPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm plan failed");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return { plans, isLoading, error, refreshPlans, requestGeneration, confirm };
}
