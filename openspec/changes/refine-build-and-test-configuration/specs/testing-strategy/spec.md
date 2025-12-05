# Spec: Testing Strategy

This spec defines the project's layered testing strategy and the tools used to implement it.

## MODIFIED Requirements

### Requirement: Multi-Project Test Environment

Vitest MUST be configured to use a project-based architecture to test different application environments in isolation.

- #### Scenario: Running Main Process Unit Tests
  - **Given** a unit test exists for an IPC handler in `src/main/ipc/`.
  - **When** the developer runs the Vitest test suite.
  - **Then** the test MUST be executed by the **`main`** project within Vitest, using a **`node`** environment.

- #### Scenario: Running Renderer Component Unit Tests
  - **Given** a unit test exists for a React component in `src/renderer/components/`.
  - **When** the developer runs the Vitest test suite.
  - **Then** the test MUST be executed by the **`renderer`** project within Vitest, using a **`jsdom`** environment.

- #### Scenario: Running Storybook Interaction Tests
  - **Given** an interaction test is defined in a story file at `src/renderer/components/MyComponent.stories.tsx`.
  - **When** the developer runs `npm run test:storybook`.
  - **Then** the test MUST be executed by the **`storybook`** project within Vitest, using a **`browser`** environment powered by Playwright.
