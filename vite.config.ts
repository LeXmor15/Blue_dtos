import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  assetsInclude: ['**/*.json'],
  json: {
    stringify: true, // Esto permite importar JSON como módulos
  },
})