"use client";

import { useState } from "react";
import type { Profile } from "@prisma/client";
import { RMZ_COLORS, RMZ_COLOR_KEYS, type RmzColorKey } from "@/lib/colors";
import type { ButtonStyle, ProfileTheme } from "@/lib/types";
import { LivePreview } from "./LivePreview";

interface AppearanceManagerProps {
  initialProfile: Profile;
}

const BUTTON_STYLES: { key: ButtonStyle; label: string; description: string }[] = [
  { key: "glass", label: "Glass", description: "Frosted, translucent cards" },
  { key: "beige", label: "Solid beige", description: "Warm, flat cards" },
  { key: "black", label: "Solid black", description: "Dark, minimal cards" },
];

export function AppearanceManager({ initialProfile }: AppearanceManagerProps) {
  const [theme, setTheme] = useState<ProfileTheme>(initialProfile.theme === "beige" ? "beige" : "dark");
  const [blurPx, setBlurPx] = useState(initialProfile.blurPx);
  const [scrimOpacity, setScrimOpacity] = useState(initialProfile.scrimOpacity);
  const [accentColor, setAccentColor] = useState<RmzColorKey>(
    RMZ_COLOR_KEYS.includes(initialProfile.accentColor as RmzColorKey)
      ? (initialProfile.accentColor as RmzColorKey)
      : "red",
  );
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(
    initialProfile.buttonStyle === "beige" || initialProfile.buttonStyle === "black"
      ? initialProfile.buttonStyle
      : "glass",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, blurPx, scrimOpacity, accentColor, buttonStyle }),
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
          <h1 className="text-2xl font-bold text-rmz-black">Appearance</h1>
          <p className="text-sm text-rmz-black/50">Tune the public page&rsquo;s look. Save to publish.</p>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-rmz-black/10 bg-white p-6">
          <div>
            <p className="mb-2 text-sm font-medium text-rmz-black/70">Theme</p>
            <div className="grid grid-cols-2 gap-3">
              {(["dark", "beige"] as ProfileTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`rounded-xl border-2 p-4 text-left text-sm font-semibold capitalize transition-colors ${
                    theme === t ? "border-rmz-red bg-rmz-red/5" : "border-rmz-black/10 hover:border-rmz-black/25"
                  }`}
                >
                  <span className="mb-2 block h-10 w-full rounded-lg" style={{ background: t === "dark" ? "#0f0f0e" : "#f3e8cc" }} />
                  {t === "dark" ? "Dark (wallpaper)" : "Beige (flat)"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 flex justify-between text-sm font-medium text-rmz-black/70">
              <span>Wallpaper blur</span>
              <span className="text-rmz-black/40">{blurPx}px</span>
            </label>
            <input
              type="range"
              min={0}
              max={40}
              value={blurPx}
              onChange={(e) => setBlurPx(Number(e.target.value))}
              disabled={theme !== "dark"}
              className="w-full accent-rmz-red disabled:opacity-40"
            />
          </div>

          <div>
            <label className="mb-2 flex justify-between text-sm font-medium text-rmz-black/70">
              <span>Scrim darkness</span>
              <span className="text-rmz-black/40">{Math.round(scrimOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(scrimOpacity * 100)}
              onChange={(e) => setScrimOpacity(Number(e.target.value) / 100)}
              disabled={theme !== "dark"}
              className="w-full accent-rmz-red disabled:opacity-40"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-rmz-black/70">Accent color</p>
            <div className="flex flex-wrap gap-3">
              {RMZ_COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  onClick={() => setAccentColor(key)}
                  className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                    accentColor === key ? "border-rmz-black scale-110" : "border-transparent"
                  }`}
                  style={{ background: RMZ_COLORS[key] }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-rmz-black/70">Button style</p>
            <div className="grid grid-cols-3 gap-3">
              {BUTTON_STYLES.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setButtonStyle(opt.key)}
                  className={`rounded-xl border-2 p-3 text-left transition-colors ${
                    buttonStyle === opt.key ? "border-rmz-red bg-rmz-red/5" : "border-rmz-black/10 hover:border-rmz-black/25"
                  }`}
                >
                  <p className="text-sm font-semibold text-rmz-black">{opt.label}</p>
                  <p className="text-xs text-rmz-black/50">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-rmz-red px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save appearance"}
            </button>
            {saved && <span className="text-sm text-rmz-green">Saved ✓</span>}
          </div>
        </div>
      </div>

      <LivePreview refreshKey={previewKey} />
    </div>
  );
}
