/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-outfit)", "Outfit", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "#000000",
          subtle: "#0a0a0a",
          elevated: "#111111",
        },
        cefr: {
          a1: "#22c55e",
          a2: "#84cc16",
          b1: "#3b82f6",
          b2: "#6366f1",
          c1: "#a855f7",
          c2: "#ec4899",
        },
      },
      boxShadow: {
        'solid': '0 0 0 1px rgba(255, 255, 255, 0.1)',
        'solid-lg': '0 0 0 2px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
};
