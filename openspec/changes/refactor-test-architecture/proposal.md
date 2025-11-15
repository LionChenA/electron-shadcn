# Change: Refactor Test Architecture

## Why

The current test architecture has several issues:
1. **Configuration Conflict**: Vitest and Playwright both require different TypeScript configurations, leading to potential conflicts
2. **Poor Test Organization**: Tests are集中管理在 `src/tests/` 目录中，而不是与源码相邻，降低了开发体验
3. **Missing Base Configuration**: No shared TypeScript base configuration for deriving environment-specific configs

Current structure forces developers to:
- Navigate away from source files to find tests
- Manage complex overlapping configurations between Vitest and Playwright
- Maintain duplicate TypeScript configuration settings

## What Changes

### Test File Reorganization
- **Unit/Component Tests**: Move to be co-located with source files (`.test.tsx` alongside `.tsx`)
  - `src/renderer/components/ui/Button.test.tsx` ← currently in `src/tests/unit/`
  - `src/shared/utils/sum.test.ts` ← currently in `src/tests/unit/`

- **Integration/E2E Tests**: Move to `test/` directory at repository root
  - `test/e2e/` ← currently in `src/tests/e2e/`
  - `test/integration/` ← new directory for Vitest integration tests

### TypeScript Configuration Overhaul
- Create `tsconfig.base.json` as single source of truth
- Derive environment-specific configs:
  - `tsconfig.json` (main src config)
  - `tsconfig.vitest.json` (Vitest environment)
  - `tsconfig.playwright.json` (Playwright environment)

### Config Tool Separation
- **Vitest**: Configure for unit, component, and integration tests with JSDOM + Playwright browser
- **Playwright**: Configure for E2E tests with proper Electron app testing
- **Storybook**: Maintain current setup with Vitest integration

## Impact

### Affected Areas
- **Testing**: Entire test system structure and configuration
- **Build System**: TypeScript compilation paths and test execution
- **CI/CD**: Test execution commands and environment setup

### Breaking Changes
- **YES** - Test file locations will change (requires test file migration)
- **YES** - TypeScript config structure changes (requires build system updates)

### Migration Required
1. Migrate existing test files from `src/tests/unit/` to co-located positions
2. Migrate `src/tests/e2e/` to `test/e2e/`
3. Update build configurations and package.json scripts
4. Update CI/CD test execution commands

## Benefits
- Improved developer experience with co-located tests
- Clear separation of concerns between test types
- Reduced configuration conflicts
- Better scalability for larger test suites
