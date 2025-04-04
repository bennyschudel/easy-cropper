import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

import BundleSize from 'vite-plugin-bundlesize';

// https://vite.dev/config/
export default defineConfig({
  base: '/easy-cropper',
  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 200,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    tailwindcss(),
    BundleSize({
      stats: 'all',
      limits: [
        {
          name: '**/*',
          limit: '200 kB',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
