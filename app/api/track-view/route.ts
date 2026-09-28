import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * The public page (app/page.tsx) already records a PageView server-side on
 * every render via lib/data.ts#recordPageView, which is more reliable and
 * bot-resistant than a client beacon. This route exists for the alternate
 * client-side (navigator.sendBeacon) path described in the spec, in case a
 * future client-rendered surface needs it — it is not currently called from
 * the public page, to avoid double-counting views.
 */
export async function POST() {
  await prisma.pageView.create({ data: {} });
  return NextResponse.json({ ok: true });
}
