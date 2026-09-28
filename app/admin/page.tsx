import { prisma } from "@/lib/prisma";
import { LinkManager } from "@/components/admin/LinkManager";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const links = await prisma.link.findMany({ orderBy: { order: "asc" } });
  return <LinkManager initialLinks={links} />;
}
