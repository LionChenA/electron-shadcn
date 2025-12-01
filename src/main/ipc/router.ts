/**
 * oRPC Router: Composes all feature-specific IPC procedures into a single typed API surface.
 *
 * - Each feature (app, theme, window) exports a module of os.handler procedures.
 * - os.router nests them for namespaced access: ipc.client.app.getAppVersion()
 * - export type AppRouter enables renderer type-safety via 'import type' (compile-time only).
 *
 * Reference: openspec/changes/document-orpc-architecture/design.md
 */
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
