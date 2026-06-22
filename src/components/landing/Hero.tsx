"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { Particles } from "@/components/effects/Particles";
import { PLATFORM_STATS } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";

const stats = [
  { label: "Projects building", value: PLATFORM_STATS.projects },
  { label: "Milestones verified", value: PLATFORM_STATS.milestonesVerified },
  { label: "SOL raised", value: PLATFORM_STATS.capitalRaised },
  { label: "Builders onboarded", value: PLATFORM_STATS.buildersOnboarded },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Normalized pointer position (-0.5 … 0.5), centered.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // Parallax depth — each layer moves a different amount.
  const gridX = useTransform(sx, [-0.5, 0.5], [20, -20]);
  const gridY = useTransform(sy, [-0.5, 0.5], [14, -14]);
  const cityX = useTransform(sx, [-0.5, 0.5], [40, -40]);
  const cityY = useTransform(sy, [-0.5, 0.5], [22, -22]);
  const partX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const partY = useTransform(sy, [-0.5, 0.5], [-18, 18]);
  const contentX = useTransform(sx, [-0.5, 0.5], [-12, 12]);

  // Subtle 3D tilt of the whole scene.
  const rotX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ x: gridX, y: gridY }}
          className="absolute inset-[-4%] bg-grid-purple [background-size:42px_42px]"
        />
        <motion.div style={{ x: partX, y: partY }} className="absolute inset-[-6%]">
          <Particles density={50} />
        </motion.div>

        {/* floating glow orbs for extra depth */}
        <motion.div
          style={{ x: cityX, y: cityY }}
          className="absolute left-[12%] top-[20%] h-40 w-40 rounded-full bg-purple-300/30 blur-3xl animate-float"
        />
        <motion.div
          style={{ x: partX, y: partY }}
          className="absolute right-[14%] top-[30%] h-48 w-48 rounded-full bg-joy-300/30 blur-3xl animate-float"
        />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <motion.div
          style={{ x: contentX }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="chip bg-white/70 text-purple-700 shadow-glass backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Proof-of-Work Launchpad · Built on Solana
          </span>

          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Don&apos;t Buy The Hype.{" "}
            <span className="gradient-text">Buy The Work.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            The first launchpad where builders earn launch rights through real
            execution instead of paying deployment fees.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#leaderboard" className="btn-secondary">
              <Compass className="h-4 w-4" /> Explore Projects
            </Link>
          </div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="glass rounded-2xl px-5 py-4"
            >
              <div className="font-display text-2xl font-bold gradient-text sm:text-3xl">
                {formatCompact(s.value)}
              </div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
