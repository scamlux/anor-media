"use client";

import { useState } from "react";
import { getProjectLogs } from "@/services/logs.service";

export function useProjectLogs() {
  const [logs, setLogs] = useState<{ generationLogs: any[]; auditLogs: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (projectId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      setLogs(await getProjectLogs(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logs,
    isLoading,
    error,
    load
  };
}
