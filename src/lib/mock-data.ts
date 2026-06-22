import type {
  ActivityEvent,
  LaunchMover,
  Milestone,
  MilestoneStatus,
  MilestoneType,
  Project,
} from "@/types";
import { MILESTONE_META } from "@/types";

const ALL_TYPES: MilestoneType[] = [
  "WEBSITE",
  "WHITEPAPER",
  "DEMO",
  "GITHUB",
  "AUDIT",
  "COMMUNITY",
];

function buildMilestones(
  slug: string,
  statuses: Partial<Record<MilestoneType, MilestoneStatus>>
): Milestone[] {
  return ALL_TYPES.map((type, i) => {
    const status = statuses[type] ?? "LOCKED";
    const meta = MILESTONE_META[type];
    return {
      id: `${slug}-${type}`,
      type,
      title: meta.label,
      description: descFor(type),
      status,
      points: meta.points,
      proofUrl:
        status === "VERIFIED" || status === "SUBMITTED"
          ? `https://proof.joylabs.xyz/${slug}/${type.toLowerCase()}`
          : undefined,
      verifiedBy: status === "VERIFIED" ? (type === "AUDIT" ? "OtterSec" : "Joy DAO") : undefined,
      completedAt:
        status === "VERIFIED"
          ? new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString()
          : null,
    };
  });
}

function descFor(type: MilestoneType): string {
  switch (type) {
    case "WEBSITE":
      return "Ship a live, public landing page describing the product.";
    case "WHITEPAPER":
      return "Publish tokenomics, mechanism design and roadmap.";
    case "DEMO":
      return "Deliver a working demo or testnet deployment.";
    case "GITHUB":
      return "Connect a public repository with real commit history.";
    case "AUDIT":
      return "Pass an independent smart-contract security audit.";
    case "COMMUNITY":
      return "Grow a verified community of real, active members.";
  }
}

function scoreFromMilestones(ms: Milestone[]): number {
  return ms.filter((m) => m.status === "VERIFIED").reduce((s, m) => s + m.points, 0);
}

function progressFromMilestones(ms: Milestone[]): number {
  const verified = ms.filter((m) => m.status === "VERIFIED").length;
  return Math.round((verified / ms.length) * 100);
}

type Seed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  website: string;
  twitter: string;
  github?: string;
  credibility: number;
  openSource: boolean;
  contractScanned: boolean;
  votesUp: number;
  votesDown: number;
  capitalRaised: number;
  launchAt?: string;
  tokenMint?: string;
  statuses: Partial<Record<MilestoneType, MilestoneStatus>>;
};

const inDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

