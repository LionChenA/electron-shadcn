# Proposal: Integrate Upstream Main Changes

This proposal outlines the plan to integrate a significant set of changes from the `upstream/main` branch into the current `dev` branch. The full list of 78 commits is documented and categorized in `changes.txt`.

The integration covers four main areas:
1.  **Dependency Updates**: Bumping versions for numerous development and runtime packages.
2.  **Typed IPC Integration**: A major architectural refactoring that introduces a type-safe RPC system ("oRPC") for Inter-Process Communication.
3.  **Code Structure Refactoring**: Standardizing file names and component organization.
4.  **Auto-Update & Publishing Features**: Adding production-ready features for application updates and release automation.

The primary challenge is reconciling the architectural differences in IPC handling between `main` and `dev`, specifically ensuring end-to-end type safety across the isolated `main`, `preload`, and `renderer` processes.

## Capabilities

- **dependency-updates**: Upgrades project dependencies to versions from the `main` branch.
- **typed-ipc**: Implements a shared-type solution and integrates the new "oRPC" framework.
- **code-structure**: Applies structural and naming convention changes.
- **auto-updater**: Integrates auto-update and release publishing capabilities.

## Design

Please see [design.md](./design.md) for the detailed architectural plan for solving the IPC type-safety challenge.
