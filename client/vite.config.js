import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow network access
    port: 5173,
    allowedHosts: ['ed48d6d33d98.ngrok-free.app'], // <-- add your ngrok host here
  },
});
