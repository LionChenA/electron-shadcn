# Spec: Testing Strategy

This spec defines the project's layered testing strategy and the tools used to implement it.

## ADDED Requirements

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
