/**
 * Joy Labs tile pattern as a site-wide background with an animated
 * waving-flag distortion (feTurbulence -> feDisplacementMap).
 *
 * Rendered faint and behind all content so it reads as texture, never noise.
 * The displacement animation pauses automatically under prefers-reduced-motion
 * (the .animate-flag sway is disabled in globals.css).
 */

const P = "#7c47f5"; // purple
const Y = "#f5b800"; // yellow
const S = "#3b1a7a"; // sparkle (deep purple)

// 4-point sparkle path centered at origin (R = 12).
const SPARKLE =
  "M0,-12 Q2.2,-2.2 12,0 Q2.2,2.2 0,12 Q-2.2,2.2 -12,0 Q-2.2,-2.2 0,-12 Z";

// One rounded tile in a quadrant centre.
function Tile({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return <rect x={cx - 23} y={cy - 23} width={46} height={46} rx={13} fill={fill} />;
}

export function PatternBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="h-full w-full animate-flag" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="joytile" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* checkerboard of rounded squares */}
            <Tile cx={30} cy={30} fill={P} />
            <Tile cx={90} cy={30} fill={Y} />
            <Tile cx={30} cy={90} fill={Y} />
            <Tile cx={90} cy={90} fill={P} />
            {/* sparkles at the centre + corners (corners stitch across tiles) */}
            <path d={SPARKLE} fill={S} transform="translate(60 60)" />
            <path d={SPARKLE} fill={S} transform="translate(0 0)" />
            <path d={SPARKLE} fill={S} transform="translate(120 0)" />
            <path d={SPARKLE} fill={S} transform="translate(0 120)" />
            <path d={SPARKLE} fill={S} transform="translate(120 120)" />
          </pattern>

          <filter id="flagWave" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.014"
              numOctaves={2}
              seed={7}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="20s"
                values="0.009 0.014;0.014 0.010;0.009 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={20}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* oversized so the skew/scale sway never reveals empty edges */}
        <rect
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          fill="url(#joytile)"
          filter="url(#flagWave)"
          opacity={0.13}
        />
      </svg>

      {/* soften toward the centre so foreground content stays crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(247,245,255,0.78)_0%,rgba(247,245,255,0.35)_55%,transparent_100%)]" />
    </div>
  );
}
