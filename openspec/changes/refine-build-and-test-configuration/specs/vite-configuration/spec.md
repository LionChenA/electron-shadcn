# Spec: Vite Configuration

This spec formalizes the use of a multi-config strategy for Vite to build the different processes of the Electron application.

## ADDED Requirements

### Requirement: Per-Process Vite Configurations

The build system MUST use separate Vite configuration files for the `main`, `renderer`, and `preload` processes.

- #### Scenario: Building the Main Process
  - **Given** the main process code is located in `src/main`.
  - **When** the build command is executed.
  - **Then** Vite MUST use `vite.main.config.mts` to compile the main process code, targeting a Node.js environment and outputting to the appropriate directory.

- #### Scenario: Building the Renderer Process
  - **Given** the renderer process code is located in `src/renderer`.
  - **When** the build command is executed.
  - **Then** Vite MUST use `vite.renderer.config.mts` to compile the renderer process code, targeting a browser environment and handling React/JSX transformations.

### Requirement: Shared Configuration for Path Aliases

All Vite configurations MUST use a shared mechanism to resolve TypeScript path aliases.

- #### Scenario: Resolving an Alias During Build
  - **Given** a path alias `@/shared/utils` is defined in `tsconfig.base.json`.
  - **And** the Vite configurations use the `vite-tsconfig-paths` plugin.
  - **When** an import statement `import { something } from '@/shared/utils'` is encountered in either `src/main` or `src/renderer`.
  - **Then** the Vite build process for that environment MUST correctly resolve the import to the `src/shared/utils` directory.
