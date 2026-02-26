"use client";

import Link from "next/link";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function PostsPage() {
  const [postId, setPostId] = useState("");

  return (
    <ProtectedRoute>
      <AppLayout>
        <h2 className="mb-4 text-2xl font-semibold">Posts</h2>
        <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm text-slate-600">Open post details by post id to review versions and approval actions.</p>
          <div className="flex gap-2">
            <Input value={postId} onChange={(e) => setPostId(e.target.value)} placeholder="Post ID" />
            <Link href={`/posts/${postId}`}>
              <Button disabled={!postId}>Open</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
