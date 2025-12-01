/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais do sistema interno (mantém compatibilidade)
        'fjpp-blue': '#003366',
        'fjpp-green': '#00a859',
        'fjpp-red': '#e53935',
        
        // Azuis oficiais (variantes para site público)
        'fjpp-blue-50': '#00256C',
        'fjpp-blue-100': '#00266D',
        'fjpp-blue-200': '#002773',
        'fjpp-blue-300': '#002978',
        'fjpp-blue-400': '#002B7F',
        'fjpp-blue-500': '#002D84',
        'fjpp-blue-600': '#002E88',
        'fjpp-blue-700': '#00308D',
        'fjpp-blue-800': '#003191',
        'fjpp-blue-900': '#00349A',
        'fjpp-blue-DEFAULT': '#013395', // Para site público
        
        // Verdes (variantes)
        'fjpp-green-100': '#3FC255',
        'fjpp-green-200': '#4CC95A',
        'fjpp-green-300': '#50C759',
        'fjpp-green-400': '#55CA5C',
        'fjpp-green-500': '#5DCD61',
        'fjpp-green-600': '#62D064',
        'fjpp-green-700': '#66D166',
        'fjpp-green-800': '#6CD46A',
        'fjpp-green-900': '#70D56D',
        'fjpp-green-DEFAULT': '#34BE51', // Para site público
        
        // Vermelhos (variantes)
        'fjpp-red-100': '#F32626',
        'fjpp-red-200': '#F61C1C',
        'fjpp-red-300': '#F91414',
        'fjpp-red-400': '#FB0C0C',
        'fjpp-red-500': '#FD0606',
        
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

