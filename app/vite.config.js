import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ai-resume-70ka.onrender.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: [
      'woodcock-sweeping-camel.ngrok-free.app',
      'ai-resume-70ka.onrender.com'
    ]
  }
})
