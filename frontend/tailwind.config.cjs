/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { gold: '#D4AF37', green: '#0f5132' }
      },
      backgroundImage: { 'hero-blur': "url('/assets/hero-blur.jpg')" }
    }
  },
  plugins: [],
}