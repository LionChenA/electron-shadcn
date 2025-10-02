# Project Architecture Guidelines

This document outlines the mandatory architectural standards for the `electron-shadcn` project to ensure consistency, maintainability, and scalability.

## 1. Directory Structure and Responsibilities

The `src` directory is strictly divided based on Electron's process model. Understanding this separation is crucial.

-   **`src/main/`**: This directory contains all code for Electron's **Main Process**. The main process runs a full Node.js environment and is responsible for managing the application's lifecycle, creating and managing browser windows (`BrowserWindow`), and handling native OS integrations. It is the entry point of the application.

-   **`src/renderer/`**: This directory holds the code for the **Renderer Process**, which is essentially the web page running inside a `BrowserWindow`. It is responsible for rendering the UI and handling user interactions. It does **not** have direct access to Node.js or OS-level APIs for security reasons.

-   **`src/preload/`**: This directory contains preload scripts. A preload script is a bridge between the renderer process and the main process. It runs in a privileged context with access to Node.js APIs, but it can expose specific, secure functions to the renderer process via the `contextBridge` API. This is the only secure way for the UI to communicate with the backend.

-   **`src/shared/`**: This directory is for code that needs to be shared across different processes, primarily between the main and renderer processes. It serves as a common "contract" to ensure consistency.

## 2. Inter-Process Communication (IPC) Architecture

IPC is fundamental to an Electron app. Our project uses a structured approach to manage communication between the main and renderer processes.

-   **`shared/ipc/`**: This is the most critical part of the IPC contract. It defines the **channel names** and **data types/interfaces** for all IPC communication. By centralizing this, we ensure that both the "client" (renderer) and the "server" (main) agree on the communication protocol.

-   **`main/ipc/`**: This directory contains the **IPC listeners** (handlers) in the main process. These are the functions that execute when a message is received from the renderer process on a specific channel. They perform backend tasks, interact with the OS, and can send results back to the renderer.

-   **`preload/` & `renderer/ipc/`**: The scripts in `preload/` (e.g., `lib/contextExposer.ts`) expose IPC functionality to the renderer in a secure way. The preload script attaches an object to the global `window` object in the renderer, containing functions that the UI can call. These functions, under the hood, use `ipcRenderer.invoke` or `ipcRenderer.send` to communicate with the main process using the channels defined in `shared/ipc`. The renderer code then imports and uses this exposed context from `renderer/ipc/` (e.g., `themeContext.ts`).

This one-way data flow (`renderer` calls -> `preload` exposes -> `main` listens) is essential for application security and predictability.

## 3. Naming Conventions

The following naming conventions are **mandatory**:

-   **Components (`.tsx`)**: Must use `PascalCase.tsx` (e.g., `MyComponent.tsx`).
-   **Modules/Services (`.ts`)**: Must use `camelCase.ts` (e.g., `myService.ts`).
-   **Clarity over Brevity**: File names must describe the entity, while the directory path provides context. Redundant suffixes like `_helpers` or `_channels` are forbidden.

## 4. Other Core Principles

-   **Functional Cohesion**: Generic `helpers` folders are forbidden. Utility functions must be co-located with the feature they support.
-   **Extensibility**: The `lib/` directory within each process folder is reserved for future core business logic.
-   **Simplified Component Structure**: The component structure is kept flat. Common layout components are placed directly under `renderer/components/`.
