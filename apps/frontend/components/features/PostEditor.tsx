"use client";

import type { PostVersion } from "@/types/api";

interface PostEditorProps {
  version: PostVersion;
}

export function PostEditor({ version }: PostEditorProps) {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">Post Version {version.version}</h3>
      <p>
        <strong>Hook:</strong> {version.content.hook}
      </p>
      <p>
        <strong>Main text:</strong> {version.content.main_text}
      </p>
      <p>
        <strong>CTA:</strong> {version.content.cta}
      </p>
      <p>
        <strong>Hashtags:</strong> {version.content.hashtags.join(" ")}
      </p>
      <p>
        <strong>Visual prompt:</strong> {version.content.visual_prompt}
      </p>
    </section>
  );
}
