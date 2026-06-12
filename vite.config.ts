import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,txt}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/index.html', // Add this for SPA routing
        navigateFallbackAllowlist: [/^(?!\/__).*/], // Allow all routes except those starting with __
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 365 * 24 * 60 * 60
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Primal Lifts',
        short_name: 'PLs',
        description: 'Your workout tracking application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/', // Make sure this is correct
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
    
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    conditions: ['import', 'module', 'browser', 'default']
  },
  base: "/PrimalLifts/",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
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
