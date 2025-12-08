## ADDED Requirements
### Requirement: Updater Component Testing
The `Updater` component SHALL have comprehensive tests within the Storybook framework to verify its appearance and behavior across different update states.

*   **Reason**: To ensure the critical user-facing update process is reliable and to establish a best-practice pattern for component testing.

#### Scenario: Default State Display
-   **GIVEN** the `Updater` component is rendered with default props
-   **WHEN** the story is viewed in Storybook
-   **THEN** it SHALL display the text "Check for Updates".

#### Scenario: "Update Available" State
-   **GIVEN** the `Updater` component is rendered with an "update available" status
-   **WHEN** the story's `play` function executes
-   **THEN** it SHALL find and assert the presence of a "Download Update" button.

#### Scenario: "Downloading" State
-   **GIVEN** the `Updater` component is rendered with a "downloading" status and a progress percentage
-   **WHEN** the story is viewed
-   **THEN** it SHALL display a progress bar reflecting the given percentage.

#### Scenario: Unit Test Integration
-   **GIVEN** a co-located unit test file `Updater.test.tsx` exists
-   **WHEN** the `Updater` story is viewed in Storybook
-   **THEN** the "Tests" panel SHALL display the results from the `Updater.test.tsx` file.