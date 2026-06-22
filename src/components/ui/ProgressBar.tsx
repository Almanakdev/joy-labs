"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "purple",
  showLabel = false,
}: {
  value: number;
  className?: string;
  tone?: "purple" | "joy";
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const bar = tone === "joy" ? "from-joy-300 to-joy-500" : "from-purple-400 to-purple-600";
  return (
    <div className={cn("relative", className)}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-100">
        <motion.div
          className={cn("relative h-full rounded-full bg-gradient-to-r shimmer", bar)}
          initial={{ width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 block text-right text-xs font-semibold text-muted">
          {clamped}%
        </span>
      )}
    </div>
  );
}
