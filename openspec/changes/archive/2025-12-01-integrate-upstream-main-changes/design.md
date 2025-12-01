# Design: Adopting the oRPC Type-Inference Workflow

Based on detailed research of the oRPC framework and its Electron adapter, this document outlines the definitive design for integrating the `typed-ipc` feature. This plan supersedes any previous proposals of manual type management.

Our design is to **fully adopt the idiomatic, type-inference-based workflow provided by oRPC**.

## 1. Core Principle: Leverage Type Inference, Don't Recreate It

We will not manually create a "shared type dictionary." Instead, we will leverage oRPC's and TypeScript's ability to infer types from the implementation.

- The `main` process will define the `router` object containing all business logic.
- The `main` process will then export the *type* of this router: `export type AppRouter = typeof router;`.

## 2. Type-Safe Communication via `import type`

The `renderer` process will achieve type safety by importing the `AppRouter` type.

- A special `import type { AppRouter } from '../main/router';` statement will be used.
- This is a **compile-time-only** instruction that is erased from the final JavaScript output. It provides full type information to the renderer without breaking Electron's process isolation model.

## 3. Prerequisite: TypeScript Project Configuration

To enable the `import type` statement to work across our separated `src/main` and `src/renderer` directories, the project's TypeScript configuration (`tsconfig.json`) must be updated. The recommended and most robust approach is to implement **TypeScript Project References**.

This will involve creating distinct `tsconfig.json` files for `main`, `renderer`, and `preload`, and establishing a type-only dependency from `renderer` to `main`.

## 4. Implementation Reference

The concrete code patterns for setting up the oRPC client, server, and preload bridge are documented in our internal guide: **[orpc-electron-guide.md](./orpc-electron-guide.md)**. All implementation work should adhere to the patterns found in that guide.
