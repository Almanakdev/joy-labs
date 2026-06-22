"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";
import { ACTIVITY_FEED } from "@/lib/mock-data";
import { Section } from "@/components/ui/Section";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { timeAgo } from "@/lib/utils";
import type { ActivityEvent } from "@/types";

const KIND_DOT: Record<ActivityEvent["kind"], string> = {
  MILESTONE_VERIFIED: "bg-emerald-500",
  SUBMITTED: "bg-joy-400",
  VOTE: "bg-purple-400",
  LAUNCH: "bg-purple-600",
};

export function MilestonesFeed() {
  // Simulate a live feed by rotating items to the top every few seconds.
  const [events, setEvents] = useState<ActivityEvent[]>(ACTIVITY_FEED);
  // Relative timestamps must render client-only to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = setInterval(() => {
      setEvents((prev) => {
        const [last, ...rest] = [...prev].reverse();
        const refreshed: ActivityEvent = {
          ...last,
          id: `${last.id}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        return [refreshed, ...rest.reverse()].slice(0, 14);
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section
      id="feed"
      eyebrow="Recent Milestones"
      title="Watch the work happen, live"
      subtitle="Every verified milestone, submission and launch streams here in real time."
    >
      <div className="rounded-2xl glass-strong p-2 sm:p-4">
        <div className="mb-2 flex items-center gap-2 px-3 py-1 text-sm font-semibold text-purple-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          Live activity
          <Activity className="ml-auto h-4 w-4 text-muted" />
        </div>

        <div className="max-h-[420px] space-y-1 overflow-y-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-purple-50/60"
              >
                <ProjectLogo name={e.projectName} seed={e.projectSlug} size={36} rounded="rounded-lg" />
                <span className={`h-2 w-2 shrink-0 rounded-full ${KIND_DOT[e.kind]}`} />
                <p className="min-w-0 flex-1 truncate text-sm">{e.message}</p>
                <span suppressHydrationWarning className="shrink-0 text-xs text-muted">
                  {mounted ? timeAgo(e.createdAt) : "now"}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
