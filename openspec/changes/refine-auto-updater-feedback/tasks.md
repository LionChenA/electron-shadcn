This project is divided into two main phases. First, we will build the core IPC infrastructure for handling real-time subscriptions. Second, we will implement the auto-updater feature on top of this new infrastructure.

---

### Phase 1: Build IPC Subscription Infrastructure

- [ ] **Dependencies**
  - [ ] 1. Add `swr` and `@orpc/experimental-publisher` to the project's dependencies.

- [ ] **Main Process (Server)**
  - [ ] 1. Create a singleton `MemoryPublisher` instance (`src/main/ipc/publisher.ts`) to act as a central event bus.
  - [ ] 2. Add a new streaming oRPC handler (`app.onUpdateStatus`) that is an `async function*`. This handler will subscribe to the publisher and `yield` events to the client.

- [ ] **Renderer Process (Client)**
  - [ ] 1. Create a generic `useSubscription` hook that wraps `useSWRSubscription` to provide a simplified interface for subscribing to server-sent events.

- [ ] **Testing**
  - [ ] 1. Write an integration test to verify that a client can successfully subscribe to and receive events published on the main process.

---

### Phase 2: Implement Updater Feature

- [ ] **Main Process**
  - [ ] 1. Refactor the `setupUpdater` function in `src/main/index.ts` to publish `autoUpdater` lifecycle events to the central `MemoryPublisher` (e.g., `publisher.publish('updater:status', { status: 'checking' })`).
  - [ ] 2. Ensure the `app.checkForUpdates` oRPC handler triggers `autoUpdater.checkForUpdates()`.
  - [ ] 3. Ensure the `app.restartAndInstall` oRPC handler calls `autoUpdater.quitAndInstall()`.

- [ ] **Renderer Process**
  - [ ] 1. Create a `zustand` store (`src/renderer/store/update.ts`) to manage the updater's state.
  - [ ] 2. Create the `Updater.tsx` component.
  - [ ] 3. In the `Updater` component (or a dedicated `useUpdater` hook), use the `useSubscription` hook created in Phase 1 to listen for `'updater:status'` events and update the `zustand` store.

- [ ] **Configuration & Verification**
  - [ ] 1. **(Lesson Learned)** Add a dedicated `src/renderer/window.d.ts` file for renderer-specific global type definitions and ensure `tsconfig.renderer.json` and `tsconfig.vitest.json` are configured to correctly include all necessary `.d.ts` files to prevent type errors.
  - [ ] 2. Modify `forge.config.ts` to include a commented-out `osxSign` block as a placeholder for future code signing.
  - [ ] 3. Create a template `entitlements.mac.plist` file in the project root.

- [ ] **Testing**
  - [ ] 1. Write a unit test for the `zustand` store.
  - [ ] 2. Write an integration test for the `Updater.tsx` component, mocking the `useSubscription` hook to simulate events and assert that the UI updates correctly.

- [ ] **Documentation**
  - [ ] 1. Ensure new modules for the publisher and subscription hook are clearly documented with inline comments.
