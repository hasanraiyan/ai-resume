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
      '76ec-2409-40e4-10a3-ca4c-41f6-e71b-e806-33e.ngrok-free.app',
      'ai-resume-70ka.onrender.com'
    ]
  }
})
