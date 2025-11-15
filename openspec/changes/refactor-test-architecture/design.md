## Context

The current test architecture suffers from configuration complexity where Vitest and Playwright require different TypeScript settings but share a single tsconfig.json. Additionally, integration and e2e tests are centralized while unit tests and component tests are co-located with source code.

## Goals / Non-Goals

- **Goals:**
  - Simplify TypeScript configuration management
  - Enable co-located test files for better DX
  - Separate integration/E2E tests from unit tests
  - Eliminate Vitest/Playwright config conflicts
  - Maintain backward compatibility with existing test commands

- **Non-Goals:**
  - Change testing frameworks (keep Vitest + Playwright + Storybook)
  - Alter test coverage requirements
  - Modify Electron app architecture

## Decisions

### TypeScript Configuration Strategy
**Decision**: Use base config pattern with environment-specific extensions

```typescript
tsconfig.base.json  →  Shared compiler options, paths, types
    ├── tsconfig.json        →  Main development/build config
    ├── tsconfig.vitest.json →  Vitest + JSDOM + Playwright browser
    └── tsconfig.playwright.json →  Playwright E2E environment
```

**Rationale**: Provides single source of truth while allowing environment-specific customizations. Referenced pattern: https://content.noroff.dev/workflow/vitest-playwright-together.html

### Test File Organization
**Decision**: Three-tier organization

1. **Co-located tests** (`.test.tsx`, `.test.ts`)
   - Unit tests for components, hooks, utilities
   - Component tests with Storybook stories
   - Position: Next to source files

2. **Integration tests** (`.test.ts`)
   - Cross-component interactions
   - API integration tests
   - Position: `test/integration/`

3. **E2E tests** (`.test.ts`)
   - Full application workflows
   - Electron app testing
   - Position: `test/e2e/`

**Rationale**: Follows testing pyramid principle and improves discoverability.

### Configuration Isolation
**Decision**: Separate configs per tool

- **Vitest**: Uses `tsconfig.vitest.json` with jsdom types, test files patterns
- **Playwright**: Uses `tsconfig.playwright.json` with Node types, E2E patterns
- **Storybook**: Uses vitest config with browser provider

**Rationale**: Each tool has different needs (DOM vs Node vs Browser). Isolation prevents conflicts.

## Risks / Trade-offs

- **Risk**: Breaking existing test workflows
  - **Mitigation**: Update all scripts and CI/CD before deploying

- **Risk**: TypeScript path resolution issues
  - **Mitigation**: Carefully configure `baseUrl` and `paths` in each config

- **Risk**: Storybook Vitest integration conflicts with Playwright
  - **Mitigation**: Use Vitest's multi-project feature with proper config separation

## Migration Plan

1. **Phase 1**: Create new tsconfig structure (no code changes)
2. **Phase 2**: Create new test directories without moving files
3. **Phase 3**: Migrate test files to new locations
4. **Phase 4**: Update configurations
5. **Phase 5**: Update scripts and CI/CD
6. **Phase 6**: Validate all tests pass

## Open Questions

- Should we use `.spec.ts` naming convention instead of `.test.ts`?
- Do we need separate test utilities for each environment?
- How to handle test setup files in the new structure?
