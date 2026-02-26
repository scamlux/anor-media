"use client";

import { useState } from "react";
import { generatePost } from "@/services/posts.service";

export function usePostGeneration(planItemId: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueJobId, setQueueJobId] = useState<string | null>(null);

  const run = async (payload: {
    format_type: string;
    additional_comments: string;
    strict_numbers_mode: boolean;
    compliance_mode: boolean;
  }): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePost(planItemId, payload);
      setQueueJobId(result.queue_job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    run,
    isGenerating,
    error,
    queueJobId
  };
}
