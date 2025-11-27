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

  public get mainWindowContext() {
    const window = this.requireMainWindow();

    return os.middleware(({ next }) =>
      next({
        context: {
          window,
        } as {
          window: BrowserWindow;
        },
      }),
    );
  }
}

export const ipcContext = new IPCContext();
