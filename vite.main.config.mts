import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config.mts';

// https://vitejs.dev/config
export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'main.js',
        },
      },
    },
  }),
);
