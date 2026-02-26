"use client";

interface MediaPreviewProps {
  media: Array<{ type: "image" | "video"; url: string }>;
}

export function MediaPreview({ media }: MediaPreviewProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-2 font-semibold">Media Preview</h3>
      <div className="space-y-2">
        {media.map((item) => (
          <div key={item.url} className="rounded border border-slate-200 p-2 text-sm">
            <p>
              {item.type}: <a className="text-accent" href={item.url}>{item.url}</a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
