import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Optional: allows external access
    allowedHosts: [
      'abacus-game.ru',
      'www.abacus-game.ru', // Include www subdomain if needed
      'localhost' // Keep localhost for local development
    ]
  }
})