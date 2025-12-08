## Known Issues

### 1. TypeScript Build Error (`tsc -b`): Jest-DOM Matchers Not Recognized

*   **Description**: Despite `@testing-library/jest-dom` being correctly installed and its types explicitly included in `tsconfig.vitest.json` (`compilerOptions.types`) and imported via `test/vitest.setup.ts`, the `tsc -b` command consistently fails with `error TS2339: Property 'toBeInTheDocument' does not exist on type 'Assertion<HTMLElement>'` (and similar errors for other Jest-DOM matchers). This error occurs only during `tsc -b`'s static analysis, while Vitest runs the tests correctly at runtime.
*   **Attempts to Fix**:
    *   Ensuring `test/vitest.setup.ts` correctly imports `@testing-library/jest-dom/vitest`.
    *   Adding `test/vitest.setup.ts` to `tsconfig.vitest.json`'s `include` array.
    *   Adding `"@testing-library/jest-dom"` to `tsconfig.vitest.json`'s `compilerOptions.types` array.
    *   Removing the `compilerOptions.types` array to allow automatic type discovery.
    *   Adding `/// <reference types="@testing-library/jest-dom" />` to `test/vitest.setup.ts`.
    *   Using `as any` type assertions (which also failed due to type inference).
*   **Conclusion**: This issue appears to stem from a deep, unresolved conflict or misconfiguration within the project's complex TypeScript project reference setup (`tsc -b` composite projects) and how it interacts with type augmentation for test matchers. All attempts to resolve it through standard `tsconfig` adjustments or explicit type directives have been unsuccessful. The tests run correctly at runtime, indicating the problem is confined to the static type-checking phase. This issue is being formally documented as currently unresolved.
*   **Impact**: Prevents `tsc -b` from completing successfully in the CI/CD pipeline, potentially affecting type-checking gates. Runtime behavior is unaffected.
