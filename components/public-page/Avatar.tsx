import Image from "next/image";
import { Logo } from "@/components/brand/Logo";

interface AvatarProps {
  src: string | null;
  alt: string;
}

export function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-rmz-red shadow-lg shadow-black/30">
      {src ? (
        <Image src={src} alt={alt} fill sizes="96px" className="object-cover" priority />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-rmz-beige">
          <Logo size="sm" className="scale-90" />
        </div>
      )}
    </div>
  );
}
