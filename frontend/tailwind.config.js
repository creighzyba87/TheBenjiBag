
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f9ff',
          100: '#e8f2ff',
          200: '#cfe5ff',
          300: '#a6d0ff',
          400: '#6eb3ff',
          500: '#3a97ff',
          600: '#1e79e6',
          700: '#185fba',
          800: '#144e97',
          900: '#113f79'
        }
      }
    },
  },
  plugins: [],
}
