# Tasks: Integrate OpenAPI-Based MSW Infrastructure

This is an ordered list of tasks to implement the new unified mocking infrastructure based on MSW and Kubb.

### Phase 1: Core Setup (OpenAPI & Kubb)

*   [ ] **1. Install Dependencies**:
    *   Install `msw` as a core development dependency.
    *   Install Kubb and its required plugins: `@kubb/core`, `@kubb/cli`, `@kubb/swagger`, `@kubb/swagger-ts`, `@kubb/swagger-msw`, `@kubb/swagger-zod`, and `@kubb/swagger-faker`.

*   [ ] **2. Create OpenAPI Generation Script**:
    *   Create a script (`scripts/generate-openapi.mjs`) that imports the oRPC `AppRouter` and uses `@orpc/server` utilities to export an `openapi.json` schema file.
    *   Add a corresponding npm script to `package.json`: `"openapi:generate": "node scripts/generate-openapi.mjs"`.
    *   *Validation*: Run the script and confirm `openapi.json` is created successfully.

*   [ ] **3. Configure Kubb**:
    *   Create a `kubb.config.ts` file in the project root.
    *   Configure the input to point to the generated `openapi.json`.
    *   Configure the output to generate MSW handlers to `test/mocks/gen/handlers.ts`.
    *   Add a corresponding npm script: `"mocks:generate": "kubb generate"`.
    *   *Validation*: Run the script and confirm typed MSW handlers are generated.

### Phase 2: Toolchain Integration

*   [ ] **4. Configure Vitest with MSW**:
    *   Create `test/mocks/server.ts` to configure `setupServer` from `msw/node`.
    *   Update `test/vitest.setup.ts` to import the server and manage its lifecycle (`listen`, `resetHandlers`, `close`).
    *   *Validation*: Run a basic Vitest test that uses a generated handler and confirm it intercepts requests.

*   [ ] **5. Configure Storybook with MSW**:
    *   Install `msw-storybook-addon`.
    *   Update `.storybook/preview.ts` to call `initialize()` and add the `mswLoader`.
    *   *Validation*: Create a simple story with a `parameters.msw.handlers` entry and verify it works in the Storybook UI.

*   [ ] **6. Research Playwright Integration**:
    *   Investigate using `playwright-msw` or Playwright's native network interception (`page.route`).
    *   Choose and document the best approach for reusing the Kubb-generated handlers in E2E tests.

### Phase 3: Implementation & Refactoring

*   [ ] **7. Implement Conditional oRPC Link**:
    *   Refactor `src/renderer/ipc/manager.ts` to check for `process.env.NODE_ENV === 'test'`.
    *   When true, instantiate the oRPC client with an `HTTPLink` pointed at `http://localhost`.
    *   When false, use the existing `RPCLink` for Electron IPC.

*   [ ] **8. Refactor `Updater.stories.tsx`**:
    *   Remove all `vi.mock` and manual mock implementations from the file.
    *   Rewrite all stories to use the auto-generated Kubb handlers, imported and passed to `parameters.msw.handlers`.
    *   Ensure the `play` function for the interaction test works correctly with the new MSW setup.

*   [ ] **9. Validate Full Integration**:
    *   Run `pnpm test` and confirm all Vitest tests pass.
    *   Run `pnpm storybook` and confirm all `Updater` stories render correctly and interaction tests work.
    *   *Validation*: All checks pass, and the new system is fully operational.

### Phase 4: Playwright Integration & Documentation

*   [ ] **9. Implement Playwright Integration**:
    *   Install `playwright-msw`.
    *   Integrate the Kubb-generated handlers into Playwright E2E tests, ensuring they can be used to mock backend responses.
    *   *Validation*: Run E2E tests with MSW mocks and confirm they behave as expected.

*   [ ] **10. Create `msw-integration` Spec**:
    *   Create a new OpenSpec document at `openspec/changes/integrate-msw-for-ipc-mocking/specs/msw-integration/spec.md`.
    *   Formally define the architecture, setup, and usage guidelines for MSW within the project, covering Vitest, Storybook, and Playwright integration, and the use of Kubb-generated handlers.

*   [ ] **11. Update Existing OpenSpec Documents**:
    *   Modify the `testing-strategy` spec to reference the new `msw-integration` spec and state that IPC/API mocking should now be done via MSW.
    *   Modify the `storybook-configuration` spec to reference the new `msw-integration` spec and outline Storybook's integration with MSW.
