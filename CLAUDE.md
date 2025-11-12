# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Common Development Commands

### Application Development
- `pnpm start` - Start the Electron app in development mode with HMR
- `pnpm package` - Package the application into an executable bundle
- `pnpm make` - Create distributable installers (e.g., .exe, .dmg)
- `pnpm publish` - Publish the packaged application

### Code Quality
- `pnpm format` - Format all code with Biome
- `pnpm lint` - Lint all code with Biome
- `pnpm check` - Run Biome format, lint, and check in one command

### Testing
- `pnpm test` - Run all unit tests with Vitest
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test:unit` - Alias for `pnpm test`
- `pnpm test:e2e` - Run all end-to-end tests with Playwright (requires packaged app)
- `pnpm test:all` - Run both unit and e2e tests

### Storybook
- `pnpm storybook` - Start the Storybook development server on port 6006
- `pnpm build-storybook` - Build Storybook as a static web application

## 📦 Project Architecture

This is an Electron application following the **three-process model**:

### Main Process (`src/main/`)
- **Purpose**: Node.js process that manages the application lifecycle and creates browser windows
- **Key file**: `src/main/index.ts`
- **Security**: Implements Electron Fuses for enhanced security (asar validation, cookie encryption, etc.)
- **IPC**: Listens for IPC messages and handles system-level operations

### Preload Process (`src/preload/`)
- **Purpose**: Secure bridge between main and renderer processes
- **Key file**: `src/preload/index.ts`
- **Architecture**: Uses contextBridge to expose APIs to renderer
- **Pattern**: Exposes typed contexts for specific features (window management, theme switching)

### Renderer Process (`src/renderer/`)
- **Purpose**: React application running in a Chromium browser window
- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **UI**: shadcn/ui + Tailwind CSS
- **Features**: Theme switching, internationalization (i18next)

### Shared Code (`src/shared/`)
- **IPC Channel Definitions**: Shared constants for IPC communication
- **Types**: Cross-process type definitions (e.g., `themeMode.ts`)
- **Utilities**: Platform-agnostic helper functions

## 🔌 Inter-Process Communication (IPC) Pattern

IPC communication follows a **channel-based pattern**:

1. **Channel Definition**: Defined in `src/shared/ipc/` as constants
   - Example: `THEME_MODE_TOGGLE_CHANNEL = 'theme-mode:toggle'`

2. **Main Process Listeners**: Registered in `src/main/ipc/`
   - Theme listeners: `src/main/ipc/themeListeners.ts`
   - Window listeners: `src/main/ipc/windowListeners.ts`

3. **Preload Context Exposure**: Implemented in `src/preload/ipc/`
   - ContextBridge API exposure
   - Typed methods for renderer

4. **Renderer Usage**: Call exposed APIs directly
   - Example: `window.theme.toggle()`

## 📁 Key Directory Structure

```
src/
├── main/              # Main process (Node.js)
│   ├── index.ts       # App entry point, window creation
│   ├── ipc/           # IPC listeners
│   └── lib/           # Window management utilities
├── preload/           # Preload script (context bridge)
│   ├── index.ts       # Entry point, exposes contexts
│   ├── ipc/           # Context exposure logic
│   └── lib/           # Bridge utilities
├── renderer/          # UI application (React)
│   ├── components/    # React components
│   │   └── ui/        # shadcn/ui components
│   ├── layouts/       # Layout components
│   ├── routes/        # TanStack Router routes
│   ├── theme/         # Theme management
│   ├── localization/  # i18next configuration
│   └── utils/         # Router setup, utilities
├── shared/            # Cross-process code
│   ├── ipc/           # IPC channel constants
│   ├── types/         # Shared types
│   └── utils/         # Shared utilities
└── tests/             # Test suites
    ├── unit/          # Vitest tests
    └── e2e/           # Playwright E2E tests
