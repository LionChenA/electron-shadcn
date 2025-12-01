## ADDED Requirements

### Requirement: Establish a centralized, type-safe IPC mechanism

A robust Inter-Process Communication system SHALL be implemented that ensures end-to-end type safety between the `main`, `preload`, and `renderer` processes, based on the "Centralized Shared Types" model.

#### Scenario: Type mismatch causes a compilation error
- **Given** an IPC endpoint's type signature is defined in `src/shared/ipc/types.ts`.
- **And** the `main` process implements the handler for that endpoint, importing the type.
- **And** the `preload` script exposes the API via `contextBridge`, importing the same type.
- **When** a developer intentionally introduces a type mismatch in the `main` process handler (e.g., changing an argument type from `string` to `number`).
- **Then** running `tsc --build` results in a compile-time error, preventing the application from building.

### Requirement: Migrate existing features to the new typed IPC system

The existing `theme` and `window` management features SHALL be migrated from their legacy implementation to the new "oRPC" framework.

#### Scenario: User toggles the application theme
- **Given** the application is running.
- **When** the user clicks the theme toggle button.
- **Then** the application's theme changes accordingly.
- **And** the action is processed through the new `oRPC` channel for theme management, not the legacy IPC system.

#### Scenario: Old IPC implementation is removed
- **Given** the migration to the oRPC system is complete.
- **When** a developer inspects the codebase.
- **Then** legacy IPC handler files like `listenersRegister.ts` and the old `themeListeners.ts` no longer exist or are empty.
