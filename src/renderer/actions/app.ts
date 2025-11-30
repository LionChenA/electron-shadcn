import { ipc } from '@/renderer/ipc/manager';

console.log('ipc.client', ipc.client);

export function getPlatform() {
  return ipc.client.app.currentPlatfom();
}

export function getAppVersion() {
  return ipc.client.app.appVersion();
}
