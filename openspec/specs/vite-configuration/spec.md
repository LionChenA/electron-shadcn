# vite-configuration Specification

## Purpose
Define a modular Vite build system with a shared base configuration and process-specific configs (`main`, `renderer`, `preload`) to ensure optimized and correct builds for each Electron process.
## Requirements
### Requirement: Per-Process Vite Configurations

The build system MUST use separate Vite configuration files for the `main`, `renderer`, and `preload` processes.

#### Scenario: Building the Main Process
  - **Given** the main process code is located in `src/main`.
  - **When** the build command is executed.
  - **Then** Vite MUST use `vite.main.config.mts` to compile the main process code, targeting a Node.js environment and outputting to the appropriate directory.

#### Scenario: Building the Renderer Process
  - **Given** the renderer process code is located in `src/renderer`.
  - **When** the build command is executed.
  - **Then** Vite MUST use `vite.renderer.config.mts` to compile the renderer process code, targeting a browser environment and handling React/JSX transformations.

### Requirement: Centralized Base Vite Configuration

A `vite.base.config.mts` file MUST define shared configuration, and environment-specific Vite configs MUST extend it using `mergeConfig`.

#### Scenario: Sharing the Path Alias Plugin
  - **Given** the `vite.base.config.mts` file defines the `tsconfigPaths()` plugin.
  - **And** `vite.main.config.mts` and `vite.renderer.config.mts` both use `mergeConfig` to extend the base configuration.
  - **When** the build process for either `main` or `renderer` is executed.
  - **Then** both build processes MUST correctly resolve path aliases defined in `tsconfig.base.json` because they have inherited the `tsconfigPaths()` plugin.

