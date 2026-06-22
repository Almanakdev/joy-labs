"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Github } from "lucide-react";
import type { Project } from "@/types";
import { TiltCard } from "./TiltCard";
import { ProgressBar } from "./ProgressBar";
import { Pill } from "./Badge";
import { ProjectLogo } from "./ProjectLogo";

const STAGE_LABEL: Record<Project["stage"], { label: string; tone: "purple" | "joy" | "green" | "neutral" }> = {
  BUILDING: { label: "Building", tone: "purple" },
  PROVING: { label: "Proving", tone: "purple" },
  ELIGIBLE: { label: "Launch eligible", tone: "green" },
  LAUNCHING: { label: "Launching", tone: "joy" },
  LAUNCHED: { label: "Launched", tone: "neutral" },
};

export function ProjectCard({ project }: { project: Project }) {
  const stage = STAGE_LABEL[project.stage];
  return (
    <TiltCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProjectLogo name={project.name} seed={project.slug} size={48} />
          <div>
            <Link
              href={`/dashboard?p=${project.slug}`}
              className="font-display text-lg font-bold leading-tight hover:text-purple-700"
            >
              {project.name}
            </Link>
            <p className="text-xs text-muted">{project.tagline}</p>
          </div>
        </div>
        {project.rank && (
          <span className="font-mono text-sm font-bold text-purple-600">#{project.rank}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone={stage.tone}>{stage.label}</Pill>
        {project.openSource && (
          <Pill tone="neutral"><Github className="h-3 w-3" /> Open source</Pill>
        )}
        {project.contractScanned && (
          <Pill tone="green"><ShieldCheck className="h-3 w-3" /> Scanned</Pill>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-end justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Work Score</span>
          <span className="font-display text-2xl font-bold gradient-text">{project.workScore}</span>
        </div>
        <ProgressBar value={project.progress} className="mt-2" />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{project.progress}% complete</span>
          <span>Credibility {project.credibility}/100</span>
        </div>
      </div>

      <Link
        href={`/dashboard?p=${project.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700 hover:gap-2 transition-all"
      >
        View profile <ArrowUpRight className="h-4 w-4" />
      </Link>
    </TiltCard>
  );
}
