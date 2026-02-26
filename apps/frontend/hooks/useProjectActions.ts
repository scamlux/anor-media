"use client";

import { useState } from "react";
import { createProject, getProject, updateBrandContext } from "@/services/projects.service";
import type { BrandContext, Project } from "@/types/api";

export function useProjectActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: {
    name: string;
    description?: string;
    campaign_goal: string;
    brand_context: {
      tone: string;
      audience: string;
      compliance_notes: string;
      allowed_emojis: boolean;
    };
  }): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await createProject(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create project failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDetails = async (projectId: string): Promise<{ project: Project; brandContext: BrandContext } | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getProject(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBrand = async (
    projectId: string,
    payload: {
      tone: string;
      audience: string;
      compliance_notes: string;
      allowed_emojis: boolean;
    }
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await updateBrandContext(projectId, payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update brand context");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    create,
    loadDetails,
    updateBrand
  };
}
