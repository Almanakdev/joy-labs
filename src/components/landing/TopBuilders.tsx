"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";
import { LEADERBOARD } from "@/lib/mock-data";
import { Section } from "@/components/ui/Section";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProjectLogo } from "@/components/ui/ProjectLogo";

const RANK_ICON = [Crown, Trophy, Medal];

export function TopBuilders() {
  const top = LEADERBOARD.slice(0, 6);
  return (
    <Section
      id="leaderboard"
      eyebrow="Top Builders"
      title="The leaderboard rewards execution"
      subtitle="Ranked by Work Score — points earned only by completing and verifying real milestones."
    >
      <div className="overflow-hidden rounded-2xl glass-strong">
        <div className="grid grid-cols-12 gap-2 border-b border-purple-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5 sm:col-span-4">Project</div>
          <div className="col-span-3 sm:col-span-2 text-right">Work Score</div>
          <div className="col-span-3 hidden sm:block sm:col-span-3">Progress</div>
          <div className="col-span-3 sm:col-span-2 text-right">Stage</div>
        </div>

        {top.map((p, i) => {
          const Icon = RANK_ICON[i];
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-12 items-center gap-2 border-b border-purple-50 px-5 py-4 transition hover:bg-purple-50/50"
            >
              <div className="col-span-1 flex items-center gap-1 font-mono font-bold text-purple-600">
                {Icon ? <Icon className="h-4 w-4 text-joy-500" /> : null}
                {p.rank}
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
                {p.workScore}
              </div>
              <div className="col-span-3 hidden sm:block sm:col-span-3">
                <ProgressBar value={p.progress} />
              </div>
              <div className="col-span-3 sm:col-span-2 text-right text-xs font-semibold text-purple-700">
                {p.progress}%
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Link href="/leaderboard" className="btn-ghost">View full leaderboard</Link>
      </div>
    </Section>
  );
}
