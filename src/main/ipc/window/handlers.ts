/**
 * Window IPC Procedures: Use a middleware to safely access the BrowserWindow instance.
 *
 * Client call: await ipc.client.window.minimizeWindow()
 * The middleware ensures the window exists before the handler is executed.
 */
import { os } from '@orpc/server';
import * as z from 'zod'; // Import zod
import { ipcContext } from '../context';

/**
 * A middleware that ensures the main window is available before proceeding.
 * It retrieves the window from the global ipcContext at runtime.
 */
const requireWindowMiddleware = os.middleware(({ next }) => {
  const window = ipcContext.mainWindow;
  if (!window) {
    // This error will be thrown at runtime if a procedure is called before
    // the main window is ready, which is safer than a startup crash.
    throw new Error('Main window is not available for this procedure.');
  }
  // Inject the window into the context for the next handler.
  return next({ context: { window } });
});

export const minimizeWindow = os
  .use(requireWindowMiddleware)
  .output(z.void()) // Explicitly define output as void
  .handler(({ context }) => {
    context.window.minimize();
  });

export const maximizeWindow = os
  .use(requireWindowMiddleware)
  .output(z.void()) // Explicitly define output as void
  .handler(({ context }) => {
    // The context now safely contains the window thanks to the middleware.
    if (context.window.isMaximized()) {
      context.window.unmaximize();
    } else {
      context.window.maximize();
    }
  });

export const closeWindow = os
  .use(requireWindowMiddleware)
  .output(z.void()) // Explicitly define output as void
  .handler(({ context }) => {
    context.window.close();
  });
