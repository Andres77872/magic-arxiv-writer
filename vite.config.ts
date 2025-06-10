import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/arxiv': {
        target: 'http://export.arxiv.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/arxiv/, '/api/query'),
      },
    },
  },
})
