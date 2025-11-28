import { ipc } from '@/shared/ipc/manager';

export function getPlatform() {
  return ipc.client.platform.currentPlatfom();
}
