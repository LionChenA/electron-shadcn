## ADDED Requirements
### Requirement: Base TypeScript Configuration
The project SHALL provide a single `tsconfig.base.json` file containing shared compiler options, path aliases, and base configuration.

#### Scenario: Base config structure
- **GIVEN** the project root contains `tsconfig.base.json`
- **WHEN** developers reference it in environment-specific configs
- **THEN** shared settings are automatically inherited

#### Scenario: Shared path aliases
- **GIVEN** base config defines `@/components/*` → `src/renderer/components/*`
- **WHEN** any environment (src, vitest, playwright) loads TypeScript
- **THEN** path aliases resolve consistently across all contexts

---

### Requirement: Environment-Specific TypeScript Configurations
The project SHALL provide three distinct TypeScript configurations derived from the base:

1. **tsconfig.json** - Main development/build environment
2. **tsconfig.vitest.json** - Vitest test environment (JSDOM + browser)
3. **tsconfig.playwright.json** - Playwright E2E environment

#### Scenario: Vitest config with JSDOM
- **GIVEN** `tsconfig.vitest.json` extends base
- **WHEN** Vitest runs unit/component tests
- **THEN** TypeScript compiler includes jsdom types and test file patterns

#### Scenario: Playwright config for E2E
- **GIVEN** `tsconfig.playwright.json` extends base
- **WHEN** Playwright runs E2E tests
- **THEN** TypeScript compiler includes Node types and Node module resolution

---

## MODIFIED Requirements
### Requirement: Test File Organization
The testing system SHALL organize test files according to their scope and purpose:

1. **Unit Tests** - Co-located with source files using `.test.ts` extension
2. **Component Tests** - Co-located with component files using `.stories.tsx` extension (Storybook default)
3. **Integration Tests** - Located in `test/integration/` directory using `.spec.ts` extension
4. **E2E Tests** - Located in `test/e2e/` directory using `.e2e.ts` extension

#### Scenario: Co-located unit test
- **GIVEN** a utility file `src/shared/utils/sum.ts`
- **WHEN** developers add a test file `src/shared/utils/sum.test.ts` with test cases
- **THEN** Vitest automatically discovers and runs the test

**Example**:
```typescript
// src/shared/utils/sum.test.ts
import { expect, test } from 'vitest';

function sum(a: number, b: number): number {
  return a + b;
}

test('sum adds two numbers correctly', () => {
  expect(sum(2, 2)).toBe(4);
});
```

#### Scenario: Component test via Storybook
- **GIVEN** a component file `src/renderer/components/ui/Button.tsx`
- **WHEN** developers add a Storybook story `src/renderer/components/ui/Button.stories.tsx`
- **THEN** Storybook Vitest addon automatically discovers and tests the component

**Example**:
```typescript
// src/renderer/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/UI/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
```

#### Scenario: Integration tests
- **GIVEN** integration test files with `.spec.ts` extension in `test/integration/`
- **WHEN** `npm run test:integration` is executed
- **THEN** Vitest runs integration tests with full application context

**Example**: Theme switching integration test
```typescript
// test/integration/theme-integration.spec.ts
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '@/renderer/App';

// Test theme switching between main window and renderer
test('theme switches correctly across window and renderer', async () => {
  render(<App />);

  // Verify initial theme state
  const themeButton = screen.getByRole('button', { name: /theme/i });
  expect(themeButton).toBeInTheDocument();

  // Click theme toggle
  await userEvent.click(themeButton);

  // Verify theme changed
  expect(document.documentElement).toHaveClass('dark');
});
```

#### Scenario: E2E tests
- **GIVEN** E2E test files with `.e2e.ts` extension in `test/e2e/`
- **WHEN** `npm run test:e2e` is executed
- **THEN** Playwright runs end-to-end tests against the packaged Electron app

**Example**: Window management E2E test
```typescript
// test/e2e/window-management.e2e.ts
import { test, expect } from '@playwright/test';

test('window can be minimized and restored', async ({ electronApp }) => {
  const window = await electronApp.firstWindow();

  // Verify window is visible
  await expect(window.locator('h1')).toBeVisible();

  // Test window controls
  // (would interact with actual window controls)
});
```

#### Scenario: Storybook component test
- **GIVEN** a Storybook story `src/renderer/components/ui/Button.stories.tsx`
- **WHEN** Storybook Vitest addon runs
- **THEN** component stories are tested in browser environment

---

### Requirement: Test Execution Scripts
The project SHALL provide clear, environment-specific test execution commands via package.json:

1. **Unit Tests**: `npm run test:unit` - Runs co-located unit and component tests
2. **Component Tests**: `npm run test:component` - Runs Storybook component tests
3. **Integration Tests**: `npm run test:integration` - Runs integration tests
4. **E2E Tests**: `npm run test:e2e` - Runs Playwright E2E tests
5. **All Tests**: `npm run test:all` - Runs complete test suite in sequence

#### Scenario: Run specific test type
- **GIVEN** developer runs `npm run test:unit`
- **WHEN** Vitest executes
- **THEN** only co-located unit/component tests are run

#### Scenario: Run all tests
- **GIVEN** developer runs `npm run test:all`
- **WHEN** CI/CD pipeline executes
- **THEN** unit, integration, component, and E2E tests all execute in sequence

---

### Requirement: Vitest Configuration
Vitest SHALL be configured to:
- Run co-located unit tests in JSDOM environment
- Run component tests via Storybook integration in browser environment
- Run integration tests from `test/integration/` directory
- Use `tsconfig.vitest.json` for TypeScript compilation
- Support multi-project setup for different test types
- Explicitly exclude Playwright E2E test directories to prevent execution conflicts

#### Scenario: Unit test execution
- **GIVEN** Vitest is invoked with `npm run test:unit`
- **WHEN** scanning for `.test.ts` files in `src/**/*`
- **THEN** tests run in JSDOM environment with component rendering

#### Scenario: Integration test execution
- **GIVEN** Vitest is invoked with `npm run test:integration`
- **WHEN** scanning for `.spec.ts` files in `test/integration/**/*`
- **THEN** tests run with full application context and external dependencies

#### Scenario: Component story testing
- **GIVEN** Storybook Vitest project is configured
- **WHEN** stories are discovered in `src/**/*.stories.tsx`
- **THEN** tests run in Playwright browser with proper context isolation

#### Scenario: Vitest excludes Playwright tests
- **GIVEN** Vitest configuration includes exclude patterns
- **WHEN** Vitest scans the codebase for test files
- **THEN** it explicitly excludes `test/e2e/**` directory and only discovers Vitest-specific tests

---

### Requirement: Playwright Configuration
Playwright SHALL be configured to:
- Run E2E tests from `test/e2e/` directory
- Use `tsconfig.playwright.json` for TypeScript compilation
- Test the packaged Electron application
- Support cross-platform testing (Windows, macOS, Linux)

#### Scenario: E2E test with Electron app
- **GIVEN** Playwright is configured with Electron support
- **WHEN** `npm run test:e2e` is executed
- **THEN** tests run against the packaged app from `npm run make`

---

## REMOVED Requirements
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
