"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * A soft radial glow that trails the cursor across the whole site.
 * Fixed, non-interactive, GPU-friendly. Hidden on touch devices.
 */
export function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.4 });

  const left = useTransform(sx, (v) => v - 280);
  const top = useTransform(sy, (v) => v - 280);

  useEffect(() => {
    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ left, top }}
      className="pointer-events-none fixed z-30 hidden h-[560px] w-[560px] rounded-full md:block"
    >
      <div
        className="h-full w-full rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(124,71,245,0.16) 0%, rgba(255,204,20,0.10) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}
