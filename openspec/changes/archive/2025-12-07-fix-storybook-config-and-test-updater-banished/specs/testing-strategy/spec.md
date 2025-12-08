## ADDED Requirements
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

#### Scenario: Layer 3 - Integration Tests
-   **GIVEN** a developer needs to test a feature involving multiple components
-   **WHEN** they create a `.spec.ts` file in `test/integration/`
-   **THEN** the test runs in a `jsdom` environment via `npm run test:integration`.

#### Scenario: Layer 4 - End-to-End Tests
-   **GIVEN** a QA engineer or developer needs to test a full user workflow
-   **WHEN** they create a `.spec.ts` file in `test/e2e/`
-   **THEN** the test runs against the packaged Electron application via `npm run test:e2e`.