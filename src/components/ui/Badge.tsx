import { cn } from "@/lib/utils";
import { Check, Clock, Loader2, Lock, X } from "lucide-react";
import type { MilestoneStatus } from "@/types";

const MAP: Record<
  MilestoneStatus,
  { label: string; className: string; Icon: typeof Check }
> = {
  VERIFIED: { label: "Verified", className: "bg-emerald-100 text-emerald-700", Icon: Check },
  SUBMITTED: { label: "In review", className: "bg-joy-100 text-joy-800", Icon: Clock },
  IN_PROGRESS: { label: "Building", className: "bg-purple-100 text-purple-700", Icon: Loader2 },
  REJECTED: { label: "Rejected", className: "bg-rose-100 text-rose-700", Icon: X },
  LOCKED: { label: "Locked", className: "bg-slate-100 text-slate-500", Icon: Lock },
};

export function StatusBadge({ status }: { status: MilestoneStatus }) {
  const { label, className, Icon } = MAP[status];
  return (
    <span className={cn("chip", className)}>
      <Icon className={cn("h-3.5 w-3.5", status === "IN_PROGRESS" && "animate-spin")} />
      {label}
    </span>
  );
}

export function Pill({
  children,
  tone = "purple",
  className,
}: {
  children: React.ReactNode;
  tone?: "purple" | "joy" | "neutral" | "green";
  className?: string;
}) {
  const tones = {
    purple: "bg-purple-100 text-purple-700",
    joy: "bg-joy-100 text-joy-800",
    neutral: "bg-slate-100 text-slate-600",
    green: "bg-emerald-100 text-emerald-700",
  };
  return <span className={cn("chip", tones[tone], className)}>{children}</span>;
}