```

## 🧪 Testing Strategy

The project follows the **Testing Pyramid**:

### 1. Storybook (Visual/Integration)
- **Location**: Component files co-located with `*.stories.tsx`
- **Command**: `pnpm storybook`
- **Purpose**: Develop and test UI components in isolation
- **Coverage**: Includes accessibility testing (addon-a11y)

### 2. Vitest (Unit/Integration)
- **Location**: `src/tests/unit/`
- **Command**: `pnpm test`
- **Test Runner**: Browser mode with jsdom environment
- **Coverage**: V8 provider, reports to `coverage/`
- **Integration**: Tests Storybook stories via `@storybook/addon-vitest`

### 3. Playwright (E2E)
- **Location**: `src/tests/e2e/`
- **Command**: `pnpm test:e2e`
- **Target**: Packaged Electron application
- **Helper**: `electron-playwright-helpers` for launching the packaged app

## 🎨 Code Conventions

### Path Aliases
All imports use absolute path aliases:
- `@/main/*` - Main process code
- `@/preload/*` - Preload script code
- `@/renderer/*` - Renderer code
- `@/shared/*` - Shared code
- `@/components/*` - UI components
- `@/routes/*` - Route files
- `@/theme/*` - Theme utilities
- `@/localization/*` - i18n utilities

**Rule**: Use `@/` for imports outside current directory, `./` for siblings. **Never use `../`**.

### Biome Configuration
- **Formatter**: 2-space indent, 100 character line width
- **Quotes**: Single quotes for JS/TS, double quotes for JSX
- **Semicolons**: Always
- **Linting**: Recommended rules + no-explicit-any warning

### Commit Convention
Follow **Conventional Commits**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no logic changes)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

## ⚙️ Key Configuration Files

### TypeScript (`tsconfig.json`)
- Path aliases configured for all major directories
- Strict mode enabled
- Module resolution: "bundler"

### Vite Configs (`.mts` files)
- `vite.main.config.mts` - Main process build (simple config with tsconfigPaths)
- `vite.preload.config.mts` - Preload script build (simple config with tsconfigPaths)
- `vite.renderer.config.mts` - Renderer build (includes TanStack Router plugin, React Compiler, TailwindCSS)
- **TanStack Router Plugin**: Auto code splitting enabled, routes in `./src/renderer/routes`, generates `./src/renderer/routeTree.gen.ts`
- **React Compiler**: Uses `babel-plugin-react-compiler` for React 19
- **TailwindCSS**: Integrated via `@tailwindcss/vite`
- Shared via Electron Forge Vite plugin

### Electron Forge (`forge.config.ts`)
- **Packager**: ASAR enabled
- **Makers**: Squirrel.Windows, ZIP (darwin), RPM, DEB
- **Plugins**: VitePlugin, FusesPlugin (security)

### shadcn/ui (`components.json`)
- **UI Components**: `@/renderer/components/ui`
- **Utilities**: `@/renderer/utils/tailwind`
- **Icons**: Lucide React
- **CSS Variables**: Enabled in `src/renderer/styles/global.css`
- **Base Color**: Slate

### Vitest (`vitest.config.ts`)
- jsdom environment for React components
- Storybook integration for visual testing
- Coverage reports in multiple formats

### Playwright (`playwright.config.ts`)
- HTML reporter
- Chromium only (configurable)
- Retries enabled in CI

## 🌐 Routing

The app uses **TanStack Router** with file-based routing:
- **Root route**: `src/renderer/routes/__root.tsx`
- **Index route**: `src/renderer/routes/index.tsx`
- **Second route**: `src/renderer/routes/second.tsx`
- **Router setup**: `src/renderer/utils/routes.ts`
- **Generated file**: `src/renderer/routeTree.gen.ts` (auto-generated by TanStack Router plugin, do not edit)

## 🎨 Theme & Localization

### Theme Management (`src/renderer/theme/`)
- Service-based theme management
- Syncs with Electron's native APIs
- OS theme detection

### Internationalization (`src/renderer/localization/`)
- i18next for translations
- Language toggle component
- Service-based language management

## 🔧 Development Tips

1. **HMR**: Vite provides instant HMR for both renderer and main processes during `pnpm start`

2. **Preload Scripts**: All APIs exposed to renderer must be defined in `src/preload/ipc/` and bridge setup in `src/preload/lib/contextExposer.ts`

3. **Storybook Co-location**: Place `*.stories.tsx` files next to components for better organization

4. **E2E Testing**: Playwright tests require the app to be packaged first (`pnpm make`)

5. **Type Safety**: Shared types belong in `src/shared/types/` to ensure type safety across processes

6. **Security**: The app enables Electron Fuses for production security. See `forge.config.ts:36-44`

## 📚 Resources

- [Electron Forge](https://www.electronforge.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Router](https://tanstack.com/router)
- [Biome](https://biomejs.dev/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
