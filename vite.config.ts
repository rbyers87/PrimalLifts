import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
     base: "/PrimalLifts",
    
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    conditions: ['import', 'module', 'browser', 'default']
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-router-dom': ['react-router-dom'],
          'react': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api/manifest': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/manifest/, '/manifest.json'),
      },
    },
  },

});
