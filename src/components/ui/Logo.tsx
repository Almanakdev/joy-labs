import { cn } from "@/lib/utils";

/**
 * Joy Labs logo — renders the brand mascot image from /public/joylabs-logo.png.
 * Save the artwork there (see README / setup note).
 */

const SIZES = { sm: 28, md: 40, lg: 64 } as const;

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const px = SIZES[size];
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/joylabs-logo.png"
        alt="Joy Labs"
        height={px}
        style={{ height: px }}
        className="w-auto select-none"
      />
    </span>
  );
}
