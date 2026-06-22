"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, Twitter, Github, ScanLine, GitBranch, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_PROJECTS, getProject } from "@/lib/mock-data";
import { WorkScorePanel } from "./WorkScorePanel";
import { MilestoneCard } from "./MilestoneCard";
import { AiReviewPanel } from "./AiReviewPanel";
import { Pill } from "@/components/ui/Badge";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { cn } from "@/lib/utils";

export function DashboardClient() {
  const params = useSearchParams();
  const initial = params.get("p") ?? MOCK_PROJECTS[0].slug;
  const [slug, setSlug] = useState(initial);
  const project = getProject(slug) ?? MOCK_PROJECTS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Project switcher */}
      <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar">
        {MOCK_PROJECTS.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSlug(p.slug)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
              p.slug === slug
                ? "border-purple-300 bg-purple-600 text-white shadow-glow"
                : "border-purple-100 bg-white/70 text-muted hover:bg-white"
            )}
          >
            <ProjectLogo name={p.name} seed={p.slug} size={20} rounded="rounded-md" />
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: profile */}
        <motion.div
          key={project.slug + "-profile"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="rounded-2xl glass-strong p-6">
            <div className="flex items-center gap-4">
              <ProjectLogo name={project.name} seed={project.slug} size={64} rounded="rounded-2xl" />
              <div>
                <h1 className="font-display text-2xl font-bold">{project.name}</h1>
                <p className="text-sm text-muted">{project.tagline}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted">{project.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.openSource && (
                <Pill tone="neutral"><GitBranch className="h-3 w-3" /> Open source</Pill>
              )}
              {project.contractScanned && (
                <Pill tone="green"><ScanLine className="h-3 w-3" /> Contract scanned</Pill>
              )}
              <Pill tone="purple"><ShieldCheck className="h-3 w-3" /> Anti-rug {project.credibility}</Pill>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.website && (
                <a href={project.website} className="btn-ghost !py-2 text-sm">
                  <Globe className="h-4 w-4" /> Website
                </a>
              )}
              {project.twitter && (
                <a href={project.twitter} className="btn-ghost !py-2 text-sm">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              )}
              {project.github && (
                <a href={project.github} className="btn-ghost !py-2 text-sm">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
            </div>
          </div>

          <div className="mt-6">
            <WorkScorePanel project={project} />
          </div>
        </motion.div>

        {/* Right: milestones + AI review */}
        <div className="space-y-6 lg:col-span-2">
          <AiReviewPanel project={project} />

          <div>
            <h2 className="mb-4 font-display text-xl font-bold">Milestone System</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.milestones.map((m, i) => (
                <MilestoneCard key={m.id} m={m} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
