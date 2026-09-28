import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getOrCreateProfile } from "@/lib/data";
import { RMZ_COLOR_KEYS } from "@/lib/colors";

const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).optional(),
  bio: z.string().trim().max(280).nullable().optional(),
  avatarUrl: z.string().trim().max(1000).nullable().optional(),
  theme: z.enum(["dark", "beige"]).optional(),
  blurPx: z.number().int().min(0).max(40).optional(),
  scrimOpacity: z.number().min(0).max(1).optional(),
  accentColor: z.enum(RMZ_COLOR_KEYS as [string, ...string[]]).optional(),
  buttonStyle: z.enum(["glass", "beige", "black"]).optional(),
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const profile = await getOrCreateProfile();
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const existing = await getOrCreateProfile();
  const profile = await prisma.profile.update({ where: { id: existing.id }, data: parsed.data });

  return NextResponse.json(profile);
}
