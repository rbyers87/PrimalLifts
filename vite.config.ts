import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  // already imported

export default defineConfig({
  plugins: [react()],
  base: "/PrimalLifts",
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),  // <-- add this
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    historyApiFallback: true,
  },
});
