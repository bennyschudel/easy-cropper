import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

import eslint from 'vite-plugin-eslint';
import BundleSize from 'vite-plugin-bundlesize';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  return {
    build: {
      sourcemap: 'hidden',
      lib: {
        entry: resolve(__dirname, './src/main.js'),
        name: 'EasyCropper',
        fileName: 'easy-cropper',
        formats: ['es'],
      },
      rollupOptions: {
        output: {
          entryFileNames(chunkInfo) {
            return '[name].min.js';
          },
        },
        external: [
          'lit',
          /^lit-html\/.*/,
          'd3-selection',
          'd3-zoom',
        ],
      },
      chunkSizeWarningLimit: 200,
    },
    plugins: [
      eslint(),
      BundleSize({
        stats: 'all',
        limits: [
          {
            name: "**/*",
            limit: "200 kB"
          },
        ],
      }),
    ],
  };
});
