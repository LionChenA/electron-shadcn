# orpc-based-ipc Specification

## Purpose
Type-safe, performant IPC pipeline using oRPC framework over Electron MessageChannel. Ensures modular handlers, automatic type propagation, and extensible procedures without handshake changes. 
## Requirements
### Requirement: The project's module dependency graph MUST be acyclic

The TypeScript project references (`main`, `preload`, `renderer`, `shared`) MUST NOT form a circular dependency graph. The dependency flow MUST be unidirectional (e.g., `main` -> `shared`, `renderer` -> `shared`, but not `shared` -> `main`).

#### Scenario: Verify acyclic dependencies
- **Given** the project code has been checked out.
- **When** a developer runs `pnpm tsc -b --force`.
- **Then** the command MUST NOT produce any `TS6202` circular dependency errors.

### Requirement: Modular oRPC Router in Main Process
The main process SHALL compose all IPC procedures into a single typed router object at `src/main/ipc/router.ts`.

#### Scenario: Router composition
- **Given** feature handlers defined in `src/main/ipc/app/handlers.ts`, `theme/handlers.ts`, `window/handlers.ts`
- **When** `os.router({ app, theme, window })` executed
- **Then** `router` exposes nested typed API surface and `type AppRouter = typeof router` for client import

### Requirement: oRPC Server Handler Upgrade
The main process SHALL instantiate `RPCHandler<AppRouter>` and upgrade incoming MessagePorts with IPC context.

#### Scenario: Server upgrade on handshake
- **Given** `rpcHandler` from `@/main/ipc/handler`
- **When** `ipcMain.on(IPC_CHANNELS.START_ORPC_SERVER)` receives event with port
- **Then** `rpcHandler.upgrade(serverPort, { context: ipcContext })` and `serverPort.start()`

### Requirement: Secure Preload MessagePort Bridge
The preload script SHALL forward renderer MessagePorts to main without inspection.

#### Scenario: Port forwarding
- **Given** renderer `window.postMessage(IPC_CHANNELS.START_ORPC_SERVER, '*', [serverPort])`
- **When** preload `window.addEventListener('message')` matches data
- **Then** `ipcRenderer.postMessage(IPC_CHANNELS.START_ORPC_SERVER, null, [serverPort])`

### Requirement: Typed oRPC Client in Renderer
The renderer SHALL create type-safe client via `createORPCClient<AppRouter>` over RPCLink.

#### Scenario: Client initialization
- **Given** `import type { AppRouter } from '@/main/ipc/router'`
- **When** `IPCManager` constructs `RPCLink({ port: clientPort })` and `createORPCClient<AppRouter>(rpcLink)`
- **Then** `ipc.client.app.getAppVersion()` is fully typed async call

### Requirement: Feature-Isolated Handlers with Context
IPC handlers SHALL be modularized by feature under `src/main/ipc/<feature>/` using `os.handler` or `os.use(context)`.

#### Scenario: Window minimize with context
- **Given** `minimizeWindow = os.use(ipcContext.mainWindowContext).handler(({ context }) => context.window.minimize())`
- **When** client calls `ipc.client.window.minimizeWindow()`
- **Then** `BrowserWindow` accessed via injected context

### Requirement: Extensible Procedure Addition
New IPC procedures SHALL be added modularly without changing handshake, client setup, or type imports.

#### Scenario: Add new feature endpoint
- **Given** existing oRPC pipeline functional
- **When** developer adds handler to new/existing feature module and updates router
- **Then** `pnpm tsc -b` succeeds, client auto-completes `ipc.client.<feature>.<procedure>()`, calls work end-to-end

