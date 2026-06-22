import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-purple-100 bg-white/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo size="md" />
          <p className="mt-3 max-w-sm text-sm text-muted">
            The proof-of-work launchpad. Builders earn launch rights through real
            execution — not deployment fees.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://twitter.com" className="btn-ghost !p-2" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://github.com" className="btn-ghost !p-2" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/#leaderboard" className="hover:text-purple-700">Leaderboard</Link></li>
            <li><Link href="/arena" className="hover:text-purple-700">Launch Arena</Link></li>
            <li><Link href="/dashboard" className="hover:text-purple-700">Dashboard</Link></li>
            <li><Link href="/#how" className="hover:text-purple-700">How it works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Resources</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><a href="#" className="hover:text-purple-700">Docs</a></li>
            <li><a href="#" className="hover:text-purple-700">Builder reputation</a></li>
            <li><a href="#" className="hover:text-purple-700">Anti-rug score</a></li>
            <li><a href="#" className="hover:text-purple-700">Smart contract scanner</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-100 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Joy Labs. Built on Solana. Don&apos;t buy the hype — buy the work.
      </div>
    </footer>
  );
}
