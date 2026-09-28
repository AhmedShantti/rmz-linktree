import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [totalViews, links] = await Promise.all([
    prisma.pageView.count(),
    prisma.link.findMany({ orderBy: { clicks: "desc" } }),
  ]);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const maxClicks = Math.max(1, ...links.map((l) => l.clicks));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-rmz-black">Analytics</h1>
        <p className="text-sm text-rmz-black/50">How the page and its links are performing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total page views" value={totalViews} />
        <StatCard label="Total link clicks" value={totalClicks} />
        <StatCard label="Active links" value={links.filter((l) => l.active).length} />
      </div>

      <div className="rounded-2xl border border-rmz-black/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-rmz-black">Clicks per link</h2>
        {links.length === 0 ? (
          <p className="text-sm text-rmz-black/50">No links yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm font-medium text-rmz-black/70">
                  {link.title}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-rmz-beige">
                  <div
                    className="h-full rounded-full bg-rmz-red"
                    style={{ width: `${(link.clicks / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm text-rmz-black/50">{link.clicks}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
