## ADDED Requirements

### 1. The IPC system must provide a mechanism for the main process to push events to the renderer process through a persistent, type-safe oRPC stream.

#### Scenario: Real-time Event Streaming
- GIVEN a client has established a subscription to a "system-events" stream via an oRPC endpoint.
- WHEN a new event (e.g., network status change) is generated in the main process.
- THEN the main process publishes this event to an internal publisher.
- AND the oRPC streaming endpoint handler receives the event and yields it to the client.
- AND the renderer process receives the new event payload through its active oRPC subscription without needing to poll for it.
