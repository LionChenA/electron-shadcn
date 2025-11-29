# oRPC in Electron Project Architecture Guide

This document serves as a comprehensive guide to understanding and utilizing the oRPC architecture within this Electron project. It aims to answer key questions about core concepts, correct usage syntax, and best practices tailored for the Electron environment.

## Key Questions & Answers

### 1. What is oRPC and its core conceptual model?

oRPC is a framework for building end-to-end type-safe APIs. Its model consists of three main components:

- **Router**: A server-side object (in the `main` process) that collects all your procedures into a single public API.
- **Procedure**: An individual function on the router, which is your API endpoint. A `handler` in our code is a procedure.
- **Client**: A client-side object (in the `renderer` process) that lets you call your server-side procedures as if they were local, typed TypeScript functions.

Communication between the client and server is handled by **Links**. In this project, we use an `RPCLink` that works over Electron's `MessageChannel`, which is a modern and performant IPC mechanism.

### 2. How are procedures defined on the oRPC server in Electron?

Procedures are defined in the `src/main/ipc/` directories using `os.handler`. The basic pattern is to export a function created with `os.handler`.

**Example: `src/main/ipc/app/handlers.ts`**
```typescript
import { os } from '@orpc/server';
import { app } from 'electron';

// A procedure to get the application version
export const getAppVersion = os.handler(() => {
  return app.getVersion();
});

// A procedure to get the current platform
export const getCurrentPlatform = os.handler(() => {
  return process.platform;
});
```

### 3. How does oRPC connect in an Electron app (The Handshake)?

The connection does **not** use `contextBridge` for oRPC. Instead, it uses a three-step process involving a `MessageChannel` to establish a direct communication channel:

1.  **Renderer (`src/renderer/ipc/manager.ts`)**: The `IPCManager` creates a new `MessageChannel`, which yields two ports (`port1` and `port2`). It sends `port2` to the preload script via `window.postMessage`.
2.  **Preload (`src/preload/index.ts`)**: The preload script listens for this `message`, extracts `port2`, and securely forwards it to the `main` process using `ipcRenderer.postMessage`.
3.  **Main (`src/main/index.ts`)**: The `main` process listens for this `ipcMain.on` message, receives `port2`, and passes it to `rpcHandler.upgrade()` to complete the connection.

### 4. What is the correct client-side syntax for calling procedures?

**This is the most critical finding from our research.** Calling oRPC procedures does **not** use `.query()` or `.mutate()` like in standard tRPC. Instead, you **call the procedure directly** as if it were an `async` function on the client object.

**Correct Example:**
```typescript
import { ipc } from '@/renderer/ipc/manager';

// For a procedure that returns a value (like a query)
async function fetchAppVersion() {
  const version = await ipc.client.app.getAppVersion();
  console.log(version);
}

// For a procedure that returns no value (like a mutation)
async function closeAppWindow() {
  await ipc.client.window.closeWindow();
}

// For a procedure with an input
async function setTheme(newTheme: 'dark' | 'light') {
  await ipc.client.theme.setThemeMode(newTheme);
}
```

### 5. How does the client get its types correctly?

The primary mistake in our codebase that caused the "is not callable" errors was using the wrong type for the client.

The correct type is **`RouterClient`**, and it must be imported from **`@orpc/server`**, not `@orpc/client`.

**Correct setup in `src/renderer/ipc/manager.ts`:**
```typescript
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import type { RouterClient } from '@orpc/server'; // <<< Correct import
import type { AppRouter } from '@/main/ipc/router';

class IPCManager {
  // ...
  public readonly client: RouterClient<AppRouter>; // <<< Correct type usage

  constructor() {
    // ...
    this.client = createORPCClient<AppRouter>(this.rpcLink);
  }
  // ...
}
```

### 6. How is Context passed and used in the Electron Adapter?

The `context` is created in `src/main/ipc/context.ts` and passed to the `RPCHandler` in the main process when the connection is established.

**In `src/main/index.ts`:**
```typescript
import { ipcContext } from '@/main/ipc/context';

// ...
async function setupORPC() {
  const { rpcHandler } = await import('@/main/ipc/handler');
  ipcMain.on(IPC_CHANNELS.START_ORPC_SERVER, (event) => {
    const [serverPort] = event.ports;

    serverPort.start();
    // The context is passed here
    rpcHandler.upgrade(serverPort, { context: ipcContext });
  });
}
```

Inside an individual procedure `handler`, you can access the `context` via the function's arguments.

**Example `handler`:**
```typescript
import { os } from '@orpc/server';

export const minimizeWindow = os.handler(({ context }) => {
  // 'context' here is the ipcContext object we passed in
  const mainWindow = context.getMainWindow();
  mainWindow?.minimize();
});
```

### 7. Other Advanced Questions (Middleware, Error Handling, Serialization)

- **Middleware**: The oRPC documentation shows support for middleware with a `.use()` syntax, allowing for cross-cutting concerns like auth to be handled.
- **Error Handling**: If a server-side `handler` `throw`s an error, the client-side `await` call will `reject` the promise. This means you can (and should) wrap client calls in `try...catch` blocks to gracefully handle server errors.
- **Serialization**: oRPC handles serialization of basic JSON types automatically. For more complex types (`Date`, `Buffer`), manual transformation or a library like `superjson` may be needed, which is a common pattern in RPC libraries.
