import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:3050', changeOrigin: true },
      '/auth': {
        target: 'http://localhost:3050',
        changeOrigin: true,
        rewrite: (p) => `/api/auth${p}`,
      },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
