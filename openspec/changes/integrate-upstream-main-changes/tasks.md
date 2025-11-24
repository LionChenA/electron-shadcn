# Tasks: Integrate Upstream Main Changes

**Guiding Principle**: While this plan provides structure, the primary reference for all implementation details must be the **actual code** from the corresponding `upstream/main` commits.

This plan integrates changes by applying them in chronologically ordered stages, following our definitive design for oRPC integration.

### Phase 1: Branch Creation

1.  [ ] **Branch**: Create a new branch `feature/integrate-upstream-main` from the `dev` branch.

### Phase 2: Apply Stage 1 Batch (commits `1903b70` to `73e9064`)**:
    *   Following the `upstream/main` changes, update `package.json` and other configuration files.
    *   Run `pnpm install` to update the lockfile.
    *   **Validation**: Ensure the application builds and all existing tests pass.

### Phase 3: Apply Stage 2 Commits (Core IPC Refactoring)

3.  [ ] **Prerequisite - Configure TS for Type Imports**:
    *   Modify the project's `tsconfig.json` files to support cross-process `import type` statements, preferably using TypeScript Project References.
    *   **Validation**: A test file in `renderer` should be able to successfully `import type` a test type from `main` without compilation errors.
4.  [ ] **Integrate "oRPC" Feature (Granular Application)**:
    *   **Reference**: Adhere to the patterns documented in `orpc-electron-guide.md`.
    *   For each commit in "Stage 2" of `changes.txt` (from `816d625` to `09c2d7c`):
        *   [ ] Re-implement the changes in the `dev` branch, prioritizing the code from `upstream/main`.
        *   Ensure the implementation correctly uses the `export type`/`import type` pattern.
    *   **Validation**: After the `oRPC` router and client are set up, write a new integration test to verify end-to-end typed communication.

### Phase 4 & 5 & 6: Apply Remaining Stages

5.  [ ] **Apply Stage 3 Batch (commits `e927772` to `61650d7`)**:
    *   Apply post-refactoring dependency updates and run `pnpm install`.
6.  [ ] **Apply Stage 4 Batch (commits `8c47620` to `2b60f7a`)**:
    *   Apply code structure and file renaming changes.
7.  [ ] **Apply Stage 5 Batch (commits `7c07650` to `114ac4b`)**:
    *   Apply auto-updater and CI workflow changes.

### Phase 7: Final Validation

8.  [ ] **Linters & Formatters**: Run `pnpm format` and `pnpm lint` and fix all issues.
9.  [ ] **Automated Testing**: Execute the entire test suite and ensure 100% pass rate.
10. [ ] **Manual Smoke Test**: Perform a full manual test of all integrated features, especially theme-switching and window management via oRPC.
11. [ ] **Review**: Open a Pull Request.
