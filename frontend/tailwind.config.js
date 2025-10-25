/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-gold":"#E6C14F",
        "brand-ink":"#0B0F14",
        "brand-forest":"#0F2A1C"
      }
    }
  },
  plugins: []
};
