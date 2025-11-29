# Tasks: Integrate Upstream Main Changes

**Guiding Principle**: While this plan provides structure, the primary reference for all implementation details must be the **actual code** from the corresponding `upstream/main` commits. The `changes.txt` file serves only as an index. You **must** use `git` tools to inspect the actual changes within the corresponding commits on the `upstream/main` branch to determine how to update the project. Do not rely solely on parsing commit messages.

This plan integrates changes by applying them in chronologically ordered stages, following our definitive design for oRPC integration.

### Phase 1: Branch Creation

1.  [x] **Branch**: Create a new branch `feature/integrate-upstream-main` from the `dev` branch.

### Phase 2: Apply Stage 1 Batch (commits `1903b70` to `73e9064`)**:
    *   [x] Following the `upstream/main` changes, update `package.json` and other configuration files.
    *   [x] Run `pnpm install` to update the lockfile.
    *   [x] **Validation**: Ensure the application builds and all existing tests pass.

### Phase 3: Apply Stage 2 Commits (Core IPC Refactoring)

3.  [x] **Prerequisite - Configure TS for Type Imports**:
    *   Modify the project's `tsconfig.json` files to support cross-process `import type` statements, preferably using TypeScript Project References.
    *   **Validation**: A test file in `renderer` should be able to successfully `import type` a test type from `main` without compilation errors.
4.  [x] **Integrate "oRPC" Feature (Granular Application)**:
    *   **Reference**: Adhere to the patterns documented in `orpc-electron-guide.md`.
    *   For each commit in "Stage 2" of `changes.txt` (from `816d625` to `09c2d7c`):
        *   [x] Re-implement the changes in the `dev` branch, prioritizing the code from `upstream/main`.
        *   [x] Ensure the implementation correctly uses the `export type`/`import type` pattern.
    *   **Validation**: After the `oRPC` router and client are set up, write a new integration test to verify end-to-end typed communication.

### Phase 4 & 5 & 6: Apply Remaining Stages

5.  [x] **Apply Stage 3 Batch (commits `e927772` to `61650d7`)**:
    *   Apply post-refactoring dependency updates and run `pnpm install`.
6.  [x] **Apply Stage 4 Batch (commits `8c47620` to `2b60f7a`)**:
    *   Apply code structure and file renaming changes.
7.  [x] **Apply Stage 5 Batch (commits `7c07650` to `114ac4b`)**:
    *   Apply auto-updater and CI workflow changes.

### Phase 7: Final Validation

8.  [x] **Linters & Formatters**: Run `pnpm format` and `pnpm lint` and fix all issues.
9.  [x] **Automated Testing**: Execute the entire test suite and ensure 100% pass rate.
10. [ ] **Manual Smoke Test**: Perform a full manual test of all integrated features, especially theme-switching and window management via oRPC.
11. [ ] **Review**: Open a Pull Request.
12. [x] **Codify IPC Architecture**: Add a new rule to `openspec/AGENTS.md` to enforce the new environment-isolated IPC architecture.

### Phase 8: Final Architectural Refactoring (Post-Merge)

12. [x] **Isolate IPC Handlers**: Move `theme` and `window` IPC handlers from `src/shared/ipc` to `src/main/ipc`.
13. [x] **Isolate Main-Process Context**: Move `context.ts` and `handler.ts` from `src/shared/ipc` to `src/main/ipc`.
14. [x] **Centralize Router Implementation**: Create `src/main/ipc/router.ts` to compose all handlers and export the `AppRouter` type.
15. [x] **Isolate IPC Client**: Move `manager.ts` from `src/shared/ipc` to a new `src/renderer/ipc` directory.
16. [x] **Create Shared Type Definition**: Modify `src/shared/ipc/router.ts` to only re-export the `AppRouter` type from `main`.
17. [x] **Update Client Implementation**: Update the new `manager.ts` to use `createORPCClient<AppRouter>`.
18. [x] **Update All Imports**: Go through the codebase and fix all import paths related to the moved IPC files.
19. [x] **Validate**: Run `tsc`, `test`, and `lint` to ensure all checks pass after the refactoring.
