import type { RmzColorKey } from "./colors";

export type ProfileTheme = "dark" | "beige";
export type ButtonStyle = "glass" | "beige" | "black";

export interface PublicProfile {
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: ProfileTheme;
  blurPx: number;
  scrimOpacity: number;
  accentColor: RmzColorKey;
  buttonStyle: ButtonStyle;
}

export type LinkType = "link" | "social";

export interface PublicLink {
  id: string;
  type: LinkType;
  title: string;
  url: string;
  subtitle: string | null;
  icon: string | null;
  featured: boolean;
}

export interface PublicData {
  profile: PublicProfile;
  links: PublicLink[];
}
