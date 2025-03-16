import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
],
  server: {
    allowedHosts: ["5a89de2e-dbd2-4846-acc4-b2dca836e135-00-1sogi46tnm1k.sisko.replit.dev",]
  }
})
