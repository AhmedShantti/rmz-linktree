import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const updateLinkSchema = z.object({
  type: z.enum(["link", "social"]).optional(),
  title: z.string().trim().min(1).optional(),
  url: z.string().trim().url().optional(),
  subtitle: z.string().trim().max(200).nullable().optional(),
  icon: z.string().trim().max(500).nullable().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const link = await prisma.link.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.link.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
