"use client";

interface LivePreviewProps {
  refreshKey: number;
}

export function LivePreview({ refreshKey }: LivePreviewProps) {
  return (
    <div className="sticky top-6 flex flex-col items-center gap-2">
      <p className="self-start text-xs font-medium uppercase tracking-wide text-rmz-black/40">
        Live preview
      </p>
      <div className="w-[300px] overflow-hidden rounded-[2rem] border-8 border-rmz-black bg-rmz-black shadow-xl">
        <iframe key={refreshKey} src="/" title="Public page preview" className="h-[600px] w-full bg-white" />
      </div>
    </div>
  );
}
