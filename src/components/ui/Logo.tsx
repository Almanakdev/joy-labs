import { cn } from "@/lib/utils";

/**
 * Joy Labs wordmark lockup — "Joy" in brand yellow + "Labs", framed by four
 * corner dots. Vector text (rounded geometric font) so it stays crisp at any
 * size. `labs` controls the second-word color for light vs dark surfaces.
 */
export function Logo({
  className,
  size = "md",
  labs = "ink",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  labs?: "ink" | "white";
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  } as const;

  return (
    <span
      className={cn("relative inline-flex select-none items-center px-2 py-1", className)}
      style={{ fontFamily: "var(--font-logo)" }}
      aria-label="Joy Labs"
    >
      {/* corner dots */}
      <span className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-joy-400" />
      <span className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-joy-400" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1.5 rounded-full bg-joy-400" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-joy-400" />

      <span className={cn("font-bold leading-none tracking-tight", sizes[size])}>
        <span className="text-joy-500">Joy</span>
        <span className={labs === "white" ? "text-white" : "text-ink"}>Labs</span>
      </span>
    </span>
  );
}
