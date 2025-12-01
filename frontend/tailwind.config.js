/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azuis oficiais (primário) - compatível com sistema interno e site público
        'fjpp-blue': {
          50: '#00256C',
          100: '#00266D',
          200: '#002773',
          300: '#002978',
          400: '#002B7F',
          500: '#002D84',
          600: '#002E88',
          700: '#00308D',
          800: '#003191',
          900: '#00349A',
          DEFAULT: '#003366', // Mantém compatibilidade com sistema interno
        },
        // Verdes (secundário) - compatível com sistema interno e site público
        'fjpp-green': {
          DEFAULT: '#00a859', // Mantém compatibilidade com sistema interno
          100: '#3FC255',
          200: '#4CC95A',
          300: '#50C759',
          400: '#55CA5C',
          500: '#5DCD61',
          600: '#62D064',
          700: '#66D166',
          800: '#6CD46A',
          900: '#70D56D',
          'light': '#7BDB74',
          'lighter': '#8AE27D',
          'new': '#34BE51', // Nova cor verde oficial para site público
        },
        // Vermelhos (alerta/destaque) - compatível com sistema interno e site público
        'fjpp-red': {
          DEFAULT: '#e53935', // Mantém compatibilidade com sistema interno
          100: '#F32626',
          200: '#F61C1C',
          300: '#F91414',
          400: '#FB0C0C',
          500: '#FD0606',
          'new': '#F12D2C', // Nova cor vermelha oficial para site público
        },
        // Neutras
        'fjpp-white': '#FFFFFF',
        'fjpp-light': '#FAFBFD',
        'fjpp-gray': '#F2F2F2',
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

