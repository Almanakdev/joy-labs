import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/lib/mock-data";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

/**
 * GET /api/projects        -> all projects
 * GET /api/projects?slug=x  -> single project
 *
 * When NEXT_PUBLIC_USE_MOCKS is not "false" this serves bundled mock data.
 * Otherwise wire up Prisma (see commented block) once a database is connected.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (USE_MOCKS) {
    if (slug) {
      const p = MOCK_PROJECTS.find((x) => x.slug === slug);
      return p
        ? NextResponse.json(p)
        : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(MOCK_PROJECTS);
  }

  // --- Live data path (requires DATABASE_URL) ---
  // import { prisma } from "@/lib/prisma";
  // const data = slug
  //   ? await prisma.project.findUnique({ where: { slug }, include: { milestones: true } })
  //   : await prisma.project.findMany({ include: { milestones: true }, orderBy: { workScore: "desc" } });
  // return NextResponse.json(data);

  return NextResponse.json(MOCK_PROJECTS);
}
