import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme base
        canvas: "#f7f5ff",
        surface: "#ffffff",
        ink: "#1a1430",
        muted: "#6b6486",
        // Purple accents
        purple: {
          50: "#f4f1ff",
          100: "#e9e3ff",
          200: "#d4c6ff",
          300: "#b69dff",
          400: "#9a73ff",
          500: "#7c47f5",
          600: "#6a2fe0",
          700: "#5821bd",
          800: "#481c99",
          900: "#3b1a7a",
        },
        // Yellow accents
        joy: {
          50: "#fffbe6",
          100: "#fff4bf",
          200: "#ffe985",
          300: "#ffdb45",
          400: "#ffcc14",
          500: "#f5b800",
          600: "#d49500",
          700: "#a86f02",
          800: "#8a570a",
          900: "#74480f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-purple":
          "linear-gradient(to right, rgba(124,71,245,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,71,245,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(124, 71, 245, 0.12)",
        glow: "0 0 24px rgba(124, 71, 245, 0.35)",
        "glow-joy": "0 0 24px rgba(255, 204, 20, 0.45)",
        card: "0 10px 40px -12px rgba(59, 26, 122, 0.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        crane: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        crane: "crane 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
