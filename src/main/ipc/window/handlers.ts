/**
 * Window IPC Procedures: Use ipcContext.mainWindowContext for BrowserWindow access.
 *
 * Client call: await ipc.client.window.minimizeWindow()
 * Context injected automatically via router/os.use chain.
 */
import { os } from '@orpc/server';
import type { BrowserWindow } from 'electron';
import { ipcContext } from '../context';

function requireWindow(window: BrowserWindow | undefined): BrowserWindow {
  if (!window) {
    throw new Error('Window is not available');
  }
  return window;
}

export const minimizeWindow = os.use(ipcContext.mainWindowContext).handler(({ context }) => {
  const { window } = context;

  requireWindow(window).minimize();
});

export const maximizeWindow = os.use(ipcContext.mainWindowContext).handler(({ context }) => {
  const { window } = context;
  const windoww = requireWindow(window);
  if (windoww.isMaximized()) {
    windoww.unmaximize();
  } else {
    windoww.maximize();
  }
});

export const closeWindow = os.use(ipcContext.mainWindowContext).handler(({ context }) => {
  const { window } = context;

  requireWindow(window).close();
});
