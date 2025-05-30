/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
        serif: ['Newsreader', "serif"],
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
