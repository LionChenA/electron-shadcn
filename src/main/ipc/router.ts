import { os } from '@orpc/server';
import { app } from './app';
import { theme } from './theme';
import { window } from './window';

export const router = os.router({
  app,
  theme,
  window,
});

export type AppRouter = typeof router;
