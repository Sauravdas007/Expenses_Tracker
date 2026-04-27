import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // charcoal / ember palette — warm dark, not generic purple
        ink: {
          950: "#0a0a0b",
          900: "#111114",
          800: "#17171c",
          700: "#1f1f25",
          600: "#2a2a32",
          500: "#3a3a44",
          400: "#6b6b78",
          300: "#9a9aa6",
          200: "#c8c8d0",
          100: "#e7e7ec",
        },
        ember: {
          500: "#ff6b3d",
          400: "#ff8a5f",
          300: "#ffb18a",
        },
        moss: {
          500: "#8ab573",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,107,61,0.25), 0 8px 30px -8px rgba(255,107,61,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
