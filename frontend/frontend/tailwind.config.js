// tailwind.config.js
module.exports = {
  darkMode: 'class', //  Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdfaf5',
          100: '#f9f3eb',
        },
        brown: {
          50: '#fefaf6',
          100: '#f5eee7',
          200: '#e4d7c7',
          500: '#aa8454',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
