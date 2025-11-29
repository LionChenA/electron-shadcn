## MODIFIED Requirements

### Requirement: The application SHALL provide an on-demand mechanism to check for updates

The application's auto-update functionality MUST be exposed as an IPC procedure that can be triggered at any time, rather than running automatically only at startup.

#### Scenario: Manually trigger an update check via IPC
- **Given** the application is running.
- **When** a developer or a UI element triggers the `app.checkForUpdates` IPC procedure.
- **Then** the main process console logs a message indicating that an update check has been performed against the GitHub repository.
