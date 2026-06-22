"use client";

import { motion } from "framer-motion";

/**
 * Animated futuristic skyline: glassy towers, glowing construction cranes,
 * and digital progress bars rising on the buildings. Pure SVG + Framer Motion.
 */
export function CityBackground() {
  const buildings = [
    { x: 40, w: 70, h: 180, p: 0.7 },
    { x: 130, w: 90, h: 260, p: 0.45 },
    { x: 240, w: 60, h: 150, p: 0.9 },
    { x: 320, w: 110, h: 320, p: 0.6 },
    { x: 450, w: 80, h: 210, p: 0.3 },
    { x: 555, w: 95, h: 285, p: 0.8 },
    { x: 675, w: 70, h: 170, p: 0.55 },
    { x: 765, w: 105, h: 300, p: 0.4 },
    { x: 895, w: 75, h: 200, p: 0.75 },
    { x: 990, w: 90, h: 250, p: 0.5 },
    { x: 1100, w: 80, h: 230, p: 0.65 },
  ];
  const BASE = 460;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1200 480"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9b8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7c47f5" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="prog" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#f5b800" />
            <stop offset="100%" stopColor="#ffdb45" />
          </linearGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {buildings.map((b, i) => {
          const top = BASE - b.h;
          return (
            <g key={i}>
              {/* tower */}
              <rect
                x={b.x}
                y={top}
                width={b.w}
                height={b.h}
                rx={6}
                fill="url(#tower)"
                stroke="rgba(124,71,245,0.25)"
              />
              {/* windows */}
              {Array.from({ length: Math.floor(b.h / 26) }).map((_, r) =>
                Array.from({ length: Math.max(1, Math.floor(b.w / 22)) }).map((_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={b.x + 8 + c * 22}
                    y={top + 12 + r * 26}
                    width={10}
                    height={12}
                    rx={2}
                    fill={Math.random() > 0.55 ? "#ffe985" : "#ede7ff"}
                    opacity={Math.random() > 0.5 ? 0.9 : 0.4}
                  />
                ))
              )}
              {/* digital progress bar climbing the facade */}
              <rect
                x={b.x + 6}
                y={top + 6}
                width={6}
                height={b.h - 12}
                rx={3}
                fill="rgba(124,71,245,0.15)"
              />
              <motion.rect
                x={b.x + 6}
                width={6}
                rx={3}
                fill="url(#prog)"
                initial={{ height: 0, y: BASE - 6 }}
                animate={{ height: (b.h - 12) * b.p, y: BASE - 6 - (b.h - 12) * b.p }}
                transition={{ duration: 2.2, delay: i * 0.15, ease: "easeOut" }}
              />
            </g>
          );
        })}

        {/* Construction cranes */}
        {[
          { x: 200, y: 120, s: 1 },
          { x: 620, y: 90, s: 1.2 },
          { x: 960, y: 140, s: 0.9 },
        ].map((c, i) => (
          <motion.g
            key={i}
            style={{ originX: `${c.x}px`, originY: `${c.y + 140}px` }}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1={c.x} y1={c.y} x2={c.x} y2={c.y + 160} stroke="#f5b800" strokeWidth={4} />
            <line
              x1={c.x - 60 * c.s}
              y1={c.y}
              x2={c.x + 110 * c.s}
              y2={c.y}
              stroke="#f5b800"
              strokeWidth={4}
            />
            <line x1={c.x} y1={c.y} x2={c.x - 40 * c.s} y2={c.y + 24} stroke="#f5b800" strokeWidth={2.5} />
            <line x1={c.x} y1={c.y} x2={c.x + 70 * c.s} y2={c.y + 24} stroke="#f5b800" strokeWidth={2.5} />
            <circle cx={c.x + 90 * c.s} cy={c.y} r={6} fill="#ffdb45" filter="url(#soft)" />
            <line x1={c.x + 90 * c.s} y1={c.y} x2={c.x + 90 * c.s} y2={c.y + 40} stroke="#d49500" strokeWidth={1.5} />
            <rect x={c.x + 84 * c.s} y={c.y + 40} width={12} height={10} rx={2} fill="#7c47f5" />
          </motion.g>
        ))}
      </svg>

      {/* fade to canvas at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
