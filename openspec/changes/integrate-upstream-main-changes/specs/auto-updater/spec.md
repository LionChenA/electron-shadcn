## ADDED Requirements

### Requirement: Implement application auto-update checks

The application must automatically check for new releases upon startup.

#### Scenario: Check for updates on application launch
- **Given** the application is packaged for production.
- **When** the application is launched.
- **Then** the main process logs show a message indicating that an update check has been performed against the GitHub repository.

### Requirement: Implement a CI/CD workflow for publishing releases

A GitHub Actions workflow must be in place to automate the building and publishing of new application releases to GitHub.

#### Scenario: Manually trigger a new release
- **Given** the `publish-release` workflow exists in `.github/workflows/`.
- **When** a developer with appropriate permissions manually triggers the workflow from the GitHub Actions tab.
- **Then** the workflow job runs successfully.
- **And** a new release is created on the project's GitHub Releases page.
- **And** the release includes the platform-specific application artifacts (e.g., `.dmg`, `.exe`).
