import webExtension from '@samrum/vite-plugin-web-extension';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { getManifest } from './src/manifest';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      webExtension({
        manifest: getManifest(),
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        input: {
         // options: resolve(__dirname, '/src/entries/onboarding/index.html'),
        },
      },
    },
  };
});
