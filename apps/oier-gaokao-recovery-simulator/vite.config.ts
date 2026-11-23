import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: '../../public/repost/oier-gaokao-recovery-simulator',
    emptyOutDir: true,
  },
  server: {
    hmr: true,
    watch: {},
  },
});
