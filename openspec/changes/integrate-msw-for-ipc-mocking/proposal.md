# Proposal: Integrate OpenAPI-Based MSW Infrastructure for Mocking

This proposal outlines a plan to implement a comprehensive, project-wide API/IPC mocking strategy using MSW (Mock Service Worker). This new infrastructure will be based on oRPC's native OpenAPI support and will leverage code generation via Kubb to provide a unified, type-safe mocking system for our primary testing environments: Vitest and Storybook.

## Why

Reliably testing components that depend on backend responses is a critical challenge. Our previous explorations revealed that manual mocking is brittle and unrealistic. This proposal adopts a superior, industry-standard approach. The core insight is that **oRPC can expose an OpenAPI-compliant interface over standard HTTP in a test environment**. This unlocks the entire OpenAPI and MSW ecosystem.

This strategy will:
*   **Drastically Increase Test Fidelity**: Components will be tested against a realistic, low-level mock of the communication layer, using their real, unmodified data-fetching logic.
*   **Automate Mock Generation**: By using **Kubb** to generate MSW handlers directly from our oRPC-generated OpenAPI schema, we eliminate manual mock creation, ensuring mocks are always in sync with the API contract and fully type-safe.
*   **Unify the Testing Experience**: A single, auto-generated set of MSW handlers will become the "source of truth" for mocking, used consistently across Vitest (unit/integration) and Storybook (component/visual) tests.
*   **Improve Developer Experience & Velocity**: Writing tests becomes faster and more declarative. Developers can focus on test logic by simply selecting the appropriate auto-generated MSW handler, rather than worrying about mock implementation details.

## Proposed Changes

1.  **Enforce Explicit Zod Schemas**: Mandate that all oRPC handlers MUST have explicit `.input()` and `.output()` Zod schemas to ensure a high-fidelity OpenAPI specification.
2.  **Establish Holistic TypeScript Checking**: Reconfigure the project's TypeScript setup to enable `tsc -b` to perform a complete, project-wide type check that covers `src`, `test`, and `scripts` directories, using partitioned configurations to handle the special requirements of generated code.
3.  **Enable oRPC's OpenAPI/HTTP Endpoint**: Configure the oRPC client to use a standard HTTP transport layer during tests, making it automatically compatible with MSW.
4.  **Introduce Kubb for Code Generation**: Add a process to generate an `openapi.json` schema from our oRPC router and use Kubb to automatically generate type-safe MSW handlers from this schema.
5.  **Integrate MSW Across Testing Tools**:
    *   **Vitest**: Configure `msw/node` to provide API mocks for tests running in Node.js and JSDOM.
    *   **Storybook**: Use `msw-storybook-addon` to allow stories to declaratively specify their required backend responses.
6.  **Reference Implementation**: Refactor the tests for `Updater.tsx` to serve as the "gold standard" example of this new testing paradigm.
7.  **Update Specs**: Formalize this new strategy in the project's OpenSpec documents and update dependent specs (`testing-strategy`, `orpc-based-ipc`).
