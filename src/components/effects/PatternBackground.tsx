/**
 * Site background — matches the Terminal: a solid deep-purple canvas with a
 * soft ambient purple/magenta glow. Kept plain so foreground text stays crisp.
 */
export function PatternBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#140826]">
      <div className="absolute inset-0 bg-[radial-gradient(60rem_42rem_at_18%_-8%,rgba(124,71,245,0.22),transparent_60%),radial-gradient(52rem_42rem_at_100%_0%,rgba(214,110,255,0.15),transparent_55%),radial-gradient(46rem_40rem_at_50%_118%,rgba(124,71,245,0.14),transparent_60%)]" />
    </div>
  );
}
