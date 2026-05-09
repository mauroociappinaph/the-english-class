/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cefr: {
          a1: "#22c55e",
          a2: "#84cc16",
          b1: "#3b82f6",
          b2: "#6366f1",
          c1: "#a855f7",
          c2: "#ec4899",
        },
      },
    },
  },
  plugins: [],
};
