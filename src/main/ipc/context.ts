/**
 * oRPC IPC Context: Provides main-window access to handlers.
 *
 * - Injected at upgrade: rpcHandler.upgrade(port, { context: ipcContext })
 * - mainWindowContext middleware: os.middleware injecting { window: BrowserWindow }
 * - Usage in handlers: os.use(ipcContext.mainWindowContext).handler(({ context }) => ...)
 *
 * Ensures handlers are window-aware without globals.
 */
import type { BrowserWindow } from 'electron';

class IPCContext {
  public mainWindow: BrowserWindow | undefined;

  public setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }
}

export const ipcContext = new IPCContext();
