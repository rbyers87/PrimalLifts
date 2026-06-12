import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/**/*', 'manifest.json'],
      manifest: {
        name: 'Primal Lifts',
        short_name: 'PrimalLifts',
        description: 'Track your workouts and fitness progress',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/PrimalLifts/',
        scope: '/PrimalLifts/',
        icons: [
          {
            src: '/PrimalLifts/icons/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: '/PrimalLifts/icons/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/PrimalLifts/icons/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/PrimalLifts/icons/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/PrimalLifts/icons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/PrimalLifts/icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  base: '/PrimalLifts/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
        },
      },
    },
  },
});
