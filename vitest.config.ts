import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
