# Contributing to electron-shadcn

First off, thank you for considering contributing. It's people like you that make open source such a great community!

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that the issue is already reported.

### Suggesting Enhancements

We're open to suggestions! If you have an idea for an enhancement, feel free to open an issue to discuss it.

### Pull Requests

We welcome pull requests. Please ensure your code adheres to the existing style and that all tests pass.

## Pull Request Process

1.  Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2.  Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3.  Increase the version numbers in any examples and the README.md to the new version that this Pull Request would represent. The semver standard is followed.
4.  You may merge the Pull Request in once you have the sign-off of at least one other developer, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Commit Message Guidelines

To ensure consistency and to enable automatic changelog generation, we adhere to the [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/) specification.

Each commit message consists of a **header**, a **body** and a **footer**.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type

Must be one of the following:

*   **feat**: A new feature
*   **fix**: A bug fix
*   **docs**: Documentation only changes
*   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
*   **refactor**: A code change that neither fixes a bug nor adds a feature
*   **perf**: A code change that improves performance
*   **test**: Adding missing tests or correcting existing tests
*   **build**: Changes that affect the build system or external dependencies
*   **ci**: Changes to our CI configuration files and scripts
*   **chore**: Other changes that don't modify src or test files
*   **revert**: Reverts a previous commit

### Example

```
feat(auth): add password reset functionality

Implement the password reset feature via the /reset-password endpoint.

Fixes #42
```
