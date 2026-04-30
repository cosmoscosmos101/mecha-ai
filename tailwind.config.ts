import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Anthropic-inspired palette
        cream: {
          50: "#FBFAF7",
          100: "#F5F3EE",
          200: "#F0EEE6",
          300: "#E8E4D8",
          400: "#D9D3C2",
        },
        coral: {
          50: "#FBF0EA",
          100: "#F4D9CB",
          200: "#EBBBA2",
          300: "#E19D7A",
          400: "#D97757", // signature Anthropic coral
          500: "#C95F3D",
          600: "#A84C2E",
        },
        ink: {
          50: "#71706B",
          100: "#5A5953",
          200: "#3D3D38",
          300: "#262625", // body text
          400: "#1A1A18", // headings
          500: "#0F0F0E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(38 38 37 / 0.04), 0 1px 3px 0 rgb(38 38 37 / 0.06)",
        lift: "0 4px 12px -2px rgb(38 38 37 / 0.08), 0 8px 24px -4px rgb(38 38 37 / 0.06)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
