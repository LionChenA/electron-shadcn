# Design: Unified Build and Test Configuration

## 1. Problem: Configuration Fragmentation and Context Collision

The project's current build and test configuration, while functional, suffers from fragmentation that leads to significant and difficult-to-resolve issues, particularly concerning TypeScript and Vitest.

### 1.1. TypeScript Context Collision

The primary issue stems from a "flat" TypeScript configuration attempting to service multiple, distinct runtime environments. The Electron architecture fundamentally separates the **Main process** (Node.js environment) from the **Renderer process** (Chromium/browser environment).

- **Current State**: A single `vitest.config.ts` is configured with a `'jsdom'` environment. The corresponding `tsconfig.vitest.json` includes all files under `src/**/*`.
- **The Conflict**: This forces the TypeScript compiler (`tsc`) to evaluate Node.js-specific code (e.g., from `src/main`, using `ipcMain`, `app`, `BrowserWindow`) and browser-specific code (e.g., from `src/renderer`, using React, DOM APIs) within the *same compilation context*. This is impossible to satisfy and results in "uncorrectable" type errors, as a file cannot simultaneously adhere to both Node.js and DOM type definitions.

### 1.2. Lack of Formalized Component Testing

The project's `project.md` specifies an intent to use Storybook for visual and component testing, but the mechanism is not formally integrated. This leaves a gap in the "Testing Pyramid," where interaction tests on components are difficult to write, run, and automate.

### 1.3. Unclear Configuration Hierarchy

The proliferation of multiple `tsconfig.*.json` and `vite.*.config.mts` files without a clearly documented hierarchy makes the build system difficult to understand and maintain. It's not immediately obvious which configuration file is the source of truth for shared settings like path aliases.

## 2. Proposed Architecture: Isolate, Centralize, and Integrate

The proposed solution is to refactor the build and test configuration to align with the project's underlying Electron architecture. This involves creating clear boundaries for each environment while centralizing shared settings.

### 2.1. TypeScript Configuration Hierarchy

We will implement a clear, hierarchical `tsconfig.json` structure.

- **`tsconfig.base.json` (New)**: This will be the **single source of truth** for all shared TypeScript settings. Its primary responsibilities are:
  - Defining the 14+ project-wide **path aliases** (`@/components/*`, etc.).
  - Establishing common `compilerOptions` like `target: 'ESNext'`, `strict: true`, etc.

- **Environment-Specific `tsconfig.json` Files (Refactored)**: Each distinct environment will have its own `tsconfig.json` that `extends` the base configuration.
  - `src/main/tsconfig.json`, `src/renderer/tsconfig.json`, `src/preload/tsconfig.json` will extend `../../tsconfig.base.json`. This makes them responsible only for environment-specific settings (like `lib` or `module`) while inheriting all path aliases.

- **Tool-Specific `tsconfig.*.json` Files (Refactored)**:
  - **`tsconfig.vitest.json`**: Extends `tsconfig.base.json`. Its role is to provide the type context for *any* test being run by Vitest, including globals for `vitest`, `jsdom`, and `browser` environments.
  - `tsconfig.json` (root): The root tsconfig will extend the base and primarily serve IDEs like VS Code for project-wide type-checking and IntelliSense.

This hierarchy ensures that path aliases are defined once and inherited everywhere, eliminating redundancy and potential for drift.

### 2.2. Vite Configuration

The existing pattern of separate Vite configuration files for each process is a sound strategy and will be maintained and formalized.

- `vite.main.config.mts`
- `vite.preload.config.mts`
- `vite.renderer.config.mts`

This separation correctly handles the different build targets and plugin requirements for each part of the Electron application. The use of `vite-tsconfig-paths` within these configurations will seamlessly resolve aliases from the new `tsconfig.base.json`.

### 2.3. Unified Testing Architecture (`vitest.config.ts`)

This is the core of the solution. We will leverage **Vitest's `projects` feature** to define three isolated testing environments within a single `vitest.config.ts` file. This directly resolves the context collision issue.

- **Project 1: `main`**
  - **Environment**: `'node'`
  - **Scope**: Tests for `src/main` and `src/shared`.
  - **Purpose**: Tests business logic, IPC handlers, and utilities that run in the Node.js environment.

- **Project 2: `renderer`**
  - **Environment**: `'jsdom'`
  - **Scope**: Traditional unit and integration tests for `src/renderer`.
  - **Purpose**: Tests React components, hooks, and browser-side logic in a simulated DOM environment.

- **Project 3: `storybook`**
  - **Environment**: `'browser'` (via Playwright)
  - **Scope**: Runs tests against stories (e.g., `*.stories.tsx`).
  - **Integration**: Uses the **`@storybook/addon-vitest`** and its `storybookTest` plugin. This addon transforms stories into executable tests that run in a real browser, allowing for true interaction testing.
  - **Purpose**: Fulfills the "Visual Testing" and component interaction testing layer of the testing pyramid.

## 3. Rationale and Benefits

- **Eliminates Context Collision**: By creating separate test projects for `node`, `jsdom`, and `browser` environments, we ensure that files are only ever type-checked and executed in a context that is valid for them.
- **Aligns with Electron Architecture**: The testing model will now perfectly mirror the application's main/renderer process separation.
- **Formalizes Component Testing**: Provides a robust, automated workflow for testing Storybook stories, complete with a UI for development and a CLI command (`vitest --project storybook`) for CI.
- **Improves Maintainability**: The new `tsconfig` hierarchy and the consolidated `vitest.config.ts` make the build and test system much easier to understand, maintain, and extend. Path aliases are managed in one place, and test environments are explicitly defined.
- **Leverages Modern Tooling**: Fully utilizes the advanced features of Vitest (`projects`) and Storybook (`@storybook/addon-vitest`) for a best-in-class developer experience.
