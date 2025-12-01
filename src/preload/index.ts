/**
 * oRPC Preload Bridge: Secure, minimal forwarder.
 *
 * - Listens window 'message' from renderer for START_ORPC_SERVER + port.
 * - Forwards port to main via ipcRenderer.postMessage (no inspection).
 * - Enables direct MessageChannel without contextBridge exposure.
 *
 * Critical: No oRPC logic here—pure transport.
 */
import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/shared/constants';

window.addEventListener('message', (event) => {
  if (event.data === IPC_CHANNELS.START_ORPC_SERVER) {
    const [serverPort] = event.ports;
    ipcRenderer.postMessage(IPC_CHANNELS.START_ORPC_SERVER, null, [serverPort]);
  }
});
