import { prisma } from "./prisma";
import { isRmzColorKey } from "./colors";
import type { PublicData, ProfileTheme, ButtonStyle, LinkType } from "./types";

function normalizeTheme(theme: string): ProfileTheme {
  return theme === "beige" ? "beige" : "dark";
}

function normalizeButtonStyle(style: string): ButtonStyle {
  return style === "beige" || style === "black" ? style : "glass";
}

function normalizeLinkType(type: string): LinkType {
  return type === "social" ? "social" : "link";
}

/** There is always exactly one Profile row; create the default on first read. */
export async function getOrCreateProfile() {
  const existing = await prisma.profile.findFirst();
  if (existing) return existing;
  return prisma.profile.create({ data: {} });
}

export async function getPublicData(): Promise<PublicData> {
  const [profile, links] = await Promise.all([
    getOrCreateProfile(),
    prisma.link.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);

  return {
    profile: {
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      theme: normalizeTheme(profile.theme),
      blurPx: profile.blurPx,
      scrimOpacity: profile.scrimOpacity,
      accentColor: isRmzColorKey(profile.accentColor) ? profile.accentColor : "red",
      buttonStyle: normalizeButtonStyle(profile.buttonStyle),
    },
    links: links.map((l) => ({
      id: l.id,
      type: normalizeLinkType(l.type),
      title: l.title,
      url: l.url,
      subtitle: l.subtitle,
      icon: l.icon,
      featured: l.featured,
    })),
  };
}

export async function recordPageView() {
  await prisma.pageView.create({ data: {} });
}
