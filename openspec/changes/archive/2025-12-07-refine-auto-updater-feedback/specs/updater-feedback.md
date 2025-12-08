## ADDED Requirements

### 1. The application must provide real-time feedback to the user about the auto-update process, using the IPC subscription infrastructure.

#### Scenario: Update Check Finds No Update
- GIVEN the application UI is in an idle state.
- WHEN the user initiates an "Check for Updates" action.
- THEN the UI immediately displays a "Checking for updates..." status.
- AND an oRPC request is sent to the main process to start the check.
- AND the main process finds no available update.
- THEN the main process publishes an "update-not-available" event.
- AND the UI receives this event via its IPC subscription and displays a "You are up to date!" status for a brief period before returning to the idle state.

#### Scenario: Update is Found, Downloaded, and Installed
- GIVEN the user has initiated an update check.
- THEN the main process finds an available update.
- AND the main process publishes an "update-available" event.
- AND the UI receives this and displays an "Update available, downloading..." status.
- AND once the download is complete, the main process publishes an "update-downloaded" event.
- AND the UI receives this and displays an "Update ready. Restart & Install" message with an actionable button.
- WHEN the user clicks the "Restart & Install" button.
- THEN an oRPC request is sent to the main process, which triggers the application to quit and begin the update installation.
