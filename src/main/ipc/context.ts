/**
 * oRPC IPC Context: Provides main-window access to handlers.
 *
 * - Injected at upgrade: rpcHandler.upgrade(port, { context: ipcContext })
 * - mainWindowContext middleware: os.middleware injecting { window: BrowserWindow }
 * - Usage in handlers: os.use(ipcContext.mainWindowContext).handler(({ context }) => ...)
 *
 * Ensures handlers are window-aware without globals.
 */
import { os } from '@orpc/server';
import type { BrowserWindow } from 'electron';

class IPCContext {
  public mainWindow: BrowserWindow | undefined;

  public setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  private requireMainWindow(): BrowserWindow {
    if (!this.mainWindow) {
      throw new Error('Main window is not set in IPC context.');
    }
    return this.mainWindow;
  }
}

export const ipcContext = new IPCContext();
