import { setupServer } from 'msw/node';

// This is the place for global MSW handlers that should be applied to all tests.
// Individual tests can extend or override these handlers as needed.
export const handlers = [];

// Configure a MSW server for Node.js environment (used by Vitest)
export const server = setupServer(...handlers);
