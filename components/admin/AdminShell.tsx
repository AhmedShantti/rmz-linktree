"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rmz-beige p-6">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-rmz-beige">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
