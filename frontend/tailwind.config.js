/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fjpp-blue': '#003366',
        'fjpp-green': '#00a859',
        'fjpp-red': '#e53935',
        'fjpp-white': '#ffffff',
        'fjpp-light': '#f4f6f7',
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

