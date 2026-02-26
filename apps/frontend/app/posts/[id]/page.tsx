"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { PostEditor } from "@/components/features/PostEditor";
import { MediaPreview } from "@/components/features/MediaPreview";
import { ApprovalPanel } from "@/components/features/ApprovalPanel";
import { Button } from "@/components/ui/Button";
import { usePostDetail } from "@/hooks/usePostDetail";

export default function PostDetailsPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const post = usePostDetail(postId);

  useEffect(() => {
    void post.load();
  }, [postId]);

  const latest = post.versions[0];

  return (
    <ProtectedRoute>
      <AppLayout>
        <h2 className="mb-4 text-2xl font-semibold">Post Details</h2>
        <Button className="mb-4" onClick={() => void post.submit()}>
          Submit For Approval
        </Button>

        {post.error ? <p className="mb-3 text-danger">{post.error}</p> : null}
        {latest ? (
          <div className="grid gap-4 md:grid-cols-2">
            <PostEditor version={latest} />
            <MediaPreview media={latest.media} />
          </div>
        ) : (
          <p className="rounded border border-slate-200 bg-white p-4">No generated versions available.</p>
        )}

        <div className="mt-4">
          <RoleGuard allow={["admin"]}>
            <ApprovalPanel
              onSubmit={async (values) => {
                await post.approveOrReject(values);
              }}
            />
          </RoleGuard>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
