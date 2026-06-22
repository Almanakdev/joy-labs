import { cn } from "@/lib/utils";

/**
 * Deterministic branded logo mark.
 * Generates a unique gradient + monogram per project from a seed, so the app
 * looks like a real product without depending on external image hosting.
 */

const GRADIENTS: [string, string][] = [
  ["#7c47f5", "#b69dff"],
  ["#6a2fe0", "#9a73ff"],
  ["#f5b800", "#ffdb45"],
  ["#0ea5e9", "#67e8f9"],
  ["#10b981", "#6ee7b7"],
  ["#f43f5e", "#fda4af"],
  ["#8b5cf6", "#f5b800"],
  ["#ec4899", "#f9a8d4"],
  ["#3b1a7a", "#7c47f5"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProjectLogo({
  name,
  seed,
  size = 44,
  rounded = "rounded-xl",
  className,
}: {
  name: string;
  seed?: string;
  size?: number;
  rounded?: string;
  className?: string;
}) {
  const key = seed ?? name;
  const [a, b] = GRADIENTS[hash(key) % GRADIENTS.length];
  const fontSize = Math.max(10, Math.round(size * 0.4));

  return (
    <span
      aria-label={`${name} logo`}
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden font-display font-bold leading-none text-white shadow-sm ring-1 ring-black/5",
        rounded,
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize,
        background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      }}
    >
      {/* glassy highlights */}
      <span className="absolute -right-1/4 -top-1/3 h-1/2 w-1/2 rounded-full bg-white/25 blur-[1px]" />
      <span className="absolute -bottom-1/3 -left-1/4 h-1/2 w-1/2 rounded-full bg-black/10" />
      <span className="relative tracking-tight">{initials(name)}</span>
    </span>
  );
}
