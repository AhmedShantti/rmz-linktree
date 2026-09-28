"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

const NAV_ITEMS = [
  { href: "/admin", label: "Links" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/appearance", label: "Appearance" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-rmz-black/10 bg-white px-4 py-6">
      <div>
        <div className="mb-8 px-2">
          <Logo size="sm" />
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-rmz-black/40">
            Control Panel
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-rmz-red text-white"
                    : "text-rmz-black/70 hover:bg-rmz-beige"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-lg border border-rmz-black/10 px-3 py-2 text-left text-sm font-medium text-rmz-black/60 transition-colors hover:bg-rmz-beige hover:text-rmz-black"
      >
        Log out
      </button>
    </aside>
  );
}
