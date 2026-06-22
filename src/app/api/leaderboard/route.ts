import { NextResponse } from "next/server";
import { LEADERBOARD } from "@/lib/mock-data";

/** GET /api/leaderboard?sort=workScore|credibility|progress&limit=N */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = (searchParams.get("sort") ?? "workScore") as
    | "workScore"
    | "credibility"
    | "progress";
  const limit = Number(searchParams.get("limit") ?? 0);

  const sorted = [...LEADERBOARD].sort((a, b) => b[sort] - a[sort]);
  const rows = (limit ? sorted.slice(0, limit) : sorted).map((p, i) => ({
    rank: i + 1,
    slug: p.slug,
    name: p.name,
    workScore: p.workScore,
    credibility: p.credibility,
    progress: p.progress,
    stage: p.stage,
  }));

  return NextResponse.json(rows);
}
