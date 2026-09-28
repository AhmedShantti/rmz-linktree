export function EmptyState({ dark = true }: { dark?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center ${
        dark ? "border-white/20 text-rmz-beige/80" : "border-rmz-black/20 text-rmz-black/70"
      }`}
    >
      <p className="font-display text-lg italic">Nothing here yet — the rebellion is loading&hellip;</p>
      <p className="text-sm opacity-70">Check back soon. Extraordinary ideas take a moment.</p>
    </div>
  );
}