const SEEDS: Seed[] = [
  {
    slug: "solforge",
    name: "SolForge",
    tagline: "On-chain CI/CD for Solana programs",
    description:
      "SolForge gives Solana teams reproducible builds, automated verification and one-click program deploys with rollback safety.",
    logoUrl: "🛠️",
    website: "https://solforge.dev",
    twitter: "https://twitter.com/solforge",
    github: "https://github.com/solforge/core",
    credibility: 92,
    openSource: true,
    contractScanned: true,
    votesUp: 1840,
    votesDown: 96,
    capitalRaised: 412,
    launchAt: inDays(2),
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "VERIFIED",
      DEMO: "VERIFIED",
      GITHUB: "VERIFIED",
      AUDIT: "VERIFIED",
      COMMUNITY: "VERIFIED",
    },
  },
  {
    slug: "lumen-pay",
    name: "Lumen Pay",
    tagline: "Stablecoin payroll for global teams",
    description:
      "Lumen Pay streams USDC salaries on Solana with compliance-ready receipts and instant off-ramps in 40+ countries.",
    logoUrl: "💸",
    website: "https://lumenpay.io",
    twitter: "https://twitter.com/lumenpay",
    github: "https://github.com/lumenpay/app",
    credibility: 86,
    openSource: true,
    contractScanned: true,
    votesUp: 1320,
    votesDown: 120,
    capitalRaised: 280,
    launchAt: inDays(5),
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "VERIFIED",
      DEMO: "VERIFIED",
      GITHUB: "VERIFIED",
      AUDIT: "VERIFIED",
      COMMUNITY: "SUBMITTED",
    },
  },
  {
    slug: "questline",
    name: "Questline",
    tagline: "Gamified onboarding for any dApp",
    description:
      "Questline turns protocol onboarding into XP-driven quests, rewarding real usage instead of mercenary airdrops.",
    logoUrl: "🎮",
    website: "https://questline.gg",
    twitter: "https://twitter.com/questlinegg",
    github: "https://github.com/questline/sdk",
    credibility: 78,
    openSource: true,
    contractScanned: true,
    votesUp: 980,
    votesDown: 140,
    capitalRaised: 150,
    launchAt: inDays(9),
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "VERIFIED",
      DEMO: "VERIFIED",
      GITHUB: "VERIFIED",
      AUDIT: "IN_PROGRESS",
      COMMUNITY: "VERIFIED",
    },
  },
  {
    slug: "depinhub",
    name: "DePIN Hub",
    tagline: "Marketplace for decentralized hardware",
    description:
      "DePIN Hub indexes and routes demand to real-world devices — from GPUs to weather sensors — with on-chain settlement.",
    logoUrl: "📡",
    website: "https://depinhub.xyz",
    twitter: "https://twitter.com/depinhub",
    github: "https://github.com/depinhub/registry",
    credibility: 71,
    openSource: true,
    contractScanned: false,
    votesUp: 640,
    votesDown: 88,
    capitalRaised: 64,
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "VERIFIED",
      DEMO: "VERIFIED",
      GITHUB: "VERIFIED",
      AUDIT: "LOCKED",
      COMMUNITY: "SUBMITTED",
    },
  },
  {
    slug: "novanft",
    name: "Nova NFT",
    tagline: "Composable, royalty-true creator tooling",
    description:
      "Nova gives creators enforceable royalties and programmable NFTs with a no-code studio built on Token Extensions.",
    logoUrl: "🎨",
    website: "https://nova.art",
    twitter: "https://twitter.com/novaart",
    github: "https://github.com/nova/studio",
    credibility: 64,
    openSource: false,
    contractScanned: true,
    votesUp: 410,
    votesDown: 130,
    capitalRaised: 0,
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "VERIFIED",
      DEMO: "SUBMITTED",
      GITHUB: "IN_PROGRESS",
      AUDIT: "LOCKED",
      COMMUNITY: "VERIFIED",
    },
  },
  {
    slug: "yieldnest",
    name: "YieldNest",
    tagline: "Risk-scored vaults for Solana DeFi",
    description:
      "YieldNest aggregates lending and LP strategies with transparent, audited risk scoring and circuit breakers.",
    logoUrl: "🪺",
    website: "https://yieldnest.fi",
    twitter: "https://twitter.com/yieldnest",
    github: "https://github.com/yieldnest/vaults",
    credibility: 58,
    openSource: true,
    contractScanned: false,
    votesUp: 290,
    votesDown: 70,
    capitalRaised: 0,
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "VERIFIED",
      DEMO: "IN_PROGRESS",
      GITHUB: "VERIFIED",
      AUDIT: "LOCKED",
      COMMUNITY: "LOCKED",
    },
  },
  {
    slug: "echofeed",
    name: "EchoFeed",
    tagline: "Decentralized oracle for social signals",
    description:
      "EchoFeed brings verifiable off-chain sentiment and event data on-chain for prediction markets and agents.",
    logoUrl: "📈",
    website: "https://echofeed.network",
    twitter: "https://twitter.com/echofeed",
    credibility: 49,
    openSource: false,
    contractScanned: false,
    votesUp: 160,
    votesDown: 55,
    capitalRaised: 0,
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "SUBMITTED",
      DEMO: "LOCKED",
      GITHUB: "IN_PROGRESS",
      AUDIT: "LOCKED",
      COMMUNITY: "LOCKED",
    },
  },
  {
    slug: "gridmind",
    name: "GridMind",
    tagline: "Agentic compute marketplace",
    description:
      "GridMind lets autonomous agents rent verifiable compute and pay per task with streaming micro-settlements.",
    logoUrl: "🧠",
    website: "https://gridmind.ai",
    twitter: "https://twitter.com/gridmind",
    credibility: 41,
    openSource: false,
    contractScanned: false,
    votesUp: 95,
    votesDown: 40,
    capitalRaised: 0,
    statuses: {
      WEBSITE: "VERIFIED",
      WHITEPAPER: "IN_PROGRESS",
      DEMO: "LOCKED",
      GITHUB: "LOCKED",
      AUDIT: "LOCKED",
      COMMUNITY: "LOCKED",
    },
  },
];

function stageFor(score: number, hasLaunch: boolean): Project["stage"] {
  if (hasLaunch) return "LAUNCHING";
  if (score >= 750) return "ELIGIBLE";
  if (score >= 400) return "PROVING";
  return "BUILDING";
}

