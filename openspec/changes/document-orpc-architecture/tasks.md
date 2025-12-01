# Tasks: Document oRPC IPC Architecture

## 1. Validation & Review
- [ ] Run `openspec validate document-orpc-architecture --strict` and resolve issues
- [ ] Review spec deltas against current code (`src/main/ipc/**`, `src/renderer/ipc/manager.ts`, etc.)

## 2. Integration
- [ ] Merge deltas into `openspec/specs/typed-ipc/spec.md` (manual or via `openspec archive`)
- [ ] Update `openspec/project.md` Architecture section if needed
- [ ] Add Storybook doc or README links to specs

## 3. Archive
- [ ] `openspec archive document-orpc-architecture --yes`
