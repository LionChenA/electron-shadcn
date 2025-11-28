import { createORPCClient, type ORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import { IPC_CHANNELS } from '@/shared/constants';
import type { AppRouter } from '@/shared/ipc/router';

class IPCManager {
  private readonly clientPort: MessagePort;
  private readonly serverPort: MessagePort;

  private readonly rpcLink: RPCLink;
  public readonly client: ORPCClient<AppRouter>;
  private initialized: boolean = false;

  constructor() {
    const { port1: clientChannelPort, port2: serverChannelPort } = new MessageChannel();
    this.clientPort = clientChannelPort;
    this.serverPort = serverChannelPort;

    this.rpcLink = new RPCLink({
      port: this.clientPort,
    });

    this.client = createORPCClient<AppRouter>(this.rpcLink);
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
