import { Sora, Fraunces } from "next/font/google";

/**
 * License-free stand-ins for the real brand typefaces:
 *   TT Norms    -> Sora (geometric grotesk, close weight range)
 *   Ivar Display -> Fraunces (humanist display serif)
 *
 * TODO: drop licensed TT Norms / Ivar Display font files into /public/fonts
 * and switch these to next/font/local when available.
 */
export const fontSans = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
