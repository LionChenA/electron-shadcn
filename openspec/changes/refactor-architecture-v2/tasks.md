## Phase 1: Fix TypeScript Configuration & Circular Dependencies

The goal of this phase is to establish a correct and stable build environment by resolving the project's circular dependency.

- [x] 1.1. **Fix tsconfig**: In `src/shared/tsconfig.json`, remove the project reference to `main`.
- [x] 1.2. **Update IPC Manager**: In `src/renderer/ipc/manager.ts`, change the import for `AppRouter` to point directly to `@/main/ipc/router`.
- [x] 1.3. **Delete Redundant File**: Delete the file `src/shared/ipc/router.ts`.
- [x] 1.4. **Validation**: Run `pnpm tsc -b --force` and confirm that all `TS6059` and `TS6202` errors are gone. Other type errors are expected at this stage.
- [x] 1.5. **Commit**: Create a dedicated commit for the circular dependency fix.

## Phase 2: Refactor Application Logic into IPC

With a stable build configuration, we can now safely refactor application logic.

- [x] 2.1. **Create IPC Procedure**: In `src/main/ipc/app/handlers.ts`, create a new exported async function `checkForUpdates` that contains the logic from `update-electron-app`.
- [x] 2.2. **Export Procedure**: In `src/main/ipc/app/index.ts`, ensure the new `checkForUpdates` handler is exported.
- [x] 2.3. **Remove Old Logic**: In `src/main/index.ts`, remove the old `checkForUpdates` function and its call from the `app.whenReady()` promise chain.
- [x] 2.4. **Validation**: Run `pnpm tsc -b --force` to ensure the refactor has not introduced new build errors.
- [x] 2.5. **Commit**: Create a dedicated commit for the application logic refactor.

## Phase 3: Fix All Remaining Type Errors

Based on the research documented in `doc/orpc.md`, this phase will resolve all remaining type errors.

- [x] 3.1. **Fix Handler Argument**: In `src/main/index.ts`, fix the `rpcHandler.upgrade` call by importing `ipcContext` and passing `{ context: ipcContext }` as the second argument.
- [x] 3.2. **Fix Client Type**: In `src/renderer/ipc/manager.ts`, remove the incorrect `ORPCClient` import and type the client property correctly with `RouterClient` imported from `@orpc/server`.
- [x] 3.3. **Fix IPC Calls**: Revert all incorrect `.query()` and `.mutate()` calls in `src/renderer/actions/` and `src/renderer/theme/service.ts`, using direct async calls as documented in `doc/orpc.md`.
- [x] 3.4. **Fix Implicit 'any'**: Add explicit types for promise handlers in `src/renderer/components/DragWindowRegion.tsx`.
- [x] 3.5. **Final Validation**: Run `pnpm tsc -b --force` and confirm that it completes with **zero** errors.
- [x] 3.6. **Commit**: Create a final commit for all the type fixes.
- [x] 3.7. **Regression Testing**: Run `pnpm test:all` to ensure the refactoring has not introduced any regressions.