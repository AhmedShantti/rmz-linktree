import { NextResponse } from "next/server";
import { isAuthenticated } from "./auth";

/** Call at the top of every /api/admin/** handler — never trust the client, middleware only guards the UI. */
export async function requireAdmin() {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
