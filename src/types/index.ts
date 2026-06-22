// Shared domain types for Joy Labs.
// These mirror the Prisma models but are plain serializable types
// safe to use in client components.

export type MilestoneType =
  | "WEBSITE"
  | "WHITEPAPER"
  | "DEMO"
  | "GITHUB"
  | "AUDIT"
  | "COMMUNITY";

export type MilestoneStatus =
  | "LOCKED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export type ProjectStage =
  | "BUILDING"
  | "PROVING"
  | "ELIGIBLE"
  | "LAUNCHING"
  | "LAUNCHED";

export interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  description?: string;
  status: MilestoneStatus;
  points: number;
  proofUrl?: string;
  verifiedBy?: string;
  completedAt?: string | null;
}

export interface AiReview {
  summary: string;
  score: number;
  strengths: string[];
  risks: string[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  twitter?: string;
  github?: string;
  stage: ProjectStage;
  workScore: number;
  credibility: number;
  progress: number;
  rank?: number;
  launchAt?: string | null;
  votesUp: number;
  votesDown: number;
  capitalRaised: number; // SOL
  tokenMint?: string | null;
  openSource: boolean;
  contractScanned: boolean;
  milestones: Milestone[];
  review?: AiReview;
}

export interface LaunchMover {
  slug: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  mint: string;
  priceChange: number; // % since launch (can be negative)
  marketCap: number; // USD
  launchedAt: string; // ISO
}

export interface ActivityEvent {
  id: string;
  projectSlug: string;
  projectName: string;
  logoUrl?: string;
  kind: "MILESTONE_VERIFIED" | "VOTE" | "LAUNCH" | "SUBMITTED";
  message: string;
  createdAt: string; // ISO
}

export const MILESTONE_META: Record<
  MilestoneType,
  { label: string; points: number; icon: string }
> = {
  WEBSITE: { label: "Website", points: 100, icon: "Globe" },
  WHITEPAPER: { label: "Whitepaper", points: 150, icon: "FileText" },
  DEMO: { label: "Demo", points: 200, icon: "PlayCircle" },
  GITHUB: { label: "GitHub", points: 150, icon: "Github" },
  AUDIT: { label: "Audit", points: 250, icon: "ShieldCheck" },
  COMMUNITY: { label: "Community", points: 150, icon: "Users" },
};

export const MIN_LAUNCH_SCORE = Number(
  process.env.NEXT_PUBLIC_MIN_LAUNCH_SCORE ?? 750
);
