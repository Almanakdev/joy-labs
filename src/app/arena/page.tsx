import { UPCOMING_LAUNCHES } from "@/lib/mock-data";
import { ArenaCard } from "@/components/arena/ArenaCard";
import { Rocket } from "lucide-react";

export const metadata = {
  title: "Launch Arena — HyperJoy",
  description: "Projects that earned launch rights. Vote, back, and deploy.",
};

export default function ArenaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="chip bg-purple-100 text-purple-700">
          <Rocket className="h-3.5 w-3.5" /> Launch Arena
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
          Where earned work becomes a launch
        </h1>
        <p className="mt-3 text-lg text-muted">
          Only projects above the Work Score threshold appear here. Track the countdown,
          weigh in with votes, and back the builders who proved it.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {UPCOMING_LAUNCHES.map((p) => (
          <ArenaCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
