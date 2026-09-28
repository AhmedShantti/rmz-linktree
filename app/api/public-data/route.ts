import { NextResponse } from "next/server";
import { getPublicData } from "@/lib/data";

// The public page fetches directly via Prisma (see app/page.tsx). This route
// is kept for any client component that needs the same data without a
// server round-trip (e.g. a future client-rendered widget).
export async function GET() {
  const data = await getPublicData();
  return NextResponse.json(data);
}
