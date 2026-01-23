import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import prerender from '@prerenderer/rollup-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// All routes to prerender
const routes = [
  '/',
  '/docs/getting-started',
  '/validators/lifecycle',
  '/validators/triggers',
  '/validators/severity',
  '/reference/schema',
  '/reference/response-format',
  '/validators/overview',
  '/validators/security/no-secrets',
  '/validators/security/no-eval',
  '/validators/security/sql-injection',
  '/validators/quality/no-console',
  '/validators/quality/function-length',
  '/validators/quality/complexity',
  '/validators/docs/jsdoc-required',
  '/validators/docs/readme-updated',
]

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'prerender-ready',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
