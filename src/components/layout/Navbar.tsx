"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { SoundToggle } from "@/components/ui/SoundToggle";

const BUY_COIN_URL = "https://pump.fun/coin/9jhPfS3v7AEJTDgcFYPvC3wf1yNPNTPUE1QrVS8dpump";

const LINKS = [
  { href: "/terminal", label: "Terminal" },
  { href: "/#leaderboard", label: "Leaderboard" },
  { href: "/arena", label: "Launch Arena" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between gap-4 rounded-2xl glass px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-purple-50 hover:text-purple-700",
                pathname === l.href && "text-purple-700"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SoundToggle className="btn-ghost !p-2" />
          <Link href="/dashboard" className="hidden btn-secondary !px-4 !py-2 text-sm sm:inline-flex">
            Start Building
          </Link>
          <a
            href={BUY_COIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-4 !py-2 text-sm"
          >
            <Coins className="h-4 w-4" /> Buy Coin
          </a>
        </div>
      </div>
    </motion.header>
  );
}
