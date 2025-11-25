# testing Specification

## Purpose
TBD - created by archiving change refactor-test-architecture. Update Purpose after archive.
## Requirements
### Requirement: Centralized Test Directory
The `src/tests/` directory SHALL be removed as test files are now organized by their scope and location.

**Reason**: Centralized testing creates barriers between code and tests, reducing developer productivity and code discoverability.

**Migration**: All existing tests in `src/tests/unit/` and `src/tests/e2e/` are migrated to new locations per the modified organization requirements.

#### Scenario: Old unit test location removed
- **GIVEN** old test location `src/tests/unit/ToggleTheme.test.tsx`
- **WHEN** developers navigate to the file
- **THEN** file no longer exists at that location (moved to `src/renderer/components/ui/ToggleTheme.test.tsx`)

#### Scenario: Old e2e test location removed
- **GIVEN** old test location `src/tests/e2e/`
- **WHEN** developers navigate to the directory
- **THEN** directory no longer exists (moved to `test/e2e/`)

