import { Hero } from "@/components/landing/Hero";
import { MoversTicker } from "@/components/landing/MoversTicker";
import { LaunchToast } from "@/components/landing/LaunchToast";
import { TopBuilders } from "@/components/landing/TopBuilders";
import { MilestonesFeed } from "@/components/landing/MilestonesFeed";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UpcomingLaunches } from "@/components/landing/UpcomingLaunches";
import { Features } from "@/components/landing/Features";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <MoversTicker />
      <LaunchToast />
      <Hero />
      <TopBuilders />
      <MilestonesFeed />
      <HowItWorks />
      <UpcomingLaunches />
      <Features />

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 px-8 py-14 text-center text-white shadow-glow">
          <div className="absolute inset-0 bg-grid-purple opacity-20 [background-size:32px_32px]" />
          <h2 className="relative font-display text-3xl font-bold sm:text-4xl">
            Ready to earn your launch?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-purple-100">
            Stop paying to deploy. Start proving your work. Build your Work Score and
            unlock the Launch Arena.
          </p>
          <div className="relative mt-7 flex justify-center gap-3">
            <Link href="/dashboard" className="btn-secondary">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/arena" className="btn-ghost !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
              Enter Launch Arena
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