export const MOCK_PROJECTS: Project[] = SEEDS.map((s) => {
  const milestones = buildMilestones(s.slug, s.statuses);
  const workScore = scoreFromMilestones(milestones);
  const progress = progressFromMilestones(milestones);
  return {
    id: s.slug,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    description: s.description,
    logoUrl: s.logoUrl,
    website: s.website,
    twitter: s.twitter,
    github: s.github,
    stage: stageFor(workScore, Boolean(s.launchAt)),
    workScore,
    credibility: s.credibility,
    progress,
    launchAt: s.launchAt ?? null,
    votesUp: s.votesUp,
    votesDown: s.votesDown,
    capitalRaised: s.capitalRaised,
    tokenMint: s.tokenMint ?? null,
    openSource: s.openSource,
    contractScanned: s.contractScanned,
    milestones,
  };
})
  .sort((a, b) => b.workScore - a.workScore)
  .map((p, i) => ({ ...p, rank: i + 1 }));

export function getProject(slug: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.slug === slug);
}

export const LEADERBOARD = MOCK_PROJECTS;

export const UPCOMING_LAUNCHES = MOCK_PROJECTS.filter(
  (p) => p.stage === "ELIGIBLE" || p.stage === "LAUNCHING"
).sort((a, b) => (a.launchAt ?? "z").localeCompare(b.launchAt ?? "z"));

// ----- Live milestone / activity feed -----
const FEED_TEMPLATES: { kind: ActivityEvent["kind"]; msg: (n: string) => string }[] = [
  { kind: "MILESTONE_VERIFIED", msg: (n) => `${n} — Website completed` },
  { kind: "MILESTONE_VERIFIED", msg: (n) => `${n} — Whitepaper uploaded` },
  { kind: "MILESTONE_VERIFIED", msg: (n) => `${n} — Demo shipped` },
  { kind: "MILESTONE_VERIFIED", msg: (n) => `${n} — Audit passed` },
  { kind: "SUBMITTED", msg: (n) => `${n} — GitHub repo submitted for review` },
  { kind: "VOTE", msg: (n) => `${n} crossed a new community vote milestone` },
  { kind: "LAUNCH", msg: (n) => `${n} reached launch eligibility` },
];

export const ACTIVITY_FEED: ActivityEvent[] = Array.from({ length: 14 }).map((_, i) => {
  const project = MOCK_PROJECTS[i % MOCK_PROJECTS.length];
  const tpl = FEED_TEMPLATES[i % FEED_TEMPLATES.length];
  return {
    id: `evt-${i}`,
    projectSlug: project.slug,
    projectName: project.name,
    logoUrl: project.logoUrl,
    kind: tpl.kind,
    message: tpl.msg(project.name),
    createdAt: new Date(Date.now() - i * 1000 * 60 * (7 + i)).toISOString(),
  };
});

// ----- Recently launched tokens ("movers", pump.fun style) -----
function randMint() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const MOVER_SEEDS: { slug: string; name: string; symbol: string; logo: string; change: number; mcap: number; mins: number }[] = [
  { slug: "solforge", name: "SolForge", symbol: "FORGE", logo: "🛠️", change: 142.6, mcap: 2_400_000, mins: 3 },
  { slug: "lumen-pay", name: "Lumen Pay", symbol: "LUMEN", logo: "💸", change: 88.2, mcap: 1_650_000, mins: 11 },
  { slug: "questline", name: "Questline", symbol: "QUEST", logo: "🎮", change: -12.4, mcap: 940_000, mins: 24 },
  { slug: "depinhub", name: "DePIN Hub", symbol: "DEPIN", logo: "📡", change: 56.9, mcap: 720_000, mins: 38 },
  { slug: "novanft", name: "Nova NFT", symbol: "NOVA", logo: "🎨", change: 23.1, mcap: 510_000, mins: 52 },
  { slug: "yieldnest", name: "YieldNest", symbol: "NEST", logo: "🪺", change: -6.7, mcap: 480_000, mins: 67 },
  { slug: "echofeed", name: "EchoFeed", symbol: "ECHO", logo: "📈", change: 311.5, mcap: 3_100_000, mins: 1 },
  { slug: "gridmind", name: "GridMind", symbol: "GRID", logo: "🧠", change: 74.3, mcap: 860_000, mins: 19 },
];

export const MOVERS: LaunchMover[] = MOVER_SEEDS.map((m) => ({
  slug: m.slug,
  name: m.name,
  symbol: m.symbol,
  logoUrl: m.logo,
  mint: randMint(),
  priceChange: m.change,
  marketCap: m.mcap,
  launchedAt: new Date(Date.now() - m.mins * 60_000).toISOString(),
}))
  .sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());

export const PLATFORM_STATS = {
  projects: 1284,
  milestonesVerified: 7392,
  capitalRaised: 18400, // SOL
  buildersOnboarded: 4910,
};
