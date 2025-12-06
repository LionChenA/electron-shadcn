# Spec: MSW Integration

This spec defines the architecture and usage of Mock Service Worker (MSW) as the unified, contract-based API/IPC mocking solution across the project. It covers the setup, integration with various testing tools, and guidelines for generating and utilizing mock handlers.

## ADDED Requirements

### Requirement: Unified Mocking Infrastructure

The project MUST establish a unified mocking infrastructure based on MSW that can be used consistently across Vitest, Storybook, and Playwright.

#### Scenario: Mocking an oRPC Procedure
  - **Given** an oRPC procedure `app.checkForUpdates` needs to be mocked.
  - **When** an MSW handler is defined for this procedure.
  - **Then** the handler MUST be able to intercept the request and return a mocked response.

### Requirement: Automated Handler Generation via Kubb

MSW handlers for oRPC procedures MUST be automatically generated from an OpenAPI schema using Kubb.

#### Scenario: Generating Handlers
  - **Given** an `openapi.json` file is available.
  - **When** Kubb is executed with the appropriate plugins (`@kubb/swagger-msw`).
  - **Then** type-safe MSW handlers MUST be generated to `test/mocks/gen/handlers.ts` for all defined oRPC procedures.

### Requirement: oRPC Client HTTP Link in Test Environment

The oRPC client MUST use a standard HTTP link instead of the `MessagePort` link when running in a test environment.

#### Scenario: Running a Component Test
  - **Given** a component (`Updater.tsx`) makes an oRPC call in a test environment.
  - **When** the test is executed.
  - **Then** the oRPC call MUST be routed over HTTP to `http://localhost`, allowing MSW to intercept it.

### Requirement: MSW Integration with Vitest

MSW MUST be configured to intercept requests in Vitest test runs, for both Node.js (main process) and browser (renderer process) environments.

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

### Requirement: MSW Integration with Playwright

MSW MUST be configurable to intercept requests during Playwright E2E test runs.

#### Scenario: Running an E2E Test
  - **Given** an E2E test runs the full Electron application.
  - **When** MSW handlers are configured for Playwright.
  - **Then** the application's API calls MUST be intercepted and mocked by MSW.
