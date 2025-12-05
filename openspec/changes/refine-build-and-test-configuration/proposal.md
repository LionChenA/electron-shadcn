# Proposal: Refine Build and Test Configuration

This proposal aims to formalize and refactor the project's build and test configuration to resolve critical TypeScript context-collision issues and establish a robust, integrated component testing strategy.

## 1. Problem

The project currently suffers from configuration fragmentation:
1.  **TypeScript Context Collision**: A "flat" `tsconfig` and single-environment Vitest setup cause unresolvable type errors by attempting to compile Node.js (`main`) and browser (`renderer`) code in the same context.
2.  **Undefined Component Testing**: The mechanism for testing component interactions within Storybook is not formally implemented.
3.  **Ambiguous Configuration**: The relationships between the numerous `tsconfig.*.json` and `vite.*.config.mts` files are not clearly defined, hindering maintainability.

## 2. Proposed Changes

This proposal introduces a unified and hierarchical configuration model, detailed in `design.md`, and formalized through the following specifications:

### 2.1. New Specifications

- **`specs/typescript-configuration`**: Establishes a hierarchical `tsconfig` structure with a central `tsconfig.base.json` for path aliases and shared options, which other environment-specific configs will extend.
- **`specs/vite-configuration`**: Formalizes the existing multi-config pattern for Vite, ensuring separate, clean builds for the `main`, `preload`, and `renderer` processes.
- **`specs/storybook-configuration`**: Defines the integration of Storybook with Vitest using the `@storybook/addon-vitest` for automated component interaction testing in a real browser environment.

### 2.2. Modified Specifications

- **`specs/testing-strategy`**: Updates the testing strategy to use a multi-project setup in `vitest.config.ts`, creating isolated test environments (`node`, `jsdom`, `browser`) for the `main`, `renderer`, and `storybook` tests, respectively.

By implementing these changes, we will create a stable, maintainable, and powerful build and test system that aligns with the project's architecture and enables a best-in-class developer experience.
