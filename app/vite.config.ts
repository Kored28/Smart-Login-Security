import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist',
    cssCodeSplit: false,  
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'bundle.js',
        chunkFileNames: 'bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'bundle.css'
          return '[name][extname]'
        },
      }
    }
  }
})
