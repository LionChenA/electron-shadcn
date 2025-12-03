// Extends Vitest's 'expect' with matchers from jest-dom.
// This allows us to use assertions like .toBeInTheDocument() in our tests.
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest';
