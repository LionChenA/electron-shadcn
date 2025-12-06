import { eventIterator, os } from '@orpc/server';
import { app, autoUpdater } from 'electron';
import * as z from 'zod'; // Import zod
import { publisher } from '../publisher';

export const currentPlatfom = os
  .output(z.string()) // Define output schema as string
  .handler(() => {
    return process.platform;
  });

export const appVersion = os
  .output(z.string()) // Define output schema as string
  .handler(() => {
    return app.getVersion();
  });

export const checkForUpdates = os
  .output(z.void()) // Explicitly define output as void
  .handler(() => {
    autoUpdater.checkForUpdates();
  });

export const restartAndInstall = os
  .output(z.void()) // Explicitly define output as void
  .handler(() => {
    autoUpdater.quitAndInstall();
  });

/**
 * A streaming handler that forwards updater status events to the client.
 */
// Define the Zod schema for the updater status payload
const UpdaterStatusPayloadSchema = z.object({
  status: z.union([
    z.literal('checking'),
    z.literal('available'),
    z.literal('not-available'),
    z.literal('downloaded'),
    z.literal('error'),
  ]),
  message: z.string().optional(),
});

export const onUpdateStatus = os
  .output(eventIterator(UpdaterStatusPayloadSchema)) // Wrap schema with eventIterator for streaming
  .handler(async function* ({ signal }) {
    // Subscribe to the 'updater:status' event, auto-unsubscribing if the client disconnects.
    const iterator = publisher.subscribe('updater:status', { signal });
    for await (const payload of iterator) {
      // Yield each event payload to the connected client.
      yield payload;
    }
  });
