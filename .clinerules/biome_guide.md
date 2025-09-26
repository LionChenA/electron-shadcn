# Biome Usage and Configuration Guide

This document provides a general guide for installing, configuring, and using Biome as a linter and formatter in a project.

## Installation

To add Biome to your project, install it as a development dependency. Using `-E` ensures an exact version is saved in your `package.json`.

```bash
npm i -D -E @biomejs/biome
```

After installation, you can create a default `biome.json` configuration file in your project root:

```bash
npx @biomejs/biome init
```

## IDE Integration

For the best experience, it is highly recommended to install the Biome extension for your code editor. This provides real-time feedback and allows for formatting on save.

*   **VS Code**: Search for "Biome" in the Extensions marketplace and install the official extension.

## Common Commands

You can run Biome directly from the command line to format, lint, and check your code.

*   **Format all files**:
    ```bash
    npx @biomejs/biome format --write .
    ```

*   **Lint and apply safe fixes**:
    ```bash
    npx @biomejs/biome lint --write .
    ```

*   **Check (Format, Lint, Organize Imports) and apply fixes**:
    ```bash
    npx @biomejs/biome check --write .
    ```

It is common practice to add these commands to the `scripts` section of your `package.json` for easier access (e.g., `npm run format`, `npm run lint`).

## Configuration (`biome.json`)

The `biome.json` file is the central point for configuring Biome. Here are some key configuration concepts:

*   **Ignoring Files**: To prevent Biome from checking certain files or directories (like build outputs or `node_modules`), use the `files.includes` property. It accepts an array of glob patterns. To ignore a directory, first include all files with `"**"` and then exclude the desired directory with a negated pattern, like `"!dist"`.

    ```json
    "files": {
      "includes": ["**", "!dist"]
    }
    ```

*   **Overriding Rules**: Biome allows you to override rules for specific files. This is useful for handling language-specific syntax or disabling rules for certain parts of your codebase. For example, to disable a rule for all CSS files:

    ```json
    "overrides": [
      {
        "includes": ["**/*.css"],
        "linter": {
          "rules": {
            "suspicious": {
              "noUnknownAtRules": "off"
            }
          }
        }
      }
    ]
    ```

*   **Formatter and Linter Settings**: You can configure the formatter (e.g., `indentStyle`, `indentWidth`) and linter (e.g., enabling `recommended` rules) under the `formatter` and `linter` keys respectively. Language-specific settings can be configured under keys like `javascript`, `css`, etc.

## Example `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/stable/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  }
}
```

## Documentation Resources

For more detailed information, always refer to the official Biome documentation:

*   **Getting Started Guide**: [https://biomejs.dev/guides/getting-started/](https://biomejs.dev/guides/getting-started/)
*   **Configuration Reference**: [https://biomejs.dev/reference/configuration/](https://biomejs.dev/reference/configuration/)
*   **Rules**: [https://biomejs.dev/linter/rules/](https://biomejs.dev/linter/rules/)
