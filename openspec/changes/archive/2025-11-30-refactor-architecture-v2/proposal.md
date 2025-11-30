# Proposal: Sequenced Architecture Refactor (v2)

## Why

Initial analysis revealed critical architectural issues, including a module circular dependency (`main` -> `shared` -> `main`) causing `tsc --build` failures, and tightly-coupled application logic (`checkForUpdates`). A research-first, phased approach is necessary to resolve these foundational problems correctly.

## What Changes

This proposal outlines a new, sequential plan to methodically refactor the architecture and resolve all build-time errors. It is based on a thorough investigation of the `oRPC` library (see `doc/orpc.md`).

The work will be executed in three phases:
1.  **Phase 1: Fix TSConfig & Circular Dependencies**: Establish a stable build environment.
2.  **Phase 2: Refactor Application Logic**: Move the `checkForUpdates` function into the IPC system.
3.  **Phase 3: Fix All Type Errors**: Apply the correct `oRPC` API syntax to fix all remaining type errors.

## Development Process

To ensure correctness at every step, a strict validation-driven approach will be used. After each significant code change within a phase, the `pnpm tsc -b --force` command **must** be run to immediately verify that the change has not introduced new build or type errors. Commits will only be made after successful validation.

## Impact

- **New Documentation**: The newly created `doc/orpc.md` serves as the project's authority on using oRPC.
- **Affected Specs**: `typed-ipc`, `auto-updater`.
- **Affected Code**: Widespread changes across `src/main`, `src/renderer`, and `src/shared` to correct the IPC implementation.