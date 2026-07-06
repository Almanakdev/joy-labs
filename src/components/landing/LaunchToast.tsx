"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, TrendingUp, TrendingDown, X } from "lucide-react";
import { MOVERS } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";
import { playLaunchAmbient } from "@/lib/sound";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import type { LaunchMover } from "@/types";

type Toast = LaunchMover & { key: string };

/**
 * Pump.fun-style pop-ups: a fresh "just launched" card slides in from the
 * bottom-left every few seconds, then auto-dismisses.
 */
export function LaunchToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let i = 0;
    function push() {
      const m = MOVERS[i % MOVERS.length];
      i++;
      const key = `${m.slug}-${Date.now()}`;
      setToasts((prev) => [...prev, { ...m, key }].slice(-3));
      playLaunchAmbient();
      // auto-dismiss after 5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.key !== key));
      }, 5000);
    }

    const first = setTimeout(push, 2500);
    const interval = setInterval(push, 6000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  function dismiss(key: string) {
    setToasts((prev) => prev.filter((t) => t.key !== key));
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const up = t.priceChange >= 0;
          return (
            <motion.div
              key={t.key}
              layout
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="pointer-events-auto relative overflow-hidden rounded-2xl glass-strong p-3 shadow-glow"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-500 to-joy-500" />
              <button
                onClick={() => dismiss(t.key)}
                className="absolute right-2 top-2 rounded-md p-1 text-muted transition hover:bg-purple-50 hover:text-purple-700"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <Link href={`/token/${t.slug}`} className="flex items-center gap-3 pr-5">
                <ProjectLogo name={t.name} seed={t.slug} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-purple-700">
                    <Rocket className="h-3 w-3" /> Just launched
                  </div>
                  <div className="truncate font-semibold leading-tight">
                    {t.name}{" "}
                    <span className="text-muted">${t.symbol}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className="text-muted">MC ${formatCompact(t.marketCap)}</span>
                    <span
                      className={`flex items-center gap-0.5 font-bold ${
                        up ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {up ? "+" : ""}
                      {t.priceChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
