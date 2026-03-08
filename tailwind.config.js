/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        obsidian: {
          50:  "#f4f3f7",
          100: "#e9e8ef",
          200: "#d3d1df",
          300: "#b0acc6",
          400: "#8880a8",
          500: "#6b6490",
          600: "#564f78",
          700: "#463f62",
          800: "#3b3453",
          900: "#342e4a",
          950: "#0e0c18",
        },
        ember: {
          300: "#fcd29a",
          400: "#f9b85a",
          500: "#f59e28",
          600: "#e07d10",
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.5s ease forwards",
        "fade-in":  "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: "translateX(-16px)" }, to: { opacity: 1, transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};