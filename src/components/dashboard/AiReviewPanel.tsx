"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, ThumbsUp, AlertTriangle } from "lucide-react";
import type { AiReview, Project } from "@/types";
import { generateReview } from "@/lib/ai-review";

export function AiReviewPanel({ project }: { project: Project }) {
  const [review, setReview] = useState<AiReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    generateReview(project).then((r) => {
      if (active) {
        setReview(r);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [project]);

  return (
    <div className="rounded-2xl glass-strong p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-purple-500 to-joy-500 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <h3 className="font-display text-lg font-bold">AI Project Review</h3>
        {review && (
          <span className="ml-auto chip bg-purple-100 text-purple-700">
            {review.score}/100
          </span>
        )}
      </div>

      {loading || !review ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Analyzing milestones &amp; on-chain history…
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted">{review.summary}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                <ThumbsUp className="h-4 w-4" /> Strengths
              </div>
              <ul className="mt-2 space-y-1.5">
                {review.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                <AlertTriangle className="h-4 w-4" /> Risks
              </div>
              <ul className="mt-2 space-y-1.5">
                {review.risks.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
