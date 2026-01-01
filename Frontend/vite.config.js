import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cấu hình Vite với plugin React
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // hoặc sử dụng 'localhost'
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});