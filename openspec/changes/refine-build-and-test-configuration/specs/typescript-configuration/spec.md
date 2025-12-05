# Spec: TypeScript Configuration

This spec defines the hierarchical structure for TypeScript configuration to ensure consistency, maintainability, and proper type resolution across different environments (main, renderer, test).

## ADDED Requirements

### Requirement: Centralized Base Configuration

A single `tsconfig.base.json` file MUST serve as the source of truth for all shared compiler options and path aliases.

- #### Scenario: Adding a New Path Alias
  - **Given** a developer needs to add a new path alias for a shared utility directory.
  - **When** they add the alias to the `paths` object in `tsconfig.base.json`.
  - **Then** that alias MUST become available for use in the main process, renderer process, and test environments without further changes to other `tsconfig` files.

### Requirement: Environment-Specific Configuration Extension

Each distinct runtime environment (main, renderer, preload) and tool (root, Vitest, Playwright) MUST have its own `tsconfig.json` file that extends the `tsconfig.base.json`.

- #### Scenario: Renderer-Specific Type Libraries
  - **Given** the renderer process requires DOM-related libraries for TypeScript.
  - **When** the `compilerOptions.lib` in `src/renderer/tsconfig.json` is set to `["DOM", "ESNext"]`.
  - **And** `src/renderer/tsconfig.json` extends `../../tsconfig.base.json`.
  - **Then** renderer-specific code MUST have access to DOM types, while still resolving all path aliases defined in the base configuration.
  - **And** this configuration MUST NOT affect the main process, which does not have access to DOM types.

### Requirement: Dedicated Test Environment Configuration

A dedicated `tsconfig.vitest.json` file MUST provide the type context for all tests run by Vitest.

- #### Scenario: Running Tests in Any Environment
  - **Given** Vitest is configured to run tests for Node.js, JSDOM, and browser environments.
  - **When** `tsconfig.vitest.json` extends `./tsconfig.base.json` and includes `vitest/globals`, `vitest/jsdom`, and `vitest/browser` in its `compilerOptions.types`.
  - **Then** Vitest MUST be able to correctly type-check test files from any of the three test projects (`main`, `renderer`, `storybook`) using the appropriate global types for that test's environment.
