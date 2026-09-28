import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const createLinkSchema = z.object({
  type: z.enum(["link", "social"]).optional(),
  title: z.string().trim().min(1, "Title is required"),
  url: z.string().trim().url("Must be a valid URL"),
  subtitle: z.string().trim().max(200).optional().nullable(),
  icon: z.string().trim().max(500).optional().nullable(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const links = await prisma.link.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const maxOrder = await prisma.link.aggregate({ _max: { order: true } });

  const link = await prisma.link.create({
    data: {
      ...parsed.data,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(link, { status: 201 });
}
