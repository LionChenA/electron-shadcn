# Design: Unified Mocking with oRPC, OpenAPI, Kubb, and MSW

This document outlines the design for a unified, type-safe, and automated API/IPC mocking infrastructure. The core principle is to leverage oRPC's native OpenAPI support to create a standardized testing environment that is compatible with MSW (Mock Service Worker).

## 1. Core Architecture: From IPC to HTTP

The primary challenge in testing our frontend components is their dependence on the Electron IPC communication channel, which is not natively understood by standard testing tools.

This design overcomes this by re-configuring the oRPC client's transport layer based on the environment:

*   **In Production**: The `oRPC` client will continue to use `@orpc/client/message-port`'s `RPCLink` to communicate over the highly efficient Electron IPC channel.
*   **In Test (`NODE_ENV === 'test'`)**: The `oRPC` client will be configured to use a standard `HTTPLink`. All oRPC procedure calls will be automatically translated into standard `POST` requests to a predictable URL structure (e.g., `http://localhost/rpc/app.checkForUpdates`).

This simple, conditional switch is the lynchpin of the entire strategy. It makes our application's communication layer understandable to MSW without changing any component-level code.

## 2. Automated Mock Generation: The Kubb Pipeline

Instead of manually writing MSW handlers, we will automate their creation to ensure they are always type-safe and in sync with our API contract. We will leverage the following Kubb plugins:

*   **`@kubb/core`** and **`@kubb/cli`**: The main engine and CLI for Kubb.
*   **`@kubb/plugin-oas`**: The core plugin for reading and parsing OpenAPI specifications.
*   **`@kubb/plugin-ts`**: Generates TypeScript types.
*   **`@kubb/plugin-zod`**: Generates Zod schemas.
*   **`@kubb/plugin-msw`**: Generates MSW request handlers.
*   **`@kubb/plugin-faker`**: Generates fake data factories.

This will be achieved through the following pipeline:

1.  **Schema Export**: An npm script (`pnpm openapi:generate`) will execute a script that imports our main `AppRouter`, adds `tags` automatically, and uses `@orpc/openapi` to generate a `test/mocks/openapi.json` file.

2.  **Code Generation with Kubb**:
    *   A `kubb.config.ts` file will be configured to use the simplest possible settings, trusting Kubb's default file generation strategy.
    *   Kubb will read `openapi.json` and generate a tree of files in `test/mocks/gen`.

    > [!NOTE]
    > The generated `test/mocks/gen` directory should be treated as a **black box**. We will not try to "optimize" its structure. All imports from the generated code should be made from the top-level barrel file (`test/mocks/gen/index.ts`) to ensure robust path resolution.

    > [!IMPORTANT]
    > A critical prerequisite for this pipeline is that all oRPC handlers must have explicit and **named** Zod schemas (i.e., `z.object({})`, not raw enums) for their inputs. This prevents "anonymous inline schema" issues that cause naming conflicts between Kubb plugins.

## 3. TypeScript Configuration Strategy

A key challenge is ensuring that our TypeScript compiler (`tsc -b`) can holistically validate all source code without conflicts. We leverage TypeScript's project references and separate `tsconfig` files to achieve this:

1.  **`src/renderer/tsconfig.json`**: This project's configuration will be modified to **exclude** story files (e.g., `"exclude": ["**/*.stories.tsx"]`). This prevents it from trying to process files that import from outside its `rootDir`, resolving a critical conflict.

2.  **`tsconfig.vitest.json`**: This project, which now uniquely "claims" the story files, will be configured to handle the special requirements of the generated code:
    *   `"noEmit": true`: Tells `tsc` to only perform a type check, not generate JavaScript.
    *   `"allowImportingTsExtensions": true`: Safely allows `tsc` to resolve the imports inside Kubb's generated code.

3.  **Root `tsconfig.json`**: The root `tsconfig.json` will be updated to include `references` to `tsconfig.vitest.json` and `tsconfig.playwright.json`, creating a single entry point for full-project type validation via `pnpm tsc -b`.

This holistic strategy ensures that `pnpm tsc -b` can run across the entire project, with each part being type-checked according to its specific needs.

## 4. Toolchain Integration

The single set of auto-generated handlers will be consumed by our primary testing tools, providing a single source of truth for mocking.

*   **Vitest**:
    *   A central `test/mocks/server.ts` file will use `setupServer` from `msw/node` to create a Node.js-compatible mock server.
    *   A global `test/vitest.setup.ts` file will import this server and manage its lifecycle (`listen`, `resetHandlers`, `close`), making API mocking automatically available in all Vitest test files.

*   **Storybook**:
    *   The `msw-storybook-addon` will be installed.
    *   The `.storybook/preview.ts` file will be configured with the `mswLoader`.
    *   Individual stories will use the `parameters.msw.handlers` property to declaratively specify which auto-generated Kubb handlers are needed for that specific story.

## 5. A Note on End-to-End Testing

After initial analysis, we have made a strategic decision **not** to integrate MSW with our Playwright End-to-End (E2E) tests.

E2E tests provide the most value when they verify the complete, integrated application with as few mocks as possible. Their purpose is to simulate a real user's experience. Mocking the API layer at this stage would diminish the confidence these tests provide. Instead, component-level and integration tests (via Vitest and Storybook) will be the primary places where we use MSW to test our UI against a wide variety of mocked API states.

## 6. New OpenSpec: `msw-integration`

A new, dedicated OpenSpec document, `msw-integration/spec.md`, will be created to formally define the architecture, setup, and usage guidelines for MSW within the project. This spec will cover:
*   The overall philosophy of contract-based mocking with MSW.
*   Detailed setup instructions for Vitest and Storybook.
*   Guidelines for using Kubb-generated handlers.
*   Best practices for writing MSW handlers and scenarios.
*   The TypeScript configuration strategy that enables the tooling to work.
