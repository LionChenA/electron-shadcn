[![CI/CD Status](https://github.com/LuanRoger/electron-shadcn/actions/workflows/testing.yml/badge.svg)](https://github.com/LuanRoger/electron-shadcn/actions/workflows/testing.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

# electron-shadcn

A production-ready, feature-rich scaffold for building beautiful, modern desktop applications with Electron, React, and Shadcn/UI.

## ✨ Core Philosophy

This template aims to provide a solution that balances a **premium developer experience** with **high-quality output**.

- 🚀 **Lightning-Fast Development**: Instant Hot Module Replacement (HMR) powered by Vite, combined with isolated component development in Storybook, lets you focus on creating.
- 💅 **Exquisite UI Out-of-the-Box**: Comes with Shadcn/UI and Tailwind CSS, with pre-configured features like theme switching and internationalization.
- ✅ **Rock-Solid Code Quality**: Guarantees code standards from the source with TypeScript, Biome (Linter & Formatter), and Husky (Git Hooks).
- 🧪 **Layered Testing, Full Confidence**: Follows the "Testing Pyramid" strategy, integrating Storybook (Visual), Vitest (Unit/Integration), and Playwright (End-to-End) for robust application testing.

## 📸 Overview

![Demo GIF](https://github.com/LuanRoger/electron-shadcn/blob/main/images/demo.gif)

## 📖 Table of Contents

- [electron-shadcn](#electron-shadcn)
  - [✨ Core Philosophy](#-core-philosophy)
  - [📸 Overview](#-overview)
  - [📖 Table of Contents](#-table-of-contents)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Getting Started](#-getting-started)
  - [📖 Key Concepts \& Conventions](#-key-concepts--conventions)
    - [1. Project Structure](#1-project-structure)
    - [2. Testing Strategy](#2-testing-strategy)
    - [3. Storybook Workflow](#3-storybook-workflow)
    - [4. Code Style \& Import Rules](#4-code-style--import-rules)
  - [📜 Available Scripts](#-available-scripts)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🛠️ Tech Stack

| Category                 | Technology                                                  |
| :----------------------- | :---------------------------------------------------------- |
| **Core**                 | Electron 39, Vite 7                                         |
| **UI**                   | React 19.2, Shadcn/UI, Tailwind CSS, i18next, TanStack Router |
| **Developer Experience** | TypeScript, Biome, oRPC, Storybook                          |
| **Testing**              | Vitest 4, React Testing Library, Playwright                 |
| **Packaging**            | Electron Forge                                              |

## 🚀 Getting Started

1.  **Clone or use as a template**

    ```bash
    git clone https://github.com/LionChenA/electron-shadcn.git
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    ```

3.  **Run the app**

    ```bash
    pnpm run start
    ```

## 📖 Key Concepts & Conventions

This section details the important design decisions and standards for this project.

### 1. Project Structure

The `src` directory is divided into three main parts, following the standard Electron architecture:
- `main`: Code for the main process (node environment).
- `preload`: Scripts that bridge the gap between the main and renderer processes.
- `renderer`: The user interface code (browser environment).

### 2. Testing Strategy

We follow the **Testing Pyramid** model:
- **Visual Testing (Storybook)**: Develop components in isolation and use stories as the basis for visual regression testing.
- **Unit/Integration Testing (Vitest)**: Test individual functions, components, and their interactions, including IPC communication.
- **End-to-End Testing (Playwright)**: Test critical user journeys in the final, packaged application.

### 3. Storybook Workflow

- Run `pnpm storybook` to start the development server.
- **Co-location**: Story files (`*.stories.tsx`) are located next to their corresponding component files. This keeps all component-related code in one place.

### 4. Code Style & Import Rules

- **Path Aliases**: Always prefer absolute aliases (`@/`) for imports outside the current directory. Use relative paths (`./`) only for sibling files. **Avoid `../` entirely.**
- **Import Order**: Automatically enforced by Biome on save.

## 📜 Available Scripts

| Command                | Description                                          |
| :--------------------- | :--------------------------------------------------- |
| `pnpm start`           | Starts the app in development mode.                  |
| `pnpm package`         | Packages the application into an executable bundle.  |
| `pnpm make`            | Creates distributable installers (e.g., .exe, .dmg). |
| `pnpm check`           | Runs Biome to check for formatting and lint issues.  |
| `pnpm test`            | Runs all unit tests with Vitest.                     |
| `pnpm test:e2e`        | Runs all end-to-end tests with Playwright.           |
| `pnpm storybook`       | Starts the Storybook development server.             |
| `pnpm build-storybook` | Builds Storybook as a static web application.        |

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our [**CONTRIBUTING.md**](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.