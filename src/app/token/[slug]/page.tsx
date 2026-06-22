import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Twitter, Github } from "lucide-react";
import { getTokenMarket, TOKEN_SUPPLY } from "@/lib/market";
import { getProject } from "@/lib/mock-data";
import { formatCompact, formatUsdPrice } from "@/lib/utils";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { TokenChart } from "@/components/token/TokenChart";
import { TradePanel } from "@/components/token/TradePanel";
import { BondingCurve } from "@/components/token/BondingCurve";
import { TradesFeed } from "@/components/token/TradesFeed";
import { CopyMint } from "@/components/token/CopyMint";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const m = getTokenMarket(params.slug);
  return {
    title: m ? `${m.name} ($${m.symbol}) — Joy Labs` : "Token — Joy Labs",
    description: m ? `Trade $${m.symbol} on Joy Labs.` : undefined,
  };
}

export default function TokenPage({ params }: { params: { slug: string } }) {
  const market = getTokenMarket(params.slug);
  if (!market) notFound();

  const project = getProject(params.slug);
  const up = market.change24h >= 0;

  const stats = [
    { label: "Market cap", value: `$${formatCompact(market.marketCap)}` },
    { label: "24h volume", value: `$${formatCompact(market.volume24h)}` },
    { label: "Liquidity", value: `$${formatCompact(market.liquidity)}` },
    { label: "Holders", value: formatCompact(market.holders) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-purple-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <ProjectLogo name={market.name} seed={market.slug} size={56} rounded="rounded-2xl" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold">{market.name}</h1>
            <span className="text-muted">${market.symbol}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <CopyMint mint={market.mint} />
            {project?.tagline && (
              <span className="hidden text-xs text-muted sm:inline">· {project.tagline}</span>
            )}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display text-2xl font-bold">{formatUsdPrice(market.price)}</div>
          <div className={`text-sm font-semibold ${up ? "text-emerald-600" : "text-rose-500"}`}>
            {up ? "+" : ""}
            {market.change24h.toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl px-4 py-3">
            <div className="text-xs text-muted">{s.label}</div>
            <div className="mt-0.5 font-display text-lg font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TokenChart candles={market.candles} />
          <TradesFeed trades={market.trades} symbol={market.symbol} price={market.price} />
        </div>

        <div className="space-y-6">
          <TradePanel market={market} />
          <BondingCurve progress={market.bondingProgress} />

          {/* Token info */}
          <div className="rounded-2xl glass-strong p-5 text-sm">
            <h3 className="mb-3 font-semibold">Token info</h3>
            <dl className="space-y-2 text-muted">
              <div className="flex justify-between">
                <dt>Symbol</dt>
                <dd className="font-semibold text-ink">${market.symbol}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Supply</dt>
                <dd className="font-semibold text-ink">{formatCompact(TOKEN_SUPPLY)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Mint</dt>
                <dd><CopyMint mint={market.mint} /></dd>
              </div>
            </dl>

            {project && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-purple-50 pt-4">
                {project.website && (
                  <a href={project.website} className="btn-ghost !py-1.5 text-xs">
                    <Globe className="h-3.5 w-3.5" /> Site
                  </a>
                )}
                {project.twitter && (
                  <a href={project.twitter} className="btn-ghost !py-1.5 text-xs">
                    <Twitter className="h-3.5 w-3.5" /> Twitter
                  </a>
                )}
                {project.github && (
                  <a href={project.github} className="btn-ghost !py-1.5 text-xs">
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
                <Link href={`/dashboard?p=${market.slug}`} className="btn-ghost !py-1.5 text-xs">
                  View work profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
