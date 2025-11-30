import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from '@/main/ipc/router';
import { IPC_CHANNELS } from '@/shared/constants';

class IPCManager {
  private readonly clientPort: MessagePort;
  private readonly serverPort: MessagePort;

  private readonly rpcLink: RPCLink<AppRouter>;
  public readonly client: RouterClient<AppRouter>;
  private initialized: boolean = false;

  constructor() {
    const { port1: clientChannelPort, port2: serverChannelPort } = new MessageChannel();
    this.clientPort = clientChannelPort;
    this.serverPort = serverChannelPort;

    this.rpcLink = new RPCLink({
      port: this.clientPort,
    });

    this.client = createORPCClient(this.rpcLink) as unknown as RouterClient<AppRouter>;
  }

  public initialize() {
    if (this.initialized) {
      return;
    }

    this.clientPort.start();

    window.postMessage(IPC_CHANNELS.START_ORPC_SERVER, '*', [this.serverPort]);
    this.initialized = true;
  }
}

export const ipc = new IPCManager();
ipc.initialize();
