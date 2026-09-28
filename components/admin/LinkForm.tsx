"use client";

import { useState } from "react";
import type { Link as LinkRecord } from "@prisma/client";
import { Toggle } from "./Toggle";

export interface LinkFormValues {
  type: "link" | "social";
  title: string;
  url: string;
  subtitle: string;
  icon: string;
  active: boolean;
  featured: boolean;
}

interface LinkFormProps {
  initial?: LinkRecord | null;
  onSubmit: (values: LinkFormValues) => Promise<void>;
  onCancel: () => void;
}

export function LinkForm({ initial, onSubmit, onCancel }: LinkFormProps) {
  const [values, setValues] = useState<LinkFormValues>({
    type: initial?.type === "social" ? "social" : "link",
    title: initial?.title ?? "",
    url: initial?.url ?? "",
    subtitle: initial?.subtitle ?? "",
    icon: initial?.icon ?? "",
    active: initial?.active ?? true,
    featured: initial?.featured ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setUploading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Upload failed");
      return;
    }
    const { url } = await res.json();
    setValues((v) => ({ ...v, icon: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const isSocial = values.type === "social";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-rmz-black/70">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(["link", "social"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValues((v) => ({ ...v, type }))}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-colors ${
                values.type === type
                  ? "border-rmz-red bg-rmz-red/5 text-rmz-black"
                  : "border-rmz-black/10 text-rmz-black/50 hover:border-rmz-black/25"
              }`}
            >
              {type === "link" ? "Regular Link" : "Social Link"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-rmz-black/70">
          {isSocial ? "Platform name" : "Title"}
        </label>
        <input
          required
          placeholder={isSocial ? "Instagram" : undefined}
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          className="rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-rmz-black/70">URL</label>
        <input
          required
          type="url"
          placeholder={isSocial ? "https://instagram.com/…" : "https://"}
          value={values.url}
          onChange={(e) => setValues((v) => ({ ...v, url: e.target.value }))}
          className="rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-rmz-black/70">Subtitle (optional)</label>
        <input
          placeholder={isSocial ? "@rebelmindzone or Follow us" : undefined}
          value={values.subtitle}
          onChange={(e) => setValues((v) => ({ ...v, subtitle: e.target.value }))}
          className="rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-rmz-black/70">Icon (emoji or thumbnail)</label>
        <div className="flex items-center gap-2">
          <input
            placeholder="🚀"
            value={values.icon}
            onChange={(e) => setValues((v) => ({ ...v, icon: e.target.value }))}
            className="w-full rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
          />
          <label className="shrink-0 cursor-pointer rounded-lg border border-rmz-black/15 px-3 py-2 text-xs font-medium text-rmz-black/60 hover:bg-rmz-beige">
            {uploading ? "…" : "Upload"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-rmz-beige/60 px-3 py-2">
        <span className="text-sm font-medium text-rmz-black/70">Active</span>
        <Toggle checked={values.active} onChange={(active) => setValues((v) => ({ ...v, active }))} />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-rmz-beige/60 px-3 py-2">
        <span className="text-sm font-medium text-rmz-black/70">Featured</span>
        <Toggle checked={values.featured} onChange={(featured) => setValues((v) => ({ ...v, featured }))} />
      </div>

      {error && <p className="text-sm text-rmz-red">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-rmz-black/60 hover:bg-rmz-beige"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-rmz-red px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Add link"}
        </button>
      </div>
    </form>
  );
}
