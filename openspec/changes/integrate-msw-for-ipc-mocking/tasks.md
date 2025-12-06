# Tasks: Integrate OpenAPI-Based MSW Infrastructure

This is an ordered list of tasks to implement the new unified mocking infrastructure based on MSW and Kubb.

### Phase 1: Configuration & Schemas

*   [x] **1. Configure TypeScript for Holistic Checking**:
    *   Update the root `tsconfig.json` to add project references to `./tsconfig.vitest.json` and `./tsconfig.playwright.json`.
    *   Update `tsconfig.vitest.json` to add the `"noEmit": true` and `"allowImportingTsExtensions": true` compiler options.
    *   *Validation*: Run `pnpm tsc -b` and confirm it attempts to type-check the `test` directory.

*   [x] **2. Install Core Dependencies**:
    *   Install `msw` and `msw-storybook-addon`.
    *   Install Kubb and its plugins: `@kubb/core`, `@kubb/cli`, `@kubb/plugin-oas`, `@kubb/plugin-ts`, `@kubb/plugin-zod`, `@kubb/plugin-msw`, and `@kubb/plugin-faker`.
    *   Install the peer dependency for the faker plugin: `@faker-js/faker`.
    *   *Validation*: All dependencies are present in `package.json`.

*   [x] **3. Enforce Explicit Zod Schemas**:
    *   Audit all oRPC handlers in `src/main/ipc/**/handlers.ts`.
    *   Add explicit `.input()` and/or `.output()` Zod schemas to every handler to ensure a complete OpenAPI specification.
    *   For streaming handlers, ensure the output schema is wrapped with the `eventIterator()` helper.
    *   *Validation*: The OpenAPI generation step produces a detailed schema.

### Phase 2: Code Generation

*   [x] **4. Create OpenAPI Generation Script**:
    *   Create a script (`scripts/generate-openapi.ts`) that imports the oRPC `AppRouter` and uses `@orpc/openapi` to export a `test/mocks/openapi.json` schema file.
    *   Add a corresponding npm script to `package.json`: `"openapi:generate": "tsx scripts/generate-openapi.ts"`.
    *   *Validation*: Run the script and confirm `test/mocks/openapi.json` is created successfully.

*   [x] **5. Configure Kubb**:
    *   Create a `kubb.config.ts` file in the project root.
    *   Configure the input to point to the generated `test/mocks/openapi.json`.
    *   Configure the output to generate files to `test/mocks/gen/`.
    *   Configure `plugin-ts`, `plugin-zod`, `plugin-faker`, and `plugin-msw` to output to their respective subdirectories (`types`, `zod`, `faker`, `msw`).
    *   **Crucially, add `extension: { '.ts': '' }` to the top-level Kubb output configuration.**
    *   Add a corresponding npm script: `"mocks:generate": "kubb generate"`.
    *   *Validation*: Run `openapi:generate` then `mocks:generate` and confirm typed files are generated in `test/mocks/gen`, with import paths *not* containing `.ts` extensions.

### Phase 3: Toolchain Integration (Vitest & Storybook)

*   [x] **6. Configure Vitest with MSW**:
    *   Create `test/mocks/server.ts` to configure `setupServer` from `msw/node`.
    *   Update `test/vitest.setup.ts` to import the server and manage its lifecycle (`listen`, `resetHandlers`, `close`).
    *   *Validation*: Run a basic Vitest test that uses a generated handler and confirm it intercepts requests.

*   [x] **7. Configure Storybook with MSW**:
    *   Update `.storybook/preview.ts` to configure the `mswLoader`.
    *   *Validation*: Create a simple story with a `parameters.msw.handlers` entry and verify it works in the Storybook UI.

### Phase 4: Implementation & Documentation

*   [x] **8. Implement Conditional oRPC Link**:
    *   Refactor `src/renderer/ipc/manager.ts` to check for `process.env.NODE_ENV === 'test'`.
    *   When true, instantiate the oRPC client with an `HTTPLink` pointed at `http://localhost`.
    *   When false, use the existing `RPCLink` for Electron IPC.

*   [x] **9. Create and Implement `Updater.stories.tsx`**:
    *   Create `src/renderer/components/Updater.stories.tsx`.
    *   Implement a basic story for the `Updater` component.
    *   Remove all `vi.mock` and manual mock implementations from the file (if any are implicitly present from previous plans).
    *   Rewrite all stories to use the auto-generated Kubb handlers, imported and passed to `parameters.msw.handlers`.
    *   *Validation*: All `Updater` stories render correctly and interaction tests work.

*   [x] **10. Update Dependent OpenSpec Documents**:
    *   Modify the `testing-strategy` spec to reference the new `msw-integration` spec.
    *   Modify the `orpc-based-ipc` spec to mention the OpenAPI generation capability.
    *   *Validation*: The specs are consistent and cross-referenced.

### Cancelled Tasks

*   **[CANCELLED] Research Playwright Integration**: This was deemed out of scope. E2E tests will run against the real, un-mocked application to provide maximum confidence.
*   **[CANCELLED] Implement Playwright Integration**: Cancelled for the reason above.
