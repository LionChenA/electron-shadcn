/**
 * oRPC Server Handler: Instantiates RPCHandler from main router.
 *
 * - Handles incoming MessagePort upgrades from renderer handshake.
 * - Typed with AppRouter for procedure validation.
 * - Used in main/index.ts: rpcHandler.upgrade(port, { context: ipcContext })
 *
 * No interceptors added yet (e.g., onError); extend as needed.
 */
import { RPCHandler } from '@orpc/server/message-port';
import { type AppRouter, router } from './router';

export const rpcHandler: RPCHandler<AppRouter> = new RPCHandler(router);
