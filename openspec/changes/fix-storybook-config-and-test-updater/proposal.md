# Proposal: Fix Storybook Configuration and Implement Updater Component Tests

This proposal aims to formalize the project's testing strategy, correct the Storybook configuration, and establish a best-practice pattern for component testing using the `Updater` component as an example.

## Why

This change is necessary to address several critical issues:
1.  **Inconsistent Storybook Environment**: The current Storybook setup struggles with resolving project path aliases, leading to a disconnected development experience and potential inconsistencies with the main application's build.
2.  **Lack of a Formalized Testing Strategy**: While an excellent layered testing strategy has been documented (in an archived state), it has not been formally adopted or fully implemented. This results in ambiguity regarding testing methodologies and reduced overall test coverage confidence.
3.  **Insufficient Component Testing**: Key UI components, such as the `Updater`, lack dedicated interaction and unit tests. This increases the risk of regressions, especially for critical user-facing features.

By implementing this proposal, we will achieve:
*   A fully functional and consistent Storybook environment that accurately reflects the application's build.
*   A clear, formalized, and implemented multi-layered testing strategy that guides all testing efforts.
*   Improved quality and reliability of critical UI components through comprehensive testing within Storybook.
*   A more robust and efficient development workflow, leveraging Storybook as a central hub for building, viewing, and testing components.

## Problem

1.  **Inconsistent Storybook Environment**: Storybook cannot resolve project path aliases (e.g., `@/components`), making it difficult to import components and causing a divergence from the main application's build setup.
2.  **Undefined Testing Strategy**: The project has a well-documented but *archived* testing specification. This needs to be formally adopted and implemented to guide future development.
3.  **Lack of Component Tests**: Critical UI components like `Updater` lack targeted interaction and unit tests, increasing the risk of regressions.

## Proposed Changes

This change introduces three main improvements:

1.  **Formalize Testing Strategy**: Adopt and activate the layered testing strategy as detailed in the [design document](./design.md) and specified in `specs/testing-strategy/spec.md`.
2.  **Fix Storybook Configuration**: Modify `.storybook/main.ts` to reuse the main application's Vite configuration, ensuring a consistent build environment. This is specified in `specs/storybook-configuration/spec.md`.
3.  **Add Updater Component Tests**: Create comprehensive tests for the `Updater` component within the Storybook framework, serving as a template for future component testing. This is specified in `specs/updater-component-testing/spec.md`.

By implementing these changes, we will create a more robust and efficient development workflow, where Storybook becomes a central hub for building, viewing, and testing components.