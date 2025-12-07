/**
 * oRPC Client Manager (Renderer Process):
 *
 * - Creates MessageChannel: keeps clientPort, sends serverPort to preload via postMessage.
 * - RPCLink over clientPort for transport.
 * - createORPCClient<AppRouter> provides fully-typed proxy: ipc.client.<feature>.<procedure>()
 *
 * Type Flow:
 * 1. Main exports type AppRouter = typeof router
 * 2. import type { AppRouter } from '@/main/ipc/router' (erased at runtime)
 * 3. RouterClient<AppRouter> generic ensures end-to-end safety.
 *
 * Usage: await ipc.client.app.getAppVersion()
 *
 * Reference: openspec/changes/document-orpc-architecture/
 */

import { createORPCClient } from '@orpc/client';
import { RPCLink as HTTPRPCLink } from '@orpc/client/fetch'; // Corrected import for HTTP-based RPCLink
import { RPCLink } from '@orpc/client/message-port';
import { createSWRUtils } from '@orpc/experimental-react-swr';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from '@/main/ipc/router';
import { IPC_CHANNELS } from '@/shared/constants';

class IPCManager {
  private readonly clientPort?: MessagePort; // Make optional
  private readonly serverPort?: MessagePort; // Make optional

  private readonly rpcLink: RPCLink<Record<never, never>> | HTTPRPCLink<Record<never, never>>; // Union type
  public readonly client: RouterClient<AppRouter>;
  private initialized: boolean = false;

  constructor() {
    if (process.env.NODE_ENV === 'test') {
      // In test environment, use HTTPRPCLink
      this.rpcLink = new HTTPRPCLink({
        url: 'http://localhost/rpc', // Default URL for MSW
      });
      // clientPort and serverPort are not needed for HTTPRPCLink, so they remain undefined
    } else {
      // In production/development, use RPCLink over MessagePort
      const { port1: clientChannelPort, port2: serverChannelPort } = new MessageChannel();
      this.clientPort = clientChannelPort;
      this.serverPort = serverChannelPort;

      this.rpcLink = new RPCLink<Record<never, never>>({
        port: this.clientPort,
      });
    }

    this.client = createORPCClient<RouterClient<AppRouter>>(this.rpcLink);
  }

  public initialize() {
    if (this.initialized) {
      return;
    }

    if (this.clientPort && this.serverPort) {
      // Only initialize MessagePort if it exists
      this.clientPort.start();
      window.postMessage(IPC_CHANNELS.START_ORPC_SERVER, '*', [this.serverPort]);
    }
    this.initialized = true;
  }
}

/**
 * The raw oRPC client. Use this for one-off procedure calls outside of React components.
 */
export const ipc = new IPCManager();
ipc.initialize();

/**
 * An SWR-aware oRPC client. Use this with SWR hooks (`useSWR`, `useSWRSubscription`)
 * to integrate oRPC procedures with React's data fetching and state management.
 */
export const swrORPC = createSWRUtils(ipc.client);
