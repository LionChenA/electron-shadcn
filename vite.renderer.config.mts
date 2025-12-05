import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config.mts';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/renderer/routes',
        generatedRouteTree: './src/renderer/routeTree.gen.ts',
        semicolons: true,
        quoteStyle: 'single',
      }),
      tailwindcss(),
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
    ],
  }),
);
