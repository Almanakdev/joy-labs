# Joy Labs 🛠️

**Don't Buy The Hype. Buy The Work.**

A proof-of-work Web3 launchpad where projects *cannot* launch tokens instantly.
Instead they complete verifiable milestones and accumulate a **Work Score** to
earn launch rights — no deployment fees, just execution.

Light UI · purple & yellow accents · glassmorphism · 3D tilt cards · particle
effects · inspired by startup accelerators, GitHub contribution graphs, and
gaming progression systems.

---

## ✨ Features

- **Landing page** — animated futuristic-city hero (glowing cranes + digital
  progress bars), Top Builders leaderboard, live milestone feed, How It Works
  (Build → Prove → Launch → Scale), upcoming launches, and a feature grid.
- **Dashboard** — project profile (logo, description, website, Twitter, GitHub),
  Work Score panel (total, rank, milestones, progress), milestone system
  (Website, Whitepaper, Demo, GitHub, Audit, Community — each with status, proof
  URL, completion date, verification badge), and an AI project review.
- **Launch Arena** — eligible projects with launch countdown, community votes,
  capital raised, reputation score, and a Pump.fun-style one-click deploy.
- **Leaderboard** — global ranking with search and sort.
- **Trust toolkit** — wallet connection, Solana integration, community voting,
  builder reputation, anti-rug credibility score, open-source verification,
  smart-contract scanner, AI-generated reviews.

## 🧱 Tech stack

| Layer       | Tech                                                   |
| ----------- | ------------------------------------------------------ |
| Framework   | Next.js 14 (App Router) + TypeScript                   |
| Styling     | TailwindCSS                                            |
| Animation   | Framer Motion                                          |
| Wallet      | Solana Wallet Adapter (Phantom, Solflare)              |
| Chain       | @solana/web3.js · Helius RPC + enhanced APIs           |
| Data        | Supabase (Postgres) + Prisma ORM                       |

## 🚀 Getting started

```bash
npm install
cp .env.example .env        # fill in keys (optional — mocks work out of the box)
npm run dev                 # http://localhost:3000
```

The app ships with **bundled mock data** and runs with **no backend** by default
(`NEXT_PUBLIC_USE_MOCKS=true`). Wallet connect works against Solana devnet.

### Connecting a real database (optional)

```bash
# 1. Set DATABASE_URL / DIRECT_URL (Supabase) in .env
npm run db:generate
npm run db:push
npm run db:seed             # loads the mock projects into Postgres
# 2. Set NEXT_PUBLIC_USE_MOCKS=false to read from the DB via API routes
```

## 🗂️ Project structure

```
joy-labs/
├── prisma/
│   ├── schema.prisma        # User, Project, Milestone, Vote, AiReview, ActivityEvent
│   └── seed.ts
└── src/
    ├── app/
    │   ├── page.tsx          # landing
    │   ├── dashboard/        # project profile + milestones + AI review
    │   ├── arena/            # launch arena
    │   ├── leaderboard/      # global ranking
    │   └── api/              # projects, leaderboard, milestones, review
    ├── components/
    │   ├── landing/  dashboard/  arena/  leaderboard/
    │   ├── ui/       (TiltCard, ProgressBar, Badge, ProjectCard, Section)
    │   ├── effects/  (Particles, CityBackground)
    │   ├── wallet/   (WalletProvider, WalletButton)
    │   └── layout/   (Navbar, Footer)
    ├── lib/          (prisma, supabase, solana, helius, ai-review, mock-data, utils)
    └── types/
```

## 🔐 Scoring model

Work Score = sum of points from **verified** milestones:

| Milestone   | Points |
| ----------- | ------ |
| Website     | 100    |
| Whitepaper  | 150    |
| Demo        | 200    |
| GitHub      | 150    |
| Audit       | 250    |
| Community   | 150    |

A project unlocks the Launch Arena at **`NEXT_PUBLIC_MIN_LAUNCH_SCORE`** (default
750).

## 🧩 Where to plug in production logic

The stubs are clearly marked and isolated:

- `src/lib/solana.ts` — `deployToken()` (bonding-curve mint) & `scanContract()`
- `src/lib/helius.ts` — wallet history & token metadata for reputation
- `src/lib/ai-review.ts` — swap the deterministic mock for a real LLM call
- `src/app/api/*` — flip `NEXT_PUBLIC_USE_MOCKS=false` and uncomment the Prisma paths

## 📝 Notes

This is a production-ready **architecture + UI**. Blockchain deployment, audits,
and persistence are scaffolded with mock data so the full UX runs locally without
live keys. Don't ship token-deployment or anti-rug logic to mainnet without a
real audit.
