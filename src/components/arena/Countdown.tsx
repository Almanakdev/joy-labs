"use client";

import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/utils";

export function Countdown({ target }: { target: string }) {
  // Start null so server and client first render match; fill in after mount.
  const [parts, setParts] = useState<ReturnType<typeof countdownParts> | null>(null);

  useEffect(() => {
    setParts(countdownParts(target));
    const id = setInterval(() => setParts(countdownParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: parts?.days ?? 0 },
    { label: "Hrs", value: parts?.hours ?? 0 },
    { label: "Min", value: parts?.minutes ?? 0 },
    { label: "Sec", value: parts?.seconds ?? 0 },
  ];

  return (
    <div className="flex gap-2">
      {units.map((u) => (
        <div key={u.label} className="flex-1 rounded-xl bg-purple-600 px-2 py-2 text-center text-white">
          <div suppressHydrationWarning className="font-mono text-xl font-bold tabular-nums">
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-purple-200">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
