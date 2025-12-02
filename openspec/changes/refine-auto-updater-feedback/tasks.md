This project is divided into two main phases. First, we will build the core IPC infrastructure for handling real-time subscriptions. Second, we will implement the auto-updater feature on top of this new infrastructure.

---

### Phase 1: Build IPC Subscription Infrastructure

- [x] **Dependencies**
  - [x] 1. Add `swr` and `@orpc/experimental-publisher` to the project's dependencies.

- [ ] **Main Process (Server)**
  - [ ] 1. Create a singleton `MemoryPublisher` instance (`src/main/ipc/publisher.ts`). In the file, add comments explaining that oRPC supports both static (type-safe, chosen here) and dynamic (flexible) event patterns, providing guidance for future extension.
  - [ ] 2. Add a **specific** streaming oRPC handler, `app.onUpdateStatus`, which will be an `async function*` that hard-codes a subscription to the `'updater:status'` event from the publisher.

> **Note on Design Change**: The original idea of a generic subscription endpoint was replaced. We are now using a specific endpoint for each event stream to ensure maximum, end-to-end type safety, which is a more robust pattern for the current scale of the project.

---

### Phase 2: Implement Updater Feature

- [ ] **Main Process**
  - [ ] 1. Refactor the `setupUpdater` function in `src/main/index.ts` to publish `autoUpdater` lifecycle events to the central `MemoryPublisher`.
  - [ ] 2. Ensure the `app.checkForUpdates` oRPC handler triggers `autoUpdater.checkForUpdates()`.
  - [ ] 3. Ensure the `app.restartAndInstall` oRPC handler calls `autoUpdater.quitAndInstall()`.

- [ ] **Renderer Process**
  - [ ] 1. Create a `zustand` store (`src/renderer/store/update.ts`) to manage the updater's state.
  - [ ] 2. Create the `Updater.tsx` component.
  - [ ] 3. In the `Updater.tsx` component, use the `useSWRSubscription` hook **directly** to subscribe to the `app.onUpdateStatus` endpoint and update the `zustand` store when new events are received.

- [ ] **Configuration & Verification**
  - [ ] 1. **(Lesson Learned)** Ensure `tsconfig.json` files are correctly configured to include all necessary global `.d.ts` definitions to prevent type errors during compilation.
  - [ ] 2. Modify `forge.config.ts` to include a commented-out `osxSign` block as a placeholder for future code signing.
  - [ ] 3. Create a template `entitlements.mac.plist` file in the project root.

- [ ] **Testing**
  - [ ] 1. Write a unit test for the `zustand` store.
  - [ ] 2. Write an integration test for the `Updater.tsx` component, mocking the `useSWRSubscription` hook to simulate events and assert that the UI updates correctly.

- [ ] **Documentation**
  - [ ] 1. Ensure the new `publisher` module is clearly documented with inline comments per the new design.
