/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '320px',     // Extra small devices
      'sm': '640px',     // Small tablets and large phones
      'md': '768px',     // Tablets
      'lg': '1024px',    // Laptops/Desktops
      'xl': '1280px',    // Large laptops and desktops
      '2xl': '1536px',   // Extra large screens
      '3xl': '1920px',   // 4K and ultra-wide screens
    },
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        'primary-light': '#60a5fa',
        secondary: '#10b981',
        'secondary-dark': '#059669',
        'secondary-light': '#34d399',
        background: '#f3f4f6',
        'background-dark': '#1f2937',
        'background-light': '#ffffff',
      },
    },
  },
  plugins: [],
}