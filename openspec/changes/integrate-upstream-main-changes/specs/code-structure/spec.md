## ADDED Requirements

### Requirement: Adhere to standardized file naming conventions

Project files must be renamed to follow the new, consistent pattern introduced in the `upstream/main` branch.

#### Scenario: Verify file names post-refactoring
- **Given** the code structure refactoring commits have been applied.
- **When** a developer inspects the files within `src/renderer/components/` and `src/main/ipc/`.
- **Then** the files are named according to the new convention (e.g., `feature.action.ts`, `Component.tsx`).

### Requirement: Refactor component organization
Template components should be properly integrated into their respective page components.

#### Scenario: Review component structure
- **Given** the application is running.
- **When** a developer inspects the "Index" and "Second" pages.
- **Then** the components displayed on those pages are composed as intended by the refactoring, and are not just placeholders.
