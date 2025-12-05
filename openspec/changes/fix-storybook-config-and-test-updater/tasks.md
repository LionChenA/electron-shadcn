1.  **Spec**: Move the archived testing spec `openspec/changes/archive/2025-11-25-refactor-test-architecture/specs/testing/spec.md` to `openspec/specs/testing/spec.md` and update its content to reflect the refined testing strategy.
2.  **Config (TypeScript)**: Delete the problematic `tsconfig.vitest.json` file.
3.  **Config (TypeScript)**: Create a new `tsconfig.vitest-renderer.json` file for renderer-based tests (`jsdom` and `browser`).
4.  **Config (TypeScript)**: Create a new `tsconfig.vitest-main.json` file for main process tests (`node`).
5.  **Config (Storybook)**: Modify `.storybook/main.ts` to dynamically import and merge the configuration from `vite.renderer.config.mts`.
6.  **Config (Vitest)**: Refactor `vitest.config.ts` to use `projects` for each test environment, pointing them to the correct tsconfig files.
    -   A `renderer` project for unit/integration tests in `jsdom`.
    -   A `storybook` project using `@storybook/addon-vitest/vitest-plugin` in `browser` mode.
    -   A `main` project for main process tests in `node` environment.
7.  **Dependencies**: Ensure `@storybook/test`, `@storybook/addon-vitest`, and `@vitest/browser` are installed.
8.  **Test**: Create a new unit test file `src/renderer/components/Updater.test.tsx` with a basic test case.
9.  **Story**: Create a new story file `src/renderer/components/Updater.stories.tsx`.
10. **Story - Default State**: Add a story that renders the `Updater` in its default state.
11. **Story - Interaction Test**: Add a story for the "update available" state that includes a `play` function to test the component's interactive behavior.
12. **Scripts**: Add `test:component`, `test:unit`, and `test:main` scripts to `package.json` that execute `vitest --project storybook`, `vitest --project renderer`, and `vitest --project main` respectively.
13. **Validation**: Run `npm run test -- --all` and confirm all test projects execute and pass.
14. **Validation**: Run `npm run storybook` and manually verify that the `Updater` stories render correctly and the co-located unit test results appear in the "Tests" panel.