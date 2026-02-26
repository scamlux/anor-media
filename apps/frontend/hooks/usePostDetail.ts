"use client";

import { useState } from "react";
import type { PostVersion } from "@/types/api";
import { decideApproval, getPostVersions, submitForApproval } from "@/services/posts.service";

export function usePostDetail(postId: string) {
  const [versions, setVersions] = useState<PostVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      setVersions(await getPostVersions(postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post versions");
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await submitForApproval(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit approval failed");
    } finally {
      setIsLoading(false);
    }
  };

  const approveOrReject = async (payload: { decision: "approved" | "rejected"; comment?: string }): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await decideApproval(postId, payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    versions,
    isLoading,
    error,
    load,
    submit,
    approveOrReject
  };
}
