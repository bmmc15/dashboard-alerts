import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
