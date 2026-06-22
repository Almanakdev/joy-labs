"use client";

import {
  Globe,
  FileText,
  PlayCircle,
  Github,
  ShieldCheck,
  Users,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import type { Milestone, MilestoneType } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

const ICONS: Record<MilestoneType, typeof Globe> = {
  WEBSITE: Globe,
  WHITEPAPER: FileText,
  DEMO: PlayCircle,
  GITHUB: Github,
  AUDIT: ShieldCheck,
  COMMUNITY: Users,
};

export function MilestoneCard({ m, index }: { m: Milestone; index: number }) {
  const Icon = ICONS[m.type];
  const verified = m.status === "VERIFIED";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`relative rounded-2xl border p-5 transition ${
        verified
          ? "border-emerald-200 bg-emerald-50/40"
          : "border-purple-100 bg-white/70"
      } backdrop-blur`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-10 w-10 place-items-center rounded-xl ${
              verified ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-1.5 font-semibold">
              {m.title}
              {verified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
            </div>
            <div className="text-xs text-muted">+{m.points} pts</div>
          </div>
        </div>
        <StatusBadge status={m.status} />
      </div>

      <p className="mt-3 text-sm text-muted">{m.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted">
          {m.completedAt
            ? `Completed ${new Date(m.completedAt).toLocaleDateString()}`
            : m.status === "LOCKED"
            ? "Not started"
            : "Awaiting verification"}
        </span>
        {m.proofUrl ? (
          <a
            href={m.proofUrl}
            className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:underline"
          >
            Proof <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-muted">No proof yet</span>
        )}
      </div>
      {m.verifiedBy && (
        <div className="mt-2 text-xs text-emerald-700">Verified by {m.verifiedBy}</div>
      )}
    </motion.div>
  );
}
