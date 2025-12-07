# Tasks: Integrate OpenAPI-Based MSW Infrastructure

This is the final, ordered list of tasks to implement the new unified mocking infrastructure. It reflects the successful implementation path discovered through our iterative process.

### Phase 1: Prerequisite Configuration

*   [x] **1. Configure TypeScript for Holistic Checking**:
    *   Update the root `tsconfig.json` to add project references to `./tsconfig.vitest.json` and `./tsconfig.playwright.json`.
    *   Update `tsconfig.vitest.json` to add the compiler options `"noEmit": true` and `"allowImportingTsExtensions": true`.
    *   Update `src/renderer/tsconfig.json` to add `"**/*.stories.tsx"` and `"**/*.test.tsx"` to its `exclude` array.
    *   *Validation*: `pnpm tsc -b` runs and is ready to report errors from the entire project.

*   [x] **2. Enforce Explicit & Named Zod Schemas**:
    *   Audit all oRPC handlers in `src/main/ipc/**/handlers.ts`.
    *   Add explicit `.output()` Zod schemas to every handler.
    *   For handlers requiring an input body, ensure the schema is a named `z.object({})` to avoid "anonymous inline schema" issues.
    *   Update client-side calls to match the new named object schemas.
    *   For streaming handlers, ensure the output schema is wrapped with `eventIterator()`.
    *   *Validation*: The codebase is internally consistent and type-safe before code generation.

*   [x] **3. Implement Automatic oRPC Tagging**:
    *   In `src/main/ipc/router.ts`, use the `os.tag('tagName').router(subRouter)` pattern to automatically tag all procedures based on their namespace.
    *   Remove any manual `.route({ tags: [...] })` from individual handlers.
    *   *Validation*: The oRPC router is configured for optimal OpenAPI generation.

### Phase 2: Generation Pipeline

*   [x] **4. Install All Dependencies**:
    *   Install `msw`, `msw-storybook-addon`, all `@kubb/*` plugins, `@orpc/openapi`, `@orpc/zod`, and `@faker-js/faker`.
    *   *Validation*: All dependencies are present in `package.json`.

*   [x] **5. Create OpenAPI Generation Script**:
    *   Create `scripts/generate-openapi.ts` using `OpenAPIGenerator` and `ZodToJsonSchemaConverter`.
    *   Wrap the generation logic in an `async` IIFE to handle top-level await.
    *   Add the `"openapi:generate": "tsx scripts/generate-openapi.ts"` script to `package.json`.
    *   *Validation*: Running `pnpm openapi:generate` successfully creates `test/mocks/openapi.json` with `tags` on each operation.

*   [x] **6. Configure Kubb**:
    *   Create `kubb.config.ts` using the simplest recommended configuration.
    *   **Crucially, set `output.extension: { '.ts': '' }`** to generate specifier-bare import paths.
    *   Do not use complex `group` or `barrelType` overrides. Trust the default "ugly but robust" file generation.
    *   Add a `"mocks:generate": "kubb generate"` script to `package.json`.
    *   Add a `hooks.done` script to run Biome on the generated files.
    *   *Validation*: Running `pnpm mocks:generate` successfully creates the full tree of mock files in `test/mocks/gen`.

### Phase 3: Integration & Implementation

*   [x] **7. Configure Vitest with MSW**:
    *   Create `test/mocks/server.ts` to configure `setupServer` from `msw/node`.
    *   Update `test/vitest.setup.ts` to manage the server lifecycle.

*   [x] **8. Configure Storybook with MSW**:
    *   Update `.storybook/preview.ts` to configure the `mswLoader`.

*   [x] **9. Implement Conditional oRPC Link**:
    *   Refactor `src/renderer/ipc/manager.ts` to use `RPCLink as HTTPRPCLink` from `@orpc/client/fetch` in the test environment.

*   [x] **10. Implement Storybook Example**:
    *   Create `src/renderer/components/Updater.stories.tsx`.
    *   Import handlers from the top-level barrel file (`../../../test/mocks/gen/msw`).
    *   Use `HttpResponse.json()` to create valid mock responses.
    *   *Validation*: `pnpm tsc -b` completes with no errors, and stories render correctly.

### Phase 4: Documentation

*   [x] **11. Update OpenSpec Documents**:
    *   Update `design.md`, `proposal.md`, and `specs/msw-integration/spec.md` to reflect the final, successful architecture.
    *   Update `testing-strategy` and `orpc-based-ipc` specs to reference the new MSW strategy.

### Cancelled Tasks

*   **[CANCELLED] Playwright Integration**: E2E tests will run against the real, un-mocked application to provide maximum confidence. MSW will not be used.
