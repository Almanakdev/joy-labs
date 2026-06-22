"use client";

import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Target } from "lucide-react";
import type { Project } from "@/types";
import { MIN_LAUNCH_SCORE } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function WorkScorePanel({ project }: { project: Project }) {
  const verified = project.milestones.filter((m) => m.status === "VERIFIED").length;
  const toLaunch = Math.max(0, MIN_LAUNCH_SCORE - project.workScore);
  const launchPct = Math.min(100, Math.round((project.workScore / MIN_LAUNCH_SCORE) * 100));

  return (
    <div className="rounded-2xl glass-strong p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Work Score</h3>
        <span className="chip bg-purple-100 text-purple-700">Rank #{project.rank}</span>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-5xl font-extrabold gradient-text"
        >
          {project.workScore}
        </motion.span>
        <span className="mb-2 text-sm text-muted">/ {MIN_LAUNCH_SCORE} to launch</span>
      </div>

      <ProgressBar value={launchPct} tone="joy" className="mt-3" />
      <p className="mt-2 text-xs text-muted">
        {toLaunch > 0
          ? `${toLaunch} points until the Launch Arena unlocks.`
          : "Launch threshold reached — eligible for the Arena!"}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat Icon={CheckCircle2} label="Verified" value={`${verified}/${project.milestones.length}`} />
        <Stat Icon={Target} label="Progress" value={`${project.progress}%`} />
        <Stat Icon={Trophy} label="Credibility" value={`${project.credibility}`} />
      </div>
    </div>
  );
}

function Stat({ Icon, label, value }: { Icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-purple-50/70 p-3">
      <Icon className="mx-auto h-4 w-4 text-purple-600" />
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
