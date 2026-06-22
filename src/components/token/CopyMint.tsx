"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { shortAddress } from "@/lib/utils";

export function CopyMint({ mint }: { mint: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(mint).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-xs text-purple-700 transition hover:bg-purple-100"
      title={mint}
    >
      {shortAddress(mint, 5)}
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
