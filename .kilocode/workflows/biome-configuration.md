# Workflow: Biome Configuration

## Objective
*To provide a step-by-step guide for installing, configuring, and using Biome as a code linter and formatter.*

## Trigger
*When a project needs to set up or reconfigure Biome for code quality.*

## Pre-checks
- None

## Steps

1.  **Install Biome**
    *   **Details**: Add Biome to your project as a development dependency. Using the `-E` flag ensures that the exact version is saved in your `package.json`.
    *   **Command/Code**:
        ```bash
        npm i -D -E @biomejs/biome
        ```

2.  **Initialize Configuration**
    *   **Details**: Create a default `biome.json` configuration file in the root of your project.
    *   **Command/Code**:
        ```bash
        npx @biomejs/biome init
        ```

3.  **Configure biome.json**
    *   **Details**: Modify the `biome.json` file to suit your project's needs. A key concept in modern Biome versions is that the `files.includes` array is used for both including and excluding files. To exclude a file or directory, prepend the pattern with `!`. The example below is a comprehensive configuration for a modern TypeScript project.
    *   **Path**: `biome.json`
    *   **Content**:
        ```json
        {
          "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
          "organizeImports": {
            "enabled": true
          },
          "files": {
            "include": [
              "src/**/*",
              "*.ts",
              "*.mts",
              "!dist",
              "!node_modules"
            ]
          },
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
            "globals": ["node"],
            "formatter": {
              "quoteStyle": "double",
              "semicolons": "always",
              "trailingCommas": "all"
            }
          }
        }
        ```

4.  **Add Scripts to package.json**
    *   **Details**: For convenience, add Biome commands to the `scripts` section of your `package.json`. This allows you to run them easily with `npm run <script_name>`.
    *   **Path**: `package.json`
    *   **Content**:
        ```json
        {
          "scripts": {
            "format": "npx @biomejs/biome format --write .",
            "lint": "npx @biomejs/biome lint --write .",
            "check": "npx @biomejs/biome check --write ."
          }
        }
        ```

## Validation

**Success Criteria:**
*   Running biome commands (e.g., `npx @biomejs/biome check .`) executes without errors.

---