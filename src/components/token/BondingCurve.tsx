"use client";

import { Rocket } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

/**
 * Pump.fun-style bonding-curve progress: when it fills, the token "graduates"
 * to a full DEX pool (e.g. Raydium) with locked liquidity.
 */
export function BondingCurve({ progress }: { progress: number }) {
  return (
    <div className="rounded-2xl glass-strong p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-semibold">
          <Rocket className="h-4 w-4 text-purple-600" /> Bonding curve
        </h3>
        <span className="text-sm font-bold text-purple-700">{progress}%</span>
      </div>
      <ProgressBar value={progress} tone="joy" />
      <p className="mt-2 text-xs text-muted">
        {progress >= 100
          ? "Graduated — liquidity migrated to the DEX and locked."
          : `When the curve fills, ${100 - progress}% to go, liquidity migrates to a DEX pool and locks automatically.`}
      </p>
    </div>
  );
}
