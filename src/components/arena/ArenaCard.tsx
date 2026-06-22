"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, Rocket, Coins, Award } from "lucide-react";
import type { Project } from "@/types";
import { MIN_LAUNCH_SCORE } from "@/types";
import { Countdown } from "./Countdown";
import { LaunchTokenModal } from "./LaunchTokenModal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProjectLogo } from "@/components/ui/ProjectLogo";

export function ArenaCard({ project }: { project: Project }) {
  const [up, setUp] = useState(project.votesUp);
  const [down, setDown] = useState(project.votesDown);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const total = up + down;
  const approval = total ? Math.round((up / total) * 100) : 0;
  const eligible = project.workScore >= MIN_LAUNCH_SCORE;

  function vote(dir: "up" | "down") {
    if (voted === dir) {
      if (dir === "up") setUp((v) => v - 1);
      else setDown((v) => v - 1);
      setVoted(null);
      return;
    }
    if (voted === "up") setUp((v) => v - 1);
    if (voted === "down") setDown((v) => v - 1);
    if (dir === "up") setUp((v) => v + 1);
    else setDown((v) => v + 1);
    setVoted(dir);
  }

  return (
    <TiltCard className="p-6" intensity={6}>
      <div className="flex items-center gap-3">
        <ProjectLogo name={project.name} seed={project.slug} size={48} />
        <div>
          <h3 className="font-display text-lg font-bold">{project.name}</h3>
          <p className="text-xs text-muted">{project.tagline}</p>
        </div>
        <span className="ml-auto font-mono text-sm font-bold text-purple-600">#{project.rank}</span>
      </div>

      {/* Countdown */}
      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Launch countdown
        </div>
        {project.launchAt ? (
          <Countdown target={project.launchAt} />
        ) : (
          <div className="rounded-xl bg-purple-50 px-3 py-3 text-center text-sm text-muted">
            Awaiting schedule
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric Icon={Coins} label="Capital raised" value={`${project.capitalRaised} SOL`} />
        <Metric Icon={Award} label="Reputation" value={`${project.credibility}/100`} />
      </div>

      {/* Votes */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>Community approval</span>
          <span className="font-semibold text-purple-700">{approval}%</span>
        </div>
        <ProgressBar value={approval} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => vote("up")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              voted === "up"
                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                : "border-purple-100 bg-white/70 hover:bg-emerald-50"
            }`}
          >
            <ArrowBigUp className="h-4 w-4" /> {up}
          </button>
          <button
            onClick={() => vote("down")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              voted === "down"
                ? "border-rose-300 bg-rose-100 text-rose-700"
                : "border-purple-100 bg-white/70 hover:bg-rose-50"
            }`}
          >
            <ArrowBigDown className="h-4 w-4" /> {down}
          </button>
        </div>
      </div>

      {/* Launch action */}
      <div className="mt-5">
        <button
          onClick={() => setModalOpen(true)}
          disabled={!eligible}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Rocket className="h-4 w-4" /> {eligible ? "Launch token" : "Not eligible yet"}
        </button>
        {!eligible && (
          <p className="mt-2 text-center text-xs text-muted">
            Needs {MIN_LAUNCH_SCORE - project.workScore} more points to launch.
          </p>
        )}
      </div>

      <LaunchTokenModal
        project={project}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </TiltCard>
  );
}

function Metric({ Icon, label, value }: { Icon: typeof Coins; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-purple-50/70 p-3">
      <Icon className="h-4 w-4 text-purple-600" />
      <div className="mt-1 font-display font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
