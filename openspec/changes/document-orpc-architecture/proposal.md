# Change: Document oRPC IPC Architecture

## Why
The project uses oRPC to build a fully type-safe, performant IPC pipeline across main, preload, and renderer processes using Electron's MessageChannel. Comprehensive spec documentation ensures long-term maintainability, onboarding, and validation against implementation.

## What Changes
- Add detailed requirements and scenarios to the `typed-ipc` capability describing the oRPC router, handlers, handshake, type flow, and context injection.
- Provide architectural design rationale and diagrams.

No code changes required—this documents existing implementation.

## Impact
- Affected specs: `typed-ipc`
