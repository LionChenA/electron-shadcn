# Design: Unified Testing Strategy and Storybook Configuration

This document outlines the design for a unified testing strategy and the necessary Storybook configuration changes to support it. The goal is to formalize the project's testing layers, improve the component development experience, and ensure consistency.

## 1. Formalizing the Testing Strategy

Based on the investigation of the archived testing spec (`openspec/changes/archive/.../specs/testing/spec.md`), we will formally adopt and refine a multi-layered testing strategy.

### 1.1. Testing Layers

-   **Layer 1: Unit Tests (`.test.ts`)**
    -   **Tool**: Vitest.
    -   **Scope**: Test individual functions, hooks, or business logic in isolation.
    -   **Environment**: `jsdom` (fast, headless).
    -   **Location**: Co-located with the source files.

-   **Layer 2: Component Tests (`.stories.tsx`)**
    -   **Tool**: Storybook, managed and executed by Vitest with `@storybook/addon-vitest`.
    -   **Scope**: Test components from a user's perspective by executing their `play` function, which simulates user interactions.
    -   **Environment**: A real browser (e.g., Chromium), launched and controlled by Vitest via its browser mode (using Playwright). This ensures tests run in an environment identical to the end-user's.
    -   **Location**: Co-located with the component files using the `.stories.tsx` infix.

-   **Layer 3: Integration Tests (`test/integration/*.spec.ts`)**
    -   **Tool**: Vitest.
    -   **Scope**: Test flows involving multiple components, services, or IPC communication mocks.
    -   **Environment**: `jsdom`.

-   **Layer 4: End-to-End (E2E) Tests (`test/e2e/*.spec.ts`)**
    -   **Tool**: Playwright.
    -   **Scope**: Test the final, packaged Electron application, simulating real user workflows across the entire stack.
    -   **Environment**: Real Electron application.

### 1.2. Rationale

This layered approach ensures that we have the right tool for each job, balancing testing speed with fidelity. By having Vitest *manage* the execution of Storybook-based component tests, we gain a unified test runner and command (`npm run test:component`) for this crucial layer, while still benefiting from Storybook's visual environment for development and debugging.

## 2. Storybook and Vitest Configuration Rationale

### 2.1. Storybook Path Aliases

-   **Problem**: Storybook's default Vite process cannot resolve TypeScript path aliases (e.g., `@/components`), creating a disconnect from the main application.
-   **Solution**: We will modify `.storybook/main.ts`'s `viteFinal` function to dynamically import and merge the configuration from `vite.renderer.config.mts`. This guarantees that Storybook inherits the exact same plugins and setup.

### 2.2. Vitest-Managed Component Tests

-   **Problem**: We need a way to programmatically run all component interaction tests (`play` functions) in a consistent, browser-based environment.
-   **Solution**: We will modify `vitest.config.ts` to use Vitest's `projects` feature. A new project named `storybook` will be created specifically for component testing. This project will use `@storybook/addon-vitest/vitest-plugin` to find and execute stories. It will be configured to run in `browser` mode, using `playwright` as the provider. This allows us to run `vitest --project=storybook` to test all our components' interactions headlessly in a real browser.

## 3. TypeScript Configuration Rationale

-   **Problem**: A significant challenge arises from the project's structure, where the Electron `main` process code (Node.js environment) and `renderer` process code (DOM environment) coexist. A single `tsconfig.json` for all tests (`tsconfig.vitest.json`) attempts to merge these incompatible environments. This leads to severe type-checking conflicts, as TypeScript cannot simultaneously validate code for both Node.js APIs (like `fs`, `path`) and DOM APIs (like `window`, `document`). Including `vitest/jsdom` and `vitest/browser` types at the same time is a direct contradiction. This is a critical architectural flaw in the initial testing setup.

-   **Solution**: To resolve this, we will completely eliminate the monolithic `tsconfig.vitest.json`. Instead, we will adopt a strategy that mirrors the application's own build-time environment separation:
    1.  **Create Environment-Specific `tsconfig` files**: We will introduce `tsconfig.vitest-renderer.json` and `tsconfig.vitest-main.json`.
        -   The `renderer` config will be used for all tests running in a DOM-like environment (`jsdom` or `browser`), including unit, integration, and Storybook component tests. It will include DOM and testing-library types.
        -   The `main` config will extend the application's `src/main/tsconfig.json` and be used exclusively for tests of the main process code, ensuring a pure Node.js environment.
    2.  **Align Vitest Projects with `tsconfig`s**: The `vitest.config.ts` will be refactored to use `projects`. Each project (e.g., `renderer`, `main`, `storybook`) will point to its corresponding `tsconfig` file via the `typecheck.tsconfig` option.

This approach guarantees that code is type-checked in an environment identical to its execution context, eliminating type collisions and ensuring the robustness of our test suite.