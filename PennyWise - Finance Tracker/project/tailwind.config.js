/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd5ff',
          300: '#8eb8ff',
          400: '#5891ff',
          500: '#4285F4',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'blue-sm': '0 2px 4px rgba(66, 133, 244, 0.1)',
        'blue': '0 4px 6px rgba(66, 133, 244, 0.15)',
        'blue-md': '0 6px 8px rgba(66, 133, 244, 0.2)',
        'blue-lg': '0 8px 16px rgba(66, 133, 244, 0.25)',
        'blue-xl': '0 12px 24px rgba(66, 133, 244, 0.3)',
      },
    },
  },
  plugins: [],
};