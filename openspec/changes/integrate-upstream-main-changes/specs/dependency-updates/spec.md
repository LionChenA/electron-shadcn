## ADDED Requirements

### Requirement: Update project dependencies to specified versions

All runtime and development dependencies must be updated to match the versions specified in the `changes.txt` file, which were sourced from the `upstream/main` branch.

#### Scenario: Verify dependency versions after installation
- **Given** the dependency update commits have been applied to `package.json`.
- **When** the user runs `pnpm install`.
- **Then** the resulting `pnpm-lock.yaml` reflects the newly specified versions.
- **And** the application successfully builds and launches without any dependency-related errors.
