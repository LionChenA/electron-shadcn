# Spec: Storybook Configuration

This spec defines the integration of Storybook with the project's testing and development workflow.

## ADDED Requirements

### Requirement: Integrated Component Testing with Vitest

Storybook MUST be integrated with Vitest to enable automated component testing.

- #### Scenario: Running a Story as a Test
  - **Given** the `@storybook/addon-vitest` is installed and configured.
  - **And** the `vitest.config.ts` contains a `storybook` project that uses the `storybookTest` plugin.
  - **When** a developer runs `npm run test:storybook`.
  - **Then** Vitest MUST launch a headless browser, find all `*.stories.tsx` files, and execute their interaction tests (`play` functions) as part of the test suite.
  - **And** the results MUST be reported to the console.

### Requirement: In-App Test Panel

Storybook's UI MUST provide a panel to display the results of Vitest tests.

- #### Scenario: Viewing Test Results in Storybook
  - **Given** the `@storybook/addon-vitest` is configured.
  - **When** a developer runs Storybook and navigates to a component's story.
  - **Then** a "Test" panel MUST be available in the addons section.
  - **And** this panel MUST display the passing or failing status of the Vitest tests associated with that story.
