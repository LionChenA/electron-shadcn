## 1. TypeScript Configuration Setup
- [ ] 1.1 Create tsconfig.base.json with shared compiler options
- [ ] 1.2 Update tsconfig.json to extend from base (src environment)
- [ ] 1.3 Create tsconfig.vitest.json for Vitest environment
- [ ] 1.4 Create tsconfig.playwright.json for Playwright environment
- [ ] 1.5 Update Vitest config to use vitest-specific tsconfig
- [ ] 1.6 Update Playwright config to use playwright-specific tsconfig

## 2. Test File Reorganization and Example Creation
- [ ] 2.1 Move src/tests/unit/sum.test.ts → src/shared/utils/sum.test.ts (unit test example)
- [ ] 2.2 Create src/renderer/components/ui/Button.stories.tsx (component test example)
- [ ] 2.3 Create test/integration/theme-integration.spec.ts (integration test example)
- [ ] 2.4 Create test/e2e/window-management.e2e.ts (E2E test example)
- [ ] 2.5 Remove old src/tests/ directory

## 3. Configuration Updates
- [ ] 3.1 Update vitest.config.ts for new test locations
- [ ] 3.2 Update playwright.config.ts for new test directory
- [ ] 3.3 Update package.json test scripts
- [ ] 3.4 Update Storybook configuration if needed
- [ ] 3.5 Update CI/CD workflow test commands

## 4. Validation
- [ ] 4.1 Run unit tests to verify co-located tests work
- [ ] 4.2 Run E2E tests to verify test/e2e/ works
- [ ] 4.3 Run Storybook tests to verify integration
- [ ] 4.4 Run test:all command to verify full test suite
- [ ] 4.5 Fix any configuration or path issues
