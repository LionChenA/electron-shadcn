---
title: Refactor IPC for Subscriptions & Implement Updater Feedback
id: refine-auto-updater-feedback
status: complete
---

## Goal

This proposal outlines a two-phased plan to enhance the application's architecture and features:

1.  **Phase 1: Refactor IPC Infrastructure for Subscriptions.** The primary goal is to upgrade the core IPC infrastructure to support persistent, server-to-client communication. This will be achieved by implementing a subscription pipeline using oRPC's native streaming (`async function*`) and publisher/subscriber capabilities. This creates a robust, type-safe foundation for any feature requiring real-time updates from the main process.

2.  **Phase 2: Implement Auto-Updater Feedback.** Leveraging the new subscription infrastructure, the secondary goal is to build the lightweight auto-update notification system. This will provide users with real-time status updates about the application's update process, without adding external dependencies like `electron-updater`.

## Non-Goals

- A visual representation of the download progress (e.g., a progress bar).
- Using any IPC mechanism outside of the oRPC framework for status updates. All communication will be unified within oRPC.

## Approach

The implementation will be staged to ensure a clean separation of concerns:

1.  **IPC Infrastructure**:
    *   A new generic `MemoryPublisher` will be added to the main process to handle event broadcasting.
    *   A new **specific** oRPC streaming endpoint (`app.onUpdateStatus`) will be created to expose server-sent events to the client.
    *   The client-side `useSWRSubscription` hook (wrapped by `createSWRUtils` from `@orpc/experimental-react-swr`) will be used to easily subscribe to these events in React components.

2.  **Updater Feature**:
    *   The main process `autoUpdater` will be refactored to publish status events using the new `publisher`.
    *   The renderer-side `Updater` component will use the new `useSubscription` hook to listen for status changes and update its state, which will be managed by `zustand`.
