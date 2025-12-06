// Extends Vitest's 'expect' with matchers from jest-dom.
// This allows us to use assertions like .toBeInTheDocument() in our tests.
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server'; // Import MSW server

// Start the MSW server before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-off error cases).
afterEach(() => server.resetHandlers());

// Stop the MSW server after all tests.
afterAll(() => server.close());
