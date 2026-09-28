interface WallpaperProps {
  blurPx: number;
  scrimOpacity: number;
}

/**
 * Fixed, full-bleed background photo with a tweakable blur + dark scrim so
 * foreground text/buttons stay legible. The photo itself stays sharp in its
 * own layer; a separate backdrop-blur layer sits on top of it so the blur
 * amount can be adjusted live from the admin Appearance panel without
 * pre-processing the image.
 */
export function Wallpaper({ blurPx, scrimOpacity }: WallpaperProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-rmz-black" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/wallpaper.png)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-rmz-black via-rmz-black/50 to-rmz-black"
        style={{ opacity: scrimOpacity }}
      />
    </div>
  );
}
