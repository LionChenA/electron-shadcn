## MODIFIED Requirements

### Requirement: The project's module dependency graph MUST be acyclic

The TypeScript project references (`main`, `preload`, `renderer`, `shared`) MUST NOT form a circular dependency graph. The dependency flow MUST be unidirectional (e.g., `main` -> `shared`, `renderer` -> `shared`, but not `shared` -> `main`).

#### Scenario: Verify acyclic dependencies
- **Given** the project code has been checked out.
- **When** a developer runs `pnpm tsc -b --force`.
- **Then** the command MUST NOT produce any `TS6202` circular dependency errors.
