# testing-strategy Specification

## Purpose
Formalize a multi-layered testing strategy (Unit, Component, Integration, E2E) using Vitest projects and MSW to ensure code quality and provide clear developer guidance.
## Requirements
### Requirement: Multi-Project Test Environment

Vitest MUST be configured to use a project-based architecture to test different application environments in isolation.

#### Scenario: Running Main Process Unit Tests
  - **Given** a unit test exists for an IPC handler in `src/main/ipc/`.
  - **When** the developer runs `pnpm test:main`.
  - **Then** the test MUST be executed by the **`main`** project within Vitest, using a **`node`** environment.

#### Scenario: Running Renderer Component Unit Tests
  - **Given** a unit test exists for a React component in `src/renderer/components/`.
  - **When** the developer runs `pnpm test:renderer`.
  - **Then** the test MUST be executed by the **`renderer`** project within Vitest, using a **`jsdom`** environment.

#### Scenario: Running Storybook Interaction Tests
  - **Given** an interaction test is defined in a story file at `src/renderer/components/MyComponent.stories.tsx`.
  - **When** the developer runs `pnpm test:component`.
  - **Then** the test MUST be executed by the **`storybook`** project within Vitest, using a **`browser`** environment powered by Playwright.

### Requirement: Explicit Plugin Configuration per Project

Each Vitest project (`main`, `renderer`, `storybook`) MUST explicitly define the Vite plugins it requires.

#### Scenario: Ensuring Path Alias Resolution in Tests
  - **Given** the `renderer` project needs to resolve path aliases like `@/components`.
  - **When** the `vitest.config.ts` is configured.
  - **Then** the `defineProject` configuration for the `renderer` project MUST include `tsconfigPaths()` in its `plugins` array.

### Requirement: Standardized Test Scripts

The `package.json` file MUST contain a standardized set of scripts for running tests.

#### Scenario: Running a Specific Test Suite
  - **Given** a developer wants to run only the main process tests.
  - **When** they execute `pnpm test:main`.
  - **Then** only the tests belonging to the `main` Vitest project MUST be executed.

#### Scenario: Running All Vitest Tests
  - **Given** a developer wants to run all fast, runner-based tests.
  - **When** they execute `pnpm test`.
  - **Then** the `main`, `renderer`, and `storybook` projects MUST be executed.

#### Scenario: Running All Tests Including E2E
  - **Given** a developer wants to run the entire test suite for CI.
  - **When** they execute `pnpm test:all`.
  - **Then** all Vitest projects AND the Playwright E2E tests MUST be executed.

### Requirement: Centralized API/IPC Mocking

All API and IPC mocking for unit and integration tests MUST be handled by Mock Service Worker (MSW).

#### Scenario: Mocking a Backend API Call
  - **Given** a component or handler makes a call to a backend API or IPC procedure.
  - **When** the code is executed in a test environment (Vitest or Storybook).
  - **Then** MSW MUST intercept the request and return a mocked response.
  - **Reference:** `msw-integration/spec.md` for detailed setup and usage.

### Requirement: Testing Strategy Formalization
The project SHALL adopt a formal, multi-layered testing strategy to ensure code quality, maintainability, and developer confidence. This strategy defines the scope, tools, and location for different types of tests.

*   **Reason**: To activate and formalize the excellent but currently archived testing strategy, providing clear guidance for all developers.

#### Scenario: Strategy is centrally documented
-   **GIVEN** a developer wants to understand how to write a test
-   **WHEN** they look for the project's testing specification
-   **THEN** they find a single, authoritative `testing/spec.md` in the main `openspec/specs` directory.

---

### Requirement: Test Layers
The testing strategy SHALL be divided into four distinct layers.

#### Scenario: Layer 1 - Unit Tests
-   **GIVEN** a developer needs to test a pure function or hook
-   **WHEN** they create a `.test.ts` file next to the source file
-   **THEN** the test runs in a `jsdom` environment via `npm run test:unit`.

#### Scenario: Layer 2 - Component Tests
-   **GIVEN** a developer has written an interaction test in a component's `.stories.tsx` file using the `play` function
-   **WHEN** they run `npm run test:component`
-   **THEN** Vitest SHALL execute the story's `play` function as a test within a real browser environment (e.g., Chromium).

#### Scenario: Component State and Interaction Testing
-   **GIVEN** a component like `Updater.tsx` has multiple visual states (e.g., idle, update-available, downloading).
-   **WHEN** separate stories are created for each state in `Updater.stories.tsx`.
-   **AND** interaction tests are written using the `play` function to simulate user actions (e.g., clicking a "download" button).
-   **THEN** `pnpm test:component` SHALL verify the behavior and rendering of each state, ensuring comprehensive component coverage.

#### Scenario: Layer 3 - Integration Tests
-   **GIVEN** a developer needs to test a feature involving multiple components
-   **WHEN** they create a `.spec.ts` file in `test/integration/`
-   **THEN** the test runs in a `jsdom` environment via `npm run test:integration`.

#### Scenario: Layer 4 - End-to-End Tests
-   **GIVEN** a QA engineer or developer needs to test a full user workflow
-   **WHEN** they create a `.spec.ts` file in `test/e2e/`
-   **THEN** the test runs against the packaged Electron application via `npm run test:e2e`.

