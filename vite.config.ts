import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Relative paths for GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    // Allow iframe embedding during dev
    headers: {
      'X-Frame-Options': 'ALLOWALL',
    },
  },
});
