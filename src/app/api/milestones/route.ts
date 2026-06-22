import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/lib/mock-data";

/** GET /api/milestones?slug=x -> a project's milestones */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const project = MOCK_PROJECTS.find((p) => p.slug === slug);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project.milestones);
}

/**
 * POST /api/milestones -> submit proof for a milestone.
 * Body: { slug, type, proofUrl }
 * In mock mode this just echoes a SUBMITTED milestone; in production it would
 * persist via Prisma and queue verification.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.type || !body?.proofUrl) {
    return NextResponse.json({ error: "slug, type and proofUrl required" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    milestone: {
      type: body.type,
      status: "SUBMITTED",
      proofUrl: body.proofUrl,
      submittedAt: new Date().toISOString(),
    },
  });
}
