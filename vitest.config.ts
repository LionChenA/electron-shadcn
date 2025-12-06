/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
// Required for the 'storybook' project
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, defineProject } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    typecheck: {
      tsconfig: 'tsconfig.vitest.json',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'], // Global coverage include
    },
    reporters: ['verbose'], // Global reporter setting
    projects: [
      defineProject({
        plugins: [react(), tsconfigPaths()],
        test: {
          name: 'renderer',
          globals: true,
          environment: 'jsdom',
          css: true,
          setupFiles: ['test/vitest.setup.ts'],
          include: [
            'src/renderer/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
            'test/integration/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          ],
          exclude: [
            // Exclude Playwright e2e tests
            '**/test/e2e/**/*',
          ],
        },
      }),
      defineProject({
        plugins: [tsconfigPaths()],
        test: {
          name: 'main',
          environment: 'node',
          include: [
            'src/main/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
            'src/shared/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          ],
          exclude: [
            // Exclude Playwright e2e tests
            '**/test/e2e/**/*',
          ],
        },
      }),
      defineProject({
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm storybook --no-open',
          }),
          react(),
          tsconfigPaths(),
        ],
        test: {
          name: 'storybook',
          environment: 'jsdom', // The addon uses JSDOM usually, but can be configured for browser directly
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
          // The Storybook addon will only look for story files based on Storybook's config defined in .storybook/main.ts.
        },
      }),
    ],
  },
  optimizeDeps: {
    include: [
      '@storybook/test',
      'swr/subscription',
      '@orpc/client',
      '@orpc/experimental-react-swr',
      'zustand',
    ],
  },
});
