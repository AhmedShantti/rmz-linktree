import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const linkId = body?.linkId;

  if (typeof linkId !== "string" || !linkId) {
    return NextResponse.json({ error: "linkId is required" }, { status: 400 });
  }

  await prisma.link
    .update({ where: { id: linkId }, data: { clicks: { increment: 1 } } })
    .catch(() => null); // link may have been deleted — never fail the visitor's navigation over it

  return NextResponse.json({ ok: true });
}
