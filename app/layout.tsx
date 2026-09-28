import type { Metadata } from "next";
import { fontSans, fontDisplay } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rebel Mind Zone",
  description:
    "A bold creative mind that dares to challenge the ordinary in order to create extraordinary ideas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
