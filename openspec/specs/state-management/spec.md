# Spec: State Management Strategy

## Related Documents

- **[oRPC-based IPC Strategy](../orpc-based-ipc/spec.md)**

## 1. Overview

This document outlines the state management strategy for the renderer process. To ensure clarity and leverage the best tool for each task, we use a combination of three libraries: `@tanstack/react-query`, `swr`, and `zustand`.

A simple way to understand our library choice for IPC (Inter-Process Communication) is by **the direction of communication**:
- Is the renderer requesting data from the main process? (**Use `@tanstack/react-query`**)
- Is the main process pushing updates to the renderer? (**Use `swr`**)

## 2. Library Roles and Responsibilities

### 2.1. `@tanstack/react-query` (Renderer -> Main)

- **Primary Role**: Manages communication initiated **by the Renderer Process**.
- **Direction**: `Renderer Process -> Main Process`.
- **Analogy**: A **"Request-Response"** model. The renderer actively asks the main process for data (`useQuery`) or commands it to perform an action (`useMutation`). The main process passively responds.

- **Key Features**:
    - Automatic Caching & Invalidation: Stores fetched data and automatically invalidates it when mutations occur.
    - Background Refetching: Keeps data fresh by refetching in the background.
    - Stale-While-Revalidate: Immediately shows cached data while fetching an update.
    - Devtools: Powerful developer tools for visualizing cache state and query lifecycles.

- **Pros**:
    - **Simplifies UI Logic**: Drastically reduces boilerplate for managing loading, error, and data states.
    - **Improves User Experience**: Data feels "live" and up-to-date with minimal effort.
    - **Powerful & Scalable**: Handles complex scenarios like dependent queries, pagination, and optimistic updates.

- **Cons**:
    - **Not for push-based events**: Not designed to passively listen for events pushed from the main process.

- **Usage**: **The default choice for all oRPC queries and mutations.**

### 2.2. `swr` (Main -> Renderer)

- **Primary Role**: Manages communication initiated **by the Main Process**.
- **Direction**: `Main Process -> Renderer Process`.
- **Analogy**: A **"Subscription"** or **"Push"** model. The main process actively broadcasts events, and the renderer passively listens for them using `useSWRSubscription`.

- **Usage**:
    - The use of `swr` is **exclusively for real-time, streaming subscriptions** from the main process. It is NOT to be used for general "request-response" data fetching.
    - **Rationale**: The `@orpc/experimental-react-swr` utility provides a clean and direct API for this specific "push" pattern.
- **Example**:
    - Subscribing to auto-update progress events pushed from the main process.

### 2.3. `zustand` (Internal to Renderer)

- **Primary Role**: Manages state that is **internal and synchronous to the client**. It has no concept of IPC direction.
- **Direction**: N/A.
- **Analogy**: A **local toolbox** for the renderer's UI state.

- **Key Features**:
    - Minimalist API, no `<Provider>` wrapper needed.
    - Selective subscriptions for performance.
    - Middleware support (persistence, immer, etc.).

- **Pros**:
    - **Lightweight & Fast**: Minimal boilerplate and optimized for performance.
    - **Easy to Use**: Intuitive for developers of all levels.
    - **Decoupled**: State lives outside the React component tree.

- **Cons**:
    - **No Async Features**: Provides no built-in logic for caching or refetching. This is by design.

- **Usage**: **The default choice for global UI state**, such as theme, language, or the state of a sidebar.

## 3. Conclusion

By assigning clear, direction-based roles to each library, we ensure developers can intuitively choose the right tool, leading to a more maintainable and predictable codebase.
