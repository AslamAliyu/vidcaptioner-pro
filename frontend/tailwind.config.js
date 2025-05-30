/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Newsreader", "serif"],
        sans: ["Noto Sans", "sans-serif"],
      },
      colors: {
        beige: {
          50: "#fcfaf8",
          100: "#f3ede7",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/forms")],
};
