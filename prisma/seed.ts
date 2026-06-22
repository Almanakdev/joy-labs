/**
 * Prisma seed — mirrors the bundled mock data into a real database.
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { MOCK_PROJECTS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { walletAddress: "JoyLabsGenesisWa11et1111111111111111111111" },
    update: {},
    create: {
      walletAddress: "JoyLabsGenesisWa11et1111111111111111111111",
      handle: "joylabs",
      reputation: 1000,
    },
  });

  for (const p of MOCK_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        logoUrl: p.logoUrl,
        website: p.website,
        twitter: p.twitter,
        github: p.github,
        stage: p.stage,
        workScore: p.workScore,
        credibility: p.credibility,
        progress: p.progress,
        launchAt: p.launchAt ? new Date(p.launchAt) : null,
        votesUp: p.votesUp,
        votesDown: p.votesDown,
        capitalRaised: BigInt(Math.round(p.capitalRaised * 1_000_000_000)),
        tokenMint: p.tokenMint,
        ownerId: owner.id,
        milestones: {
          create: p.milestones.map((m) => ({
            type: m.type,
            title: m.title,
            description: m.description,
            status: m.status,
            points: m.points,
            proofUrl: m.proofUrl,
            verifiedBy: m.verifiedBy,
            completedAt: m.completedAt ? new Date(m.completedAt) : null,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${MOCK_PROJECTS.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
