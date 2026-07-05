import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Set VITE_BACKEND_PORT in .env to match wherever the backend is actually
  // running — avoids having to hand-edit this file every time.
  const backendPort = env.VITE_BACKEND_PORT || '8000'
  const backendTarget = `http://localhost:${backendPort}`

  return {
    plugins: [
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': backendTarget,
        '/uploads': backendTarget,
      },
    },
  }
})
