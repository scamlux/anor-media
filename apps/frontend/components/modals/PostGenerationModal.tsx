"use client";

import { Modal } from "@/components/ui/Modal";
import { PostGenerationForm } from "@/components/forms/PostGenerationForm";
import { usePostGeneration } from "@/hooks/usePostGeneration";

interface PostGenerationModalProps {
  planItemId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PostGenerationModal({ planItemId, isOpen, onClose }: PostGenerationModalProps) {
  const generation = usePostGeneration(planItemId ?? "");

  if (!planItemId) return null;

  return (
    <Modal isOpen={isOpen} title="Generate Post" onClose={onClose}>
      <PostGenerationForm
        isLoading={generation.isGenerating}
        onSubmit={async (values) => {
          await generation.run(values);
        }}
      />
      {generation.error ? <p className="mt-3 text-sm text-danger">{generation.error}</p> : null}
      {generation.queueJobId ? (
        <p className="mt-3 text-sm text-accent">Queued: {generation.queueJobId}</p>
      ) : null}
    </Modal>
  );
}
