## ADDED Requirements
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