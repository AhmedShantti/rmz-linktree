"use client";

import Image from "next/image";
import type { PublicLink } from "@/lib/types";
import type { RmzColorKey } from "@/lib/colors";
import type { ButtonStyle } from "@/lib/types";

interface LinkButtonProps {
  link: PublicLink;
  accentColor: RmzColorKey;
  buttonStyle: ButtonStyle;
  index: number;
}

const ACCENT_BG: Record<RmzColorKey, string> = {
  red: "bg-rmz-red",
  yellow: "bg-rmz-yellow",
  orange: "bg-rmz-orange",
  green: "bg-rmz-green",
  beige: "bg-rmz-beige",
  black: "bg-rmz-black",
};

const ACCENT_DARK_TEXT: Set<RmzColorKey> = new Set(["yellow", "beige", "green"]);

const STYLE_CLASSES: Record<ButtonStyle, string> = {
  glass: "bg-white/10 border border-white/20 backdrop-blur-md text-rmz-beige",
  beige: "bg-rmz-beige/95 border border-transparent text-rmz-black",
  black: "bg-rmz-black/80 border border-white/10 backdrop-blur-md text-rmz-beige",
};

function isImagePath(icon: string) {
  return icon.startsWith("/") || icon.startsWith("http");
}

export function LinkButton({ link, accentColor, buttonStyle, index }: LinkButtonProps) {
  const handleClick = () => {
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId: link.id }),
      keepalive: true,
    }).catch(() => {});
  };

  const featuredClasses = link.featured
    ? `${ACCENT_BG[accentColor]} ${ACCENT_DARK_TEXT.has(accentColor) ? "text-rmz-black" : "text-rmz-beige"} border-transparent font-bold text-lg py-5 shadow-xl shadow-black/30`
    : `${STYLE_CLASSES[buttonStyle]} font-medium text-base py-4`;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`rmz-link-enter group flex w-full items-center gap-3 rounded-2xl px-5 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${featuredClasses}`}
    >
      {link.icon &&
        (isImagePath(link.icon) ? (
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md">
            <Image src={link.icon} alt="" fill sizes="28px" className="object-cover" />
          </span>
        ) : (
          <span className="shrink-0 text-xl leading-none">{link.icon}</span>
        ))}
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="truncate">{link.title}</span>
        {link.subtitle && (
          <span className="truncate text-sm font-normal opacity-75">{link.subtitle}</span>
        )}
      </span>
    </a>
  );
}
