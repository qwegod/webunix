/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'caret': 'caret 1s infinite'
      },
      keyframes: {
        caret: {
          '0%': { opacity: 1 },
          '50%': { opacity: .5 },
          '100%': { opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}