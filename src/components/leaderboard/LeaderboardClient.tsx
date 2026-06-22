"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Trophy, Medal, Search } from "lucide-react";
import { LEADERBOARD } from "@/lib/mock-data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Pill } from "@/components/ui/Badge";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type SortKey = "workScore" | "credibility" | "progress";

const STAGE_TONE: Record<Project["stage"], "purple" | "joy" | "green" | "neutral"> = {
  BUILDING: "purple",
  PROVING: "purple",
  ELIGIBLE: "green",
  LAUNCHING: "joy",
  LAUNCHED: "neutral",
};

const RANK_ICON = [Crown, Trophy, Medal];

export function LeaderboardClient() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("workScore");

  const rows = LEADERBOARD
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip bg-purple-100 text-purple-700">Global ranking</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-2 text-muted">Every project, ranked by verifiable work.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects…"
              className="rounded-xl border border-purple-100 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-300"
            />
          </div>
          <div className="flex rounded-xl border border-purple-100 bg-white/70 p-1 text-sm">
            {(["workScore", "credibility", "progress"] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-medium capitalize transition",
                  sort === k ? "bg-purple-600 text-white" : "text-muted hover:text-purple-700"
                )}
              >
                {k === "workScore" ? "Score" : k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass-strong">
        <div className="grid grid-cols-12 gap-2 border-b border-purple-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
          <div className="col-span-1">#</div>
          <div className="col-span-5 sm:col-span-4">Project</div>
          <div className="col-span-3 sm:col-span-2 text-right">Score</div>
          <div className="col-span-3 sm:col-span-3 hidden sm:block">Progress</div>
          <div className="col-span-3 sm:col-span-2 text-right">Stage</div>
        </div>

        {rows.map((p, i) => {
          const Icon = RANK_ICON[i];
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="grid grid-cols-12 items-center gap-2 border-b border-purple-50 px-5 py-4 hover:bg-purple-50/50"
            >
              <div className="col-span-1 flex items-center gap-1 font-mono font-bold text-purple-600">
                {Icon ? <Icon className="h-4 w-4 text-joy-500" /> : null}
                {i + 1}
              </div>
              <div className="col-span-5 sm:col-span-4">
                <Link href={`/dashboard?p=${p.slug}`} className="flex items-center gap-3">
                  <ProjectLogo name={p.name} seed={p.slug} size={36} rounded="rounded-lg" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{p.name}</div>
                    <div className="truncate text-xs text-muted">{p.tagline}</div>
                  </div>
                </Link>
              </div>
              <div className="col-span-3 sm:col-span-2 text-right font-display font-bold gradient-text">
                {sort === "credibility" ? p.credibility : sort === "progress" ? `${p.progress}%` : p.workScore}
              </div>
              <div className="col-span-3 sm:col-span-3 hidden sm:block">
                <ProgressBar value={p.progress} />
              </div>
              <div className="col-span-3 sm:col-span-2 text-right">
                <Pill tone={STAGE_TONE[p.stage]}>{p.stage.toLowerCase()}</Pill>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
