import { os } from '@orpc/server';
import { app, autoUpdater } from 'electron';
import { publisher } from '../publisher';

export const currentPlatfom = os.handler(() => {
  return process.platform;
});

export const appVersion = os.handler(() => {
  return app.getVersion();
});

export const checkForUpdates = os.handler(() => {
  autoUpdater.checkForUpdates();
});

export const restartAndInstall = os.handler(() => {
  autoUpdater.quitAndInstall();
});

/**
 * A streaming handler that forwards updater status events to the client.
 */
export const onUpdateStatus = os.handler(async function* ({ signal }) {
  // Subscribe to the 'updater:status' event, auto-unsubscribing if the client disconnects.
  const iterator = publisher.subscribe('updater:status', { signal });
  for await (const payload of iterator) {
    // Yield each event payload to the connected client.
    yield payload;
  }
});
