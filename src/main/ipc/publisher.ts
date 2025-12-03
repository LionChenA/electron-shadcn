import { MemoryPublisher } from '@orpc/experimental-publisher/memory';

/**
 * Defines the shape of all events that can be broadcasted within the main process.
 * This provides a centralized and type-safe way to manage internal events.
 */
export type AppEvents = {
  'updater:status': {
    status: 'checking' | 'available' | 'not-available' | 'downloaded' | 'error';
    message?: string; // Optional message, e.g., for errors
  };
};

/**
 * A singleton instance of the MemoryPublisher.
 * This acts as a central, in-memory event bus for the main process.
 *
 * ---
 *
 * ### Note on oRPC Publisher Patterns
 *
 * oRPC's publisher supports two primary patterns for typing events:
 *
 * 1.  **Static (Type-Safe, used here)**: By defining a type with specific event names
 *     (e.g., `type Events = { 'my-event': T }`), you get full, end-to-end type
 *     safety. The server and client know exactly what payload corresponds to what event.
 *     This requires a dedicated streaming endpoint for each event.
 *
 * 2.  **Dynamic (Flexible)**: By typing the publisher with a record
 *     (e.g., `Record<string, T>`), you can create a single, generic endpoint that
 *     handles any event name as a string. The trade-off is weaker payload type
 *     safety, as all events must conform to the same payload shape `T`.
 *
 * We are choosing the **Static** pattern for simplicity and maximum type safety.
 * If the number of event types grows significantly, this could be refactored
 * to the dynamic pattern.
 */
export const publisher = new MemoryPublisher<AppEvents>();
