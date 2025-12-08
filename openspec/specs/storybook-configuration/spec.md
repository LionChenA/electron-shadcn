# storybook-configuration Specification

## Purpose
Configure Storybook for component development and automated testing, integrating it with Vitest for interaction tests and ensuring a consistent Vite build environment.
## Requirements
### Requirement: Integrated Component Testing with Vitest

Storybook MUST be integrated with Vitest to enable automated component testing.

#### Scenario: Running a Story as a Test
  - **Given** the `@storybook/addon-vitest` is installed and configured.
  - **And** the `vitest.config.ts` contains a `storybook` project that uses the `storybookTest` plugin.
  - **When** a developer runs `npm run test:storybook`.
  - **Then** Vitest MUST launch a headless browser, find all `*.stories.tsx` files, and execute their interaction tests (`play` functions) as part of the test suite.
  - **And** the results MUST be reported to the console.

### Requirement: In-App Test Panel

Storybook's UI MUST provide a panel to display the results of Vitest tests.

#### Scenario: Viewing Test Results in Storybook
  - **Given** the `@storybook/addon-vitest` is configured.
  - **When** a developer runs Storybook and navigates to a component's story.
  - **Then** a "Test" panel MUST be available in the addons section.
  - **And** this panel MUST display the passing or failing status of the Vitest tests associated with that story.

### Requirement: Automatic Test Discovery for Stories

The Vitest `storybook` project configuration MUST rely on the `@storybook/addon-vitest` plugin for test discovery.

#### Scenario: Configuring the Storybook Test Project
  - **Given** the `storybook` project is defined in `vitest.config.ts`.
  - **When** configuring the `test` property for this project.
  - **Then** the `include` property MUST NOT be used, as the addon automatically discovers tests based on the `.storybook/main.ts` `stories` field.

### Requirement: Consistent Storybook Vite Configuration
Storybook's Vite configuration SHALL be derived from the main application's renderer configuration to ensure a consistent build environment.

*   **Reason**: To resolve path alias issues and prevent configuration drift between the development server and Storybook.

#### Scenario: Path aliases resolve correctly
-   **GIVEN** the Storybook configuration is reusing the renderer's Vite config
-   **WHEN** a story file imports a component using an alias (e.g., `import { Button } from '@/components/ui/Button'`)
-   **THEN** the import resolves successfully and the component renders in Storybook.

#### Scenario: Tailwind CSS is applied
-   **GIVEN** the Storybook configuration is reusing the renderer's Vite config
-   **WHEN** a component uses Tailwind utility classes
-   **THEN** the styles are correctly applied in the Storybook UI.

