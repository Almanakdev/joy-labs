import { NextResponse } from "next/server";
import { getProject } from "@/lib/mock-data";
import { generateReview } from "@/lib/ai-review";

/** GET /api/review?slug=x -> AI-generated project review */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const project = getProject(slug);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const review = await generateReview(project);
  return NextResponse.json(review);
}
