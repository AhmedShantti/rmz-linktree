"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import type { Profile } from "@prisma/client";
import { LivePreview } from "./LivePreview";

interface ProfileManagerProps {
  initialProfile: Profile;
}

export function ProfileManager({ initialProfile }: ProfileManagerProps) {
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) return;
    const { url } = await res.json();
    setAvatarUrl(url);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, bio: bio || null, avatarUrl }),
    });
    setSaving(false);
    setSaved(true);
    setPreviewKey((k) => k + 1);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-rmz-black">Profile</h1>
          <p className="text-sm text-rmz-black/50">This is what visitors see at the top of your page.</p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-rmz-black/10 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-rmz-beige">
              {avatarUrl && <Image src={avatarUrl} alt="" fill className="object-cover" />}
            </div>
            <label className="cursor-pointer rounded-lg border border-rmz-black/15 px-3 py-2 text-xs font-medium text-rmz-black/60 hover:bg-rmz-beige">
              {uploading ? "Uploading…" : "Upload avatar"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-rmz-black/70">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-rmz-black/70">Bio / tagline</label>
            <textarea
              value={bio}
              maxLength={280}
              rows={3}
              onChange={(e) => setBio(e.target.value)}
              className="resize-none rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-rmz-red px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            {saved && <span className="text-sm text-rmz-green">Saved ✓</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-rmz-black/15 bg-white p-6">
          <h2 className="text-sm font-semibold text-rmz-black">Social links live in your link list now</h2>
          <p className="text-sm text-rmz-black/50">
            Instagram, TikTok, X, etc. are added as &ldquo;Social Link&rdquo; items on the{" "}
            <NextLink href="/admin" className="font-medium text-rmz-red hover:underline">
              Links page
            </NextLink>
            , styled and reordered together with your regular links.
          </p>
        </div>
      </div>

      <LivePreview refreshKey={previewKey} />
    </div>
  );
}
