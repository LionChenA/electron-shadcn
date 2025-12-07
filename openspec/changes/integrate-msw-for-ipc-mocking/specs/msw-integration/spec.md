# Spec: MSW Integration

This spec defines the architecture and usage of Mock Service Worker (MSW) as the unified, contract-based API/IPC mocking solution across the project. It covers the setup, integration with various testing tools, and guidelines for generating and utilizing mock handlers.

## ADDED Requirements

### Requirement: Unified Mocking Infrastructure

The project MUST establish a unified mocking infrastructure based on MSW that can be used consistently across Vitest and Storybook.

#### Scenario: Mocking an oRPC Procedure
  - **Given** an oRPC procedure `app.checkForUpdates` needs to be mocked.
  - **When** an MSW handler is defined for this procedure.
  - **Then** the handler MUST be able to intercept the request and return a mocked response.

### Requirement: Explicit Zod Schemas for oRPC Handlers

All oRPC handlers MUST define explicit Zod schemas for their inputs and outputs using the `.input()` and `.output()` methods.

#### Scenario: Generating a Complete OpenAPI Specification
  - **Given** an oRPC handler is defined without an explicit `.output()` schema.
  - **When** the `openapi:generate` script is run.
  - **Then** the resulting `openapi.json` will lack detailed response information.
  - **And** when a handler has explicit schemas.
  - **Then** the `openapi.json` MUST contain detailed, typed information for that handler's inputs and responses, enabling high-fidelity mock generation.

### Requirement: Holistic TypeScript Project Validation

The project's primary type-checking command (`pnpm tsc -b`) MUST validate the application source code (`src`), all test files (`test`), and all scripts (`scripts`), including auto-generated mock files.

#### Scenario: Running the Main Type-Check Command
  - **Given** the project has a partitioned `tsconfig.json` structure with references.
  - **And** the `test/tsconfig.json` is configured for `noEmit` and to allow TS extensions.
  - **When** `pnpm tsc -b` is executed from the root.
  - **Then** `tsc` MUST successfully type-check all source and test files without errors.

### Requirement: Automated Handler Generation via Kubb

MSW handlers for oRPC procedures MUST be automatically generated from an OpenAPI schema using Kubb.

#### Scenario: Generating Handlers
  - **Given** a detailed `openapi.json` file is available.
  - **When** Kubb is executed with the appropriate plugins (`@kubb/plugin-msw`).
  - **Then** type-safe MSW handlers MUST be generated to `test/mocks/gen/` for all defined oRPC procedures.

### Requirement: oRPC Client HTTP Link in Test Environment

The oRPC client MUST use a standard HTTP link instead of the `MessagePort` link when running in a test environment.

#### Scenario: Running a Component Test
  - **Given** a component (`Updater.tsx`) makes an oRPC call in a test environment.
  - **When** the test is executed.
  - **Then** the oRPC call MUST be routed over HTTP to `http://localhost`, allowing MSW to intercept it.

### Requirement: MSW Integration with Vitest

MSW MUST be configured to intercept requests in Vitest test runs.

#### Scenario: Running a Vitest Test
  - **Given** a Vitest test runs a component that makes an oRPC call.
  - **When** the MSW server is properly set up in `test/mocks/server.ts` and integrated via `test/vitest.setup.ts`.
  - **Then** the oRPC call MUST be intercepted by the MSW handler.

### Requirement: MSW Integration with Storybook

Storybook MUST be configured to allow declarative definition of MSW handlers on a per-story basis.

#### Scenario: Viewing an Updater Story
  - **Given** an `Updater` component story is viewed in Storybook.
  - **When** the story defines a specific MSW handler for `app.checkForUpdates` via `parameters.msw.handlers`.
  - **Then** the component MUST render according to the mock response provided by that handler.

### Requirement: Consuming Generated Mocks

The generated mock directory (`test/mocks/gen`) MUST be treated as a black box, and all consumption of generated code MUST be done via the top-level barrel file.

#### Scenario: Importing a MSW Handler in a Test
  - **Given** a developer needs to use `appCheckForUpdatesHandler` in a test file.
  - **When** they write the import statement.
  - **Then** the import path MUST be from the top-level barrel file (e.g., `import { appCheckForUpdatesHandler } from '@/test/mocks/gen';`).
  - **And** they MUST NOT use deep, relative paths into the `gen` directory.

### Requirement: Adding New Mockable Procedures

Developers adding new oRPC procedures MUST follow a set of conventions to ensure compatibility with the automated mocking pipeline.

#### Scenario: Developer Adds a New Procedure
  - **Given** a developer is adding a new procedure `user.create`.
  - **When** they define the handler in `src/main/ipc/user/handlers.ts`.
  - **Then** they MUST define explicit, named Zod object schemas for any input body to avoid "anonymous schema" issues.
  - **And** they MUST ensure the new `user` sub-router is tagged in the root `router.ts` using `os.tag('user').router(user)`.
  - **And** after running `pnpm openapi:generate` and `pnpm mocks:generate`, the new handlers MUST be available for import from `@/test/mocks/gen`.
