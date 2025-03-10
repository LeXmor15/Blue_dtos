/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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