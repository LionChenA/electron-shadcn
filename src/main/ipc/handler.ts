import { RPCHandler } from '@orpc/server/message-port';
import { type AppRouter, router } from './router';

export const rpcHandler: RPCHandler<AppRouter> = new RPCHandler(router);
