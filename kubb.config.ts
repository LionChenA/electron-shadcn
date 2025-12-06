import { defineConfig } from '@kubb/core';
import { pluginFaker } from '@kubb/plugin-faker';
import { pluginMsw } from '@kubb/plugin-msw';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  root: '.',
  input: {
    path: './test/mocks/openapi.json',
  },
  output: {
    path: './test/mocks/gen',
    clean: true,
    extension: {
      '.ts': '', // Crucial: Remove .ts extension from import paths
    },
  },
  plugins: [
    pluginOas({
      validate: true,
    }),
    pluginTs({
      output: {
        path: 'types',
      },
      enumType: 'asConst',
    }),
    pluginZod({
      output: {
        path: 'zod',
      },
    }),
    pluginFaker({
      output: {
        path: 'faker',
      },
    }),
    pluginMsw({
      output: {
        path: 'msw',
      },
    }),
  ],
});
