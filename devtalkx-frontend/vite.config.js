import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // 🚀 Locks the frontend to your expected port
    strictPort: true, // 🚀 Prevents Vite from automatically switching to 5174 if 5173 is busy
    host: true,       // 🚀 Helpful for network access if you want to test on your phone
  },
})