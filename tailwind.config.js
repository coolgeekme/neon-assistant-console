/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#22d3ee",
          purple: "#a855f7",
          green: "#34d399",
          blue: "#38bdf8",
        },
        panel: "#0c0f14",
        panel2: "#11161f",
        edge: "#1e2630",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(34,211,238,0.25), 0 0 24px rgba(34,211,238,0.12)",
        purple: "0 0 0 1px rgba(168,85,247,0.25), 0 0 24px rgba(168,85,247,0.12)",
      },
      keyframes: {
        pulse2: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        pulse2: "pulse2 1.6s ease-in-out infinite",
        scan: "scan 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
