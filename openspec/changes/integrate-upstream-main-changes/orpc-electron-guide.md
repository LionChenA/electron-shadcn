# Comprehensive Guide to oRPC Integration in Electron

This document provides a detailed technical guide for understanding and implementing oRPC within our Electron application. It covers core oRPC concepts, the underlying communication technology, and a concrete implementation plan.

---

## 1. oRPC Core Concepts

oRPC's design philosophy is **"Compositional Building"**. It provides a toolkit (`os`) to build type-safe, modular, and reusable API procedures.

- **Procedure**: A single, remote-callable function. It is built by chaining methods from the `os` object (e.g., `os.input(...).use(...).handler(...)`).
  - **`.input(zodObject)`**: Defines and validates the input schema for the procedure, typically using the `zod` library. This ensures data is safe and well-formed before your logic runs.
  - **`.handler(logicFunction)`**: The core business logic of the procedure. It receives the validated `input` and a `context` object.
- **Middleware (`.use(middleware)`)**: A reusable piece of logic that runs before the handler. It's ideal for authentication, logging, or establishing database connections. Middleware can read and modify the `context` object.
- **Context (`context`)**: An object that is passed through the middleware chain to the handler. It's used to share state, such as user session data or database connections.
- **Router**: A simple JavaScript object that composes your finished procedures into a nested, organized API structure. This object's type is what gets exported to provide type safety on the client.

---

## 2. The Communication Backbone: Electron's `MessageChannel`

Instead of traditional, potentially slower IPC methods, the oRPC adapter uses a modern, high-performance browser/Node.js feature called `MessageChannel`.

- **What it is**: `MessageChannel` creates a pair of connected `MessagePort` objects. One port can be kept in one process while the other is physically **transferred** to another process.
- **Why it's used**: This creates a **direct, dedicated communication pipeline** between the main and renderer processes. It has lower latency and higher throughput than serializing all data through `ipcRenderer.invoke`, making it ideal for responsive RPC calls.
- **The Flow**:
  1.  The **renderer** process creates the channel.
  2.  It sends one port to the **main** process via the **preload** script.
  3.  A direct two-way communication channel is now established.

---

## 3. oRPC's Electron Implementation

This section details the specific code for each of the three processes.

**Source**: [https://github.com/unnoq/orpc/blob/main/apps/content/docs/adapters/electron.md](https://github.com/unnoq/orpc/blob/main/apps/content/docs/adapters/electron.md)

### 3.1. Main Process (Server) Setup

**Responsibility**: Create the oRPC router and an `RPCHandler` to listen for and upgrade incoming port connections.

```typescript
// In main process (e.g., src/main/index.ts)
import { RPCHandler } from '@orpc/server/message-port';
import { onError } from '@orpc/server';
import { ipcMain, app } from 'electron';
import { router } from './router'; // Your router definition

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error('oRPC Error:', error);
    }),
  ],
});

app.whenReady().then(() => {
  ipcMain.on('start-orpc-server', async (event) => {
    const [serverPort] = event.ports;
    handler.upgrade(serverPort);
    serverPort.start();
  });
});
```

### 3.2. Preload Script (Bridge) Setup

**Responsibility**: A simple, secure message forwarder. It listens for a specific message from the renderer and passes the `MessagePort` to the main process without inspecting it.

```typescript
// In preload script (e.g., src/preload/index.ts)
import { ipcRenderer } from 'electron';

window.addEventListener('message', (event) => {
  if (event.data === 'start-orpc-client') {
    const [serverPort] = event.ports;
    ipcRenderer.postMessage('start-orpc-server', null, [serverPort]);
  }
});
```

### 3.3. Renderer Process (Client) Setup

**Responsibility**: Initiate the connection by creating the `MessageChannel` and configuring the oRPC client.

```typescript
// In renderer process (e.g., src/renderer/rpc.ts)
import { RPCLink } from '@orpc/client';
import { createORPCClient } from '@orpc/client';
import type { AppRouter } from '../main/router'; // See Section 4

const { port1: clientPort, port2: serverPort } = new MessageChannel();

window.postMessage('start-orpc-client', '*', [serverPort]);

const link = new RPCLink({
  port: clientPort,
});

clientPort.start();

export const orpc = createORPCClient<AppRouter>({ link });
```

---

## 4. End-to-End Type Safety Explained

The "magic" of oRPC's type safety comes from combining TypeScript's type inference with a special `import type` statement.

1.  **Exporting the Type**: In the `main` process, after defining your router, you export its **type**, not its value:
    ```typescript
    // src/main/router.ts
    export const router = { /* ... your procedures ... */ };
    export type AppRouter = typeof router; // Exporting the TYPE of the router
    ```
2.  **Importing the Type**: In the `renderer` process, you use `import type` to import this shape.
    ```typescript
    // src/renderer/rpc.ts
    import type { AppRouter } from '../main/router';
    ```
    This is a **compile-time only** instruction. It tells the TypeScript compiler about the API's shape but is **erased** when generating the final JavaScript. It does **not** bundle any main process code into the renderer, thus preserving process isolation.

3.  **Creating the Typed Client**: The imported `AppRouter` type is used as a generic parameter to `createORPCClient`. This gives you a fully-typed client object with auto-completion and compile-time checks.
    ```typescript
    export const orpc = createORPCClient<AppRouter>({ link });

    // This is now fully type-safe!
    // orpc.user.create.mutate({ name: 'Lion' });
    ```
