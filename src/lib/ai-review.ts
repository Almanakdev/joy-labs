import type { AiReview, Project } from "@/types";

/**
 * AI-generated project review (STUB).
 *
 * Production: send milestone proofs, repo activity and on-chain history
 * to an LLM and return a structured credibility assessment. Here we
 * derive a deterministic mock review from the project's own metrics so
 * the UI renders meaningfully.
 */
export async function generateReview(project: Project): Promise<AiReview> {
  const verified = project.milestones.filter((m) => m.status === "VERIFIED").length;
  const score = Math.min(
    99,
    Math.round(project.workScore / 12 + project.credibility / 4 + verified * 3)
  );

  const strengths: string[] = [];
  const risks: string[] = [];

  if (project.milestones.some((m) => m.type === "AUDIT" && m.status === "VERIFIED"))
    strengths.push("Independent security audit passed and verified on-chain.");
  if (project.openSource) strengths.push("Codebase is fully open source and reproducible.");
  if (project.credibility >= 80)
    strengths.push("High anti-rug credibility — authorities renounced.");
  if (verified >= 4) strengths.push("Consistent, verifiable execution across milestones.");

  if (project.milestones.some((m) => m.type === "AUDIT" && m.status !== "VERIFIED"))
    risks.push("Security audit not yet completed.");
  if (!project.openSource) risks.push("Repository is private — limited transparency.");
  if (project.votesDown > project.votesUp * 0.3)
    risks.push("Notable community skepticism in current voting.");
  if (strengths.length === 0) strengths.push("Early but steady milestone progress.");
  if (risks.length === 0) risks.push("Maintain cadence to reach launch eligibility.");

  return {
    score,
    summary:
      `${project.name} shows ${verified}/${project.milestones.length} verified milestones ` +
      `with a Work Score of ${project.workScore}. ` +
      (score >= 75
        ? "Execution signals are strong and consistent with a credible launch."
        : "Promising trajectory; a few more proofs would solidify launch readiness."),
    strengths,
    risks,
  };
}
