import type { Metadata } from "next";
import { getPublicData, recordPageView } from "@/lib/data";
import { Wallpaper } from "@/components/public-page/Wallpaper";
import { Avatar } from "@/components/public-page/Avatar";
import { LinkButton } from "@/components/public-page/LinkButton";
import { EmptyState } from "@/components/public-page/EmptyState";

// Owner edits in /admin should show up immediately — never statically cache this page.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicData();
  const description =
    profile.bio ??
    "A bold creative mind that dares to challenge the ordinary in order to create extraordinary ideas.";

  return {
    title: profile.displayName,
    description,
    openGraph: {
      title: profile.displayName,
      description,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
    twitter: {
      card: "summary",
      title: profile.displayName,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function PublicPage() {
  const [{ profile, links }] = await Promise.all([
    getPublicData(),
    recordPageView(),
  ]);

  const isDark = profile.theme !== "beige";

  return (
    <div
      className={`relative flex min-h-screen flex-1 flex-col items-center ${
        isDark ? "" : "bg-rmz-beige"
      }`}
    >
      {isDark && <Wallpaper blurPx={profile.blurPx} scrimOpacity={profile.scrimOpacity} />}

      <main className="flex w-full max-w-[480px] flex-1 flex-col items-center gap-5 px-6 py-14">
        <Avatar src={profile.avatarUrl} alt={profile.displayName} />

        <div className="flex flex-col items-center gap-1 text-center">
          <h1
            className={`font-display text-2xl font-semibold ${
              isDark ? "text-rmz-beige" : "text-rmz-black"
            }`}
          >
            {profile.displayName}
          </h1>
          {profile.bio && (
            <p
              className={`max-w-sm text-sm leading-relaxed ${
                isDark ? "text-rmz-beige/70" : "text-rmz-black/60"
              }`}
            >
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-2 flex w-full flex-col gap-3">
          {links.length === 0 ? (
            <EmptyState dark={isDark} />
          ) : (
            links.map((link, i) => (
              <LinkButton
                key={link.id}
                link={link}
                accentColor={profile.accentColor}
                buttonStyle={profile.buttonStyle}
                index={i}
              />
            ))
          )}
        </div>

        <footer
          className={`mt-auto flex items-center gap-2 pt-10 text-xs ${
            isDark ? "text-rmz-beige/50" : "text-rmz-black/40"
          }`}
        >
          <span className="flex gap-[3px]" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-[1px] bg-rmz-yellow" />
            <span className="h-1.5 w-1.5 rounded-[1px] bg-rmz-orange" />
            <span className="h-1.5 w-1.5 rounded-[1px] bg-rmz-green" />
          </span>
          Powered by Rebel Mind Zone &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
