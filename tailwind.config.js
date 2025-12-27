/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Trust/Stability
        primary: {
          DEFAULT: "#2563eb",
          hover: "#3b82f6",
          600: "#2563eb",
          500: "#3b82f6",
        },
        // Status Colors - Must be obvious
        success: {
          DEFAULT: "#22c55e",
          500: "#22c55e",
        },
        warning: {
          DEFAULT: "#eab308",
          500: "#eab308",
        },
        danger: {
          DEFAULT: "#ef4444",
          500: "#ef4444",
        },
        // Dark theme base (slate palette)
        background: {
          DEFAULT: "#0f172a",
          card: "#1e293b",
          border: "#334155",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        // Large results display
        result: ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "result-lg": ["2.5rem", { lineHeight: "3rem", fontWeight: "700" }],
      },
      spacing: {
        // Touch-friendly minimum heights
        touch: "48px",
      },
    },
  },
  plugins: [],
};
