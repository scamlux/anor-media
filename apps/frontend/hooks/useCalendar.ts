"use client";

import { useState } from "react";
import { getCalendar } from "@/services/posts.service";

export function useCalendar() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (projectId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await getCalendar(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calendar load failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    isLoading,
    error,
    load
  };
}
