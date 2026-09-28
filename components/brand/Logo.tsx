// TODO: replace with official logo asset from /public/logo.svg once it's provided.
// This component approximates the RMZ wordmark (lowercase "rmz" + three colored
// squares above the "m") using text + CSS so it scales cleanly at any size in
// the meantime.

const SIZE_CLASSES = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
} as const;

interface LogoProps {
  size?: keyof typeof SIZE_CLASSES;
  trademark?: boolean;
  className?: string;
}

export function Logo({ size = "md", trademark = false, className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-end font-display font-bold tracking-tight text-rmz-red select-none ${SIZE_CLASSES[size]} ${className}`}
      role="img"
      aria-label="Rebel Mind Zone"
    >
      <span>r</span>
      <span className="relative inline-block">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[0.85em] gap-[0.08em]"
        >
          <span className="block h-[0.2em] w-[0.2em] rounded-[1.5px] bg-rmz-yellow" />
          <span className="block h-[0.2em] w-[0.2em] rounded-[1.5px] bg-rmz-orange" />
          <span className="block h-[0.2em] w-[0.2em] rounded-[1.5px] bg-rmz-green" />
        </span>
        m
      </span>
      <span>z</span>
      {trademark && (
        <sup className="ml-0.5 text-[0.32em] font-normal opacity-80">&reg;</sup>
      )}
    </span>
  );
}
