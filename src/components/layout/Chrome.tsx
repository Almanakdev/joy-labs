"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { PatternBackground } from "@/components/effects/PatternBackground";

/**
 * Site chrome (nav, footer, background effects). Hidden on the Terminal,
 * which is a full-screen, distraction-free trading view.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/terminal");

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <PatternBackground />
      <CursorGlow />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
