# auto-updater Specification

## Purpose
Production-ready auto-updates: on-demand/startup checks via IPC, with GitHub CI/CD publishing support.
## Requirements
### Requirement: Application SHALL support configurable update checks

The application SHALL expose IPC for on-demand checks and perform automatic checks on startup or via UI trigger.

#### Scenario: Update check (on-demand or startup)
- **Given** the application is running or launching (production build).
- **When** `app.checkForUpdates` IPC is called or app starts.
- **Then** main process logs confirm GitHub repo check.

### Requirement: Implement a CI/CD workflow for publishing releases

A GitHub Actions workflow SHALL be in place to automate the building and publishing of new application releases to GitHub.

#### Scenario: Manually trigger a new release
- **Given** the `publish-release` workflow exists in `.github/workflows/`.
- **When** a developer with appropriate permissions manually triggers the workflow from the GitHub Actions tab.
- **Then** the workflow job runs successfully.
- **And** a new release is created on the project's GitHub Releases page.
- **And** the release includes the platform-specific application artifacts (e.g., `.dmg`, `.exe`).

