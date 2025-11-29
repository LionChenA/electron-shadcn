import { os } from '@orpc/server';
import { app } from 'electron';
import { updateElectronApp } from 'update-electron-app';

export const currentPlatfom = os.handler(() => {
  return process.platform;
});

export const appVersion = os.handler(() => {
  return app.getVersion();
});

export const checkForUpdates = os.handler(async () => {
  updateElectronApp({
    repo: 'LionChenA/electron-shadcn',
  });
});
