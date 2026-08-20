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
        'fjpp-blue-50': '#E6F0F9',
        'fjpp-blue-100': '#CCE0F3',
        'fjpp-blue-200': '#99C2E7',
        'fjpp-blue-300': '#66A3DB',
        'fjpp-blue-400': '#3385CF',
        'fjpp-blue-500': '#0066C3',
        'fjpp-blue-600': '#00519C',
        'fjpp-blue-700': '#003D75',
        'fjpp-blue-800': '#00284E',
        'fjpp-blue-900': '#001427',
        'fjpp-blue-DEFAULT': '#013395', // Para site público
        
        // Verdes (variantes)
        'fjpp-green-50': '#E8F8F0',
        'fjpp-green-100': '#D1F1E1',
        'fjpp-green-200': '#A3E3C3',
        'fjpp-green-300': '#75D5A5',
        'fjpp-green-400': '#47C787',
        'fjpp-green-500': '#00a859',
        'fjpp-green-600': '#008647',
        'fjpp-green-700': '#006535',
        'fjpp-green-800': '#004323',
        'fjpp-green-900': '#002212',
        'fjpp-green-DEFAULT': '#34BE51', // Para site público
        
        // Vermelhos (variantes)
        'fjpp-red-50': '#FDECEA',
        'fjpp-red-100': '#FBD9D5',
        'fjpp-red-200': '#F7B3AB',
        'fjpp-red-300': '#F38D81',
        'fjpp-red-400': '#EF6757',
        'fjpp-red-500': '#e53935',
        'fjpp-red-600': '#B72E2A',
        'fjpp-red-700': '#892220',
        'fjpp-red-800': '#5C1715',
        'fjpp-red-900': '#2E0B0B',
        
        // Neutras
        'fjpp-white': '#FFFFFF',
        'fjpp-light': '#FAFBFD',
        'fjpp-gray': '#F2F2F2',
        'fjpp-gray-50': '#F9FAFB',
        'fjpp-gray-100': '#F3F4F6',
        'fjpp-gray-200': '#E5E7EB',
        'fjpp-gray-300': '#D1D5DB',
        'fjpp-gray-400': '#9CA3AF',
        'fjpp-gray-500': '#6B7280',
        'fjpp-gray-600': '#4B5563',
        'fjpp-gray-700': '#374151',
        'fjpp-gray-800': '#1F2937',
        'fjpp-gray-900': '#111827',
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

