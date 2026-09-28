/**
 * RMZ brand palette — single source of truth.
 * Mirrored as CSS custom properties in app/globals.css (Tailwind v4 `@theme`),
 * so `bg-rmz-red`, `text-rmz-beige`, etc. are available as utility classes.
 */
export const RMZ_COLORS = {
  red: "#d52518",
  yellow: "#ffca26",
  orange: "#f86015",
  green: "#9acc42",
  beige: "#f3e8cc",
  black: "#0f0f0e",
} as const;

export type RmzColorKey = keyof typeof RMZ_COLORS;

export const RMZ_COLOR_KEYS = Object.keys(RMZ_COLORS) as RmzColorKey[];

export function isRmzColorKey(value: string): value is RmzColorKey {
  return value in RMZ_COLORS;
}
