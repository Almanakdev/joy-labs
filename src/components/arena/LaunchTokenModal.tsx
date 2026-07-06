"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Rocket, Loader2, CheckCircle2, FlaskConical } from "lucide-react";
import type { Project } from "@/types";
import { MIN_LAUNCH_SCORE } from "@/types";
import { deployToken } from "@/lib/solana";
import { playLaunch } from "@/lib/sound";
import { shortAddress } from "@/lib/utils";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { WalletButton } from "@/components/wallet/WalletButton";

function defaultSymbol(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase();
}

export function LaunchTokenModal({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [name, setName] = useState(project.name);
  const [symbol, setSymbol] = useState(defaultSymbol(project.name));
  const [description, setDescription] = useState(project.description ?? "");
  const [imageUrl, setImageUrl] = useState("");
  const [website, setWebsite] = useState(project.website ?? "");
  const [twitter, setTwitter] = useState(project.twitter ?? "");
  const [telegram, setTelegram] = useState("");
  const [devBuy, setDevBuy] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "deploying" | "done">("form");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape-to-close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && phase === "form") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, phase, onClose]);

  const eligible = project.workScore >= MIN_LAUNCH_SCORE;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Token name is required.";
    if (!/^[A-Z0-9]{2,10}$/.test(symbol)) e.symbol = "2–10 letters/numbers, uppercase.";
    if (!description.trim()) e.description = "Add a short description.";
    if (devBuy && (isNaN(Number(devBuy)) || Number(devBuy) < 0))
      e.devBuy = "Enter a valid SOL amount.";
    if (!agreed) e.agreed = "Please confirm to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleDeploy() {
    if (!validate()) return;
    setPhase("deploying");
    try {
      await deployToken({
        projectSlug: project.slug,
        name,
        symbol,
        ownerWallet: publicKey?.toBase58() ?? "SIMULATED",
        workScore: project.workScore,
      });
      setPhase("done");
      playLaunch();
      // brief success beat, then move to the token page
      setTimeout(() => router.push(`/token/${project.slug}`), 900);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Deployment failed." });
      setPhase("form");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="launch-modal"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={phase === "form" ? onClose : undefined}
          />

          <motion.div
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl glass-strong p-6 no-scrollbar"
          >
            {phase === "done" ? (
              <div className="flex flex-col items-center py-10 text-center">
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.div>
                <h3 className="mt-4 font-display text-xl font-bold">Token deployed!</h3>
                <p className="mt-1 text-sm text-muted">
                  Taking you to the ${symbol} trading page…
                </p>
                <Loader2 className="mt-4 h-5 w-5 animate-spin text-purple-600" />
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <ProjectLogo name={name || project.name} seed={project.slug} size={44} />
                    <div>
                      <h3 className="font-display text-lg font-bold">Launch your token</h3>
                      <p className="text-xs text-muted">
                        Work Score {project.workScore} · eligible
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-purple-50 hover:text-purple-700"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Token name" error={errors.name}>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        placeholder="My Token"
                      />
                    </Field>
                    <Field label="Symbol" error={errors.symbol}>
                      <input
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="input font-mono"
                        placeholder="TICKER"
                      />
                    </Field>
                  </div>

                  <Field label="Description" error={errors.description}>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="input resize-none"
                      placeholder="What is this token about?"
                    />
                  </Field>

                  <Field label="Logo image URL (optional)">
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="input"
                      placeholder="https://… (falls back to generated mark)"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Website">
                      <input value={website} onChange={(e) => setWebsite(e.target.value)} className="input" placeholder="https://" />
                    </Field>
                    <Field label="Twitter / X">
                      <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="input" placeholder="https://" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Telegram">
                      <input value={telegram} onChange={(e) => setTelegram(e.target.value)} className="input" placeholder="https://" />
                    </Field>
                    <Field label="Dev buy (SOL, optional)" error={errors.devBuy}>
                      <input
                        value={devBuy}
                        onChange={(e) => setDevBuy(e.target.value)}
                        inputMode="decimal"
                        className="input"
                        placeholder="0.0"
                      />
                    </Field>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-purple-200 text-purple-600"
                    />
                    <span>
                      I confirm my milestones and proofs are accurate, and I understand the
                      token deploys on a pump.fun-style bonding curve.
                    </span>
                  </label>
                  {errors.agreed && <p className="-mt-2 text-xs text-rose-600">{errors.agreed}</p>}
                  {errors.form && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{errors.form}</p>
                  )}
                </div>

                <div className="mt-5">
                  <button
                    onClick={handleDeploy}
                    disabled={!eligible || phase === "deploying"}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {phase === "deploying" ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Deploying token…</>
                    ) : (
                      <><Rocket className="h-4 w-4" /> Deploy &amp; launch ${symbol || "TOKEN"}</>
                    )}
                  </button>

                  {publicKey ? (
                    <p className="mt-2 text-center text-xs text-muted">
                      Wallet connected · {shortAddress(publicKey.toBase58())}
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-col items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-joy-100 px-2.5 py-1 text-xs font-semibold text-joy-800">
                        <FlaskConical className="h-3.5 w-3.5" /> Demo mode — no wallet needed
                      </span>
                      <div className="scale-90 [&_.wallet-adapter-button]:!py-2">
                        <WalletButton />
                      </div>
                      <span className="text-[11px] text-muted">
                        Connect a wallet to deploy for real (optional).
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}
