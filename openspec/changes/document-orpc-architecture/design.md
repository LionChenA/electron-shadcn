# Design: oRPC IPC Architecture

## Context
oRPC enables end-to-end type-safe RPC over MessageChannel, avoiding traditional ipcMain/ipcRenderer serialization overhead. Types inferred from main router via `import type`, preserving process isolation.

## Goals
- High-performance bidirectional IPC
- Full TypeScript type safety
- Modular feature handlers
- Secure preload bridge
- Context-aware procedures (e.g., BrowserWindow access)

## Non-Goals
- Support non-oRPC IPC
- OpenAPI/HTTP exposure

## Key Components

```
Renderer (Client)          Preload (Bridge)       Main (Server)
    |                           |                       |
    | new MessageChannel()      |                       |
    | postMessage(port2) ---->  | listen 'message'     |
    |                           | ipcRenderer.postMsg  |
    |                           | -------------------> |
    |                           |                       | ipcMain.on()
    |<-- direct MessagePort <---|                       | rpcHandler.upgrade()
    |  client.app.getVersion()  |                       |
```

### 1. Handlers (`src/main/ipc/*/*.ts`)
Feature-specific procedures:
```ts
export const getAppVersion = os.handler(() => app.getVersion());
```
Uses `os.use(context)` for window ops.

### 2. Router (`src/main/ipc/router.ts`)
```ts
export const router = os.router({ app, theme, window });
export type AppRouter = typeof router;
```

### 3. Server (`src/main/ipc/handler.ts`, `main/index.ts`)
```ts
const rpcHandler = new RPCHandler(router);
ipcMain.on('start-orpc-server', (e) => rpcHandler.upgrade(port, { context: ipcContext }));
```

### 4. Client (`src/renderer/ipc/manager.ts`)
```ts
import type { AppRouter } from '@/main/ipc/router';
import type { RouterClient } from '@orpc/server';
const client = createORPCClient<AppRouter>({ link: new RPCLink({ port: clientPort }) });
ipc.client.app.getAppVersion(); // Fully typed
```

### 5. Type Flow
- Main exports `type AppRouter`
- Renderer `import type { AppRouter }` (compile-time only)
- Client typed as `RouterClient<AppRouter>`

### 6. Shared
- `src/shared/constants/IPC_CHANNELS = { START_ORPC_SERVER: 'start-orpc-server' }`

## Trade-offs
- MessageChannel: Zero-copy transfers, but ports unshareable post-transfer.
- No Zod inputs in current impl (add for validation).
- Dynamic import handler avoids circular deps.

## Risks
- Context misuse (e.g., unpassed ipcContext).
- Type breaks if router changes without client rebuild.

## References
- [oRPC Electron Adapter](https://github.com/unnoq/orpc/blob/main/apps/content/docs/adapters/electron.md)
- `doc/orpc.md`
- `openspec/changes/integrate-upstream-main-changes/orpc-electron-guide.md`

## Maintenance: Adding New Procedures

### Steps to Add IPC Endpoint
1. **Create feature dir**: `src/main/ipc/<feature>/handlers.ts`
2. **Define procedure**:
```ts
import { os } from '@orpc/server';
export const newProcedure = os.handler(({ input }) => {
  // Logic here
  return result;
});
// Add .input(z.object({...})) for validation
```
3. **Export module**: `export const feature = { newProcedure };`
4. **Update router** (`src/main/ipc/router.ts`):
```ts
import { feature } from './feature';
export const router = os.router({
  // ...existing
  feature,
});
```
5. **Client usage** (auto-typed):
```ts
await ipc.client.feature.newProcedure({ input });
```
6. **Test**: Add integration test in `test/integration/ipc-<feature>.spec.ts`
7. **Validate**: `pnpm tsc -b`, run app, call endpoint.

**Minimal changes**: No client/server/preload updates needed. Types propagate automatically.

### Other Extensions
- **Middleware/Context**: `os.use(middleware).handler(...)`
- **Zod validation**: `.input(z.object({ ... }))`
- **Non-oRPC IPC**: Discouraged—extend router instead for type safety.
