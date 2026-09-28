"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-rmz-black/10 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo size="md" />
        <p className="text-sm text-rmz-black/50">Control Panel — dare to log in.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-rmz-black/70">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-rmz-black/15 px-3 py-2 text-sm outline-none focus:border-rmz-red focus:ring-1 focus:ring-rmz-red"
          />
        </div>

        {error && <p className="text-sm text-rmz-red">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-rmz-red px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
