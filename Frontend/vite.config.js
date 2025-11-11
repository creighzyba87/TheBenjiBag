import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000, // Use the port specified by the user
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Assuming backend runs on 3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
