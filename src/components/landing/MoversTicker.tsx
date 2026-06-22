"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Flame } from "lucide-react";
import { MOVERS } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import type { LaunchMover } from "@/types";

function MoverItem({ m }: { m: LaunchMover }) {
  const up = m.priceChange >= 0;
  return (
    <Link
      href={`/token/${m.slug}`}
      className="group flex shrink-0 items-center gap-2 rounded-xl border border-purple-100 bg-white/70 px-3 py-1.5 transition hover:border-purple-300 hover:bg-white"
    >
      <ProjectLogo name={m.name} seed={m.slug} size={22} rounded="rounded-md" />
      <span className="text-sm font-semibold">{m.symbol}</span>
      <span className="text-xs text-muted">${formatCompact(m.marketCap)}</span>
      <span
        className={`flex items-center gap-0.5 text-xs font-bold ${
          up ? "text-emerald-600" : "text-rose-500"
        }`}
      >
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {up ? "+" : ""}
        {m.priceChange.toFixed(1)}%
      </span>
    </Link>
  );
}

export function MoversTicker() {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...MOVERS, ...MOVERS];

  return (
    <div className="relative border-y border-purple-100 bg-white/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="z-10 flex shrink-0 items-center gap-1.5 py-2 pr-3 text-xs font-bold uppercase tracking-wide text-purple-700">
          <Flame className="h-4 w-4 text-joy-500" />
          Movers
        </div>

        {/* marquee viewport */}
        <div className="relative flex-1 overflow-hidden py-2">
          <motion.div
            className="flex w-max gap-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {loop.map((m, i) => (
              <MoverItem key={`${m.slug}-${i}`} m={m} />
            ))}
          </motion.div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-canvas to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas to-transparent" />
        </div>
      </div>
    </div>
  );
}
