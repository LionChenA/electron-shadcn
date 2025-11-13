# Project Context

## Purpose

**Project Name:** electron-shadcn Template

**Description:** A production-ready, feature-rich scaffold for building beautiful, modern desktop applications with Electron, React, and Shadcn/UI.

**Core Philosophy:**
- 🚀 **Lightning-Fast Development**: Instant HMR powered by Vite + isolated component development in Storybook
- 💅 **Exquisite UI Out-of-the-Box**: Shadcn/UI + Tailwind CSS with theme switching and i18n
- ✅ **Rock-Solid Code Quality**: TypeScript, Biome (linter & formatter), Husky (git hooks)
- 🧪 **Layered Testing**: Testing Pyramid strategy - Storybook (Visual), Vitest (Unit/Integration), Playwright (E2E)

**Author:** ROG <luan.roger.2003@gmail.com>
**License:** MIT

## Tech Stack

### Core Technologies
- **Desktop Framework**: Electron 38.2.1
- **Build Tool**: Vite 7.1.9
- **UI Library**: React 19.1.1
- **Language**: TypeScript 5.9.2

### UI & Styling
- **Component Library**: Shadcn/UI with Radix UI primitives
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: Lucide React 0.544.0
- **Animations**: tailwindcss-animate 1.0.7
- **Variant Handling**: class-variance-authority 0.7.1

### Developer Experience
- **Linter & Formatter**: Biome 2.2.4
- **Documentation**: Storybook 9.1.10
- **Path Aliases**: 14 configured aliases (e.g., `@/main/*`, `@/renderer/*`, `@/components/*`)

### Routing & State
- **Routing**: TanStack React Router 1.132.47 with file-based routing
- **Data Fetching**: TanStack React Query 5.90.2

### Internationalization
- **i18n**: i18next 25.5.2 + react-i18next 16.0.0
- **Languages**: English (en), Portuguese Brazilian (pt-BR)

### Packaging & Distribution
- **Packaging**: Electron Forge 7.9.0
- **Platform Targets**: Windows (Squirrel), macOS (ZIP/DMG), Linux (RPM/DEB)
- **Fuses**: Electron Fuses for security hardening

### Development Tools
- **Git Hooks**: Husky 9.1.7 (pre-commit runs `npm run check`)
- **Package Manager**: pnpm

## Project Conventions

### Code Style

**Biome Configuration (biome.json):**

**Formatting:**
- Indent style: 2 spaces
- Line width: 100 characters
- JavaScript: Single quotes, semicolons always
- Trailing commas: All (JS), None (JSON)

**Linting:**
- Recommended rules enabled
- `noExplicitAny`: Warning level
- CSS: Unknown at-rules disabled for Tailwind

**Path Aliases**: Use absolute aliases with `@/` prefix
- `@/main/*` → `src/main/*`
- `@/renderer/*` → `src/renderer/*`
- `@/preload/*` → `src/preload/*`
- `@/shared/*` → `src/shared/*`
- Specialized: `@/components/*`, `@/layouts/*`, `@/routes/*`, `@/ui/*`

**Naming Conventions:**
- Files: kebab-case (e.g., `listeners-register.ts`)
- Components: PascalCase (e.g., `ToggleTheme.tsx`)
- Functions/variables: camelCase (e.g., `syncThemeWithLocal`)
- Constants: UPPER_SNAKE_CASE (e.g., `THEME_MODE_CURRENT_CHANNEL`)
- Types/interfaces: PascalCase (e.g., `ThemePreferences`)

### Architecture Patterns

**Standard Electron 3-Process Architecture:**

```
src/
├── main/          # Main process (Node.js) - Electron app lifecycle, window management
├── preload/       # Preload scripts - Secure bridge between main and renderer
├── renderer/      # UI (Chromium) - React application
├── shared/        # Shared code - Types, IPC definitions, utilities
├── tests/         # Testing - Unit, integration, and e2e tests
└── stories/       # Storybook - Visual component documentation
```

**Key Architectural Patterns:**

1. **IPC Communication**: Structured via channels in `src/shared/ipc/`
   - Theme management: `theme-mode:*` channels
   - Window management: `window:*` channels

2. **File-Based Routing**: TanStack Router with auto-generated route tree
   - Routes in `src/renderer/routes/*.tsx`
   - Auto-generated `routeTree.gen.ts`

3. **Context Isolation**: Preload scripts expose controlled APIs via `contextBridge`
   - Theme API: `window.themeMode`
   - Window API: `window.windowControls`

4. **Security Hardening**:
   - Context isolation enabled
   - Electron Fuses configured
   - ASAR packaging enabled

### Testing Strategy

**Testing Pyramid Approach:**

**1. Visual Testing (Storybook)**
- Storybook 9.1.10 with Vite builder
- Stories co-located with components (e.g., `Button.stories.tsx` beside `Button.tsx`)
- Addon integrations: a11y, docs, onboarding, vitest
- Vitest integration for story testing with Playwright

**2. Unit & Integration Testing (Vitest)**
- Testing framework: Vitest 3.2.4
- Environment: jsdom
- Location: `src/tests/unit/`
- Setup file: `src/tests/unit/setup.ts`
- Coverage: V8 provider (text, json, html reports)
- Test examples:
  - Component rendering tests (ToggleTheme.test.tsx)
  - Utility tests (sum.test.ts)

**3. End-to-End Testing (Playwright)**
- Playwright 1.56.0
- Location: `src/tests/e2e/`
- Tests packaged Electron app (runs `npm run make` first)
- Platform: Windows (GitHub Actions)
- Report: HTML with artifacts retention

**Test Commands:**
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode for unit tests
- `npm run test:unit` - Unit/integration tests only
- `npm run test:e2e` - End-to-end tests only
- `npm run test:all` - Run both unit and e2e tests

### Git Workflow

**Branching Strategy:**
- `main` - Production branch
- `dev` - Development branch
- Feature branches: e.g., `feat/routing`, `feat/attempt-chrome-extensions-integration`

**Remotes:**
- `origin`: `git@github.com:LionChenA/electron-shadcn.git`
- `upstream`: `git@github.com:LuanRoger/electron-shadcn.git`

**Commit Convention: Conventional Commits**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no logic changes)
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

**Git Hooks:**
- Husky pre-commit hook runs `npm run check` (Biome format + lint)

**CI/CD:**
- `.github/workflows/testing.yaml` - Runs on push to main and PR to main
- Unit tests (Ubuntu, Node 22)
- E2E tests (Windows, Node 22, requires `npm run make`)

## Domain Context

This is a **desktop application template** designed for developers who want to build cross-platform desktop apps with modern web technologies. It's particularly suited for:

- Applications requiring native desktop features (file system, window management, system tray)
- Projects needing a polished, professional UI out of the box
- Teams that value code quality and comprehensive testing
- Developers who want i18n support and theme customization
- Applications that need secure IPC communication between renderer and main processes

**Key Domain Concepts:**
- **Window Management**: Custom window controls with draggable regions, minimizing, maximizing, closing
- **Theme System**: Dark/light mode with system preference detection and persistence
- **Internationalization**: Dynamic language switching with react-i18next
- **Component Library**: Shadcn/UI components pre-configured with proper TypeScript types
- **Security**: Electron context isolation, secure IPC, and fuse configuration

## Important Constraints

**Security Constraints:**
- Context isolation must remain enabled
- Preload scripts must use `contextBridge` - direct `window` access forbidden
- IPC channels must be typed and validated
- Electron Fuses security features must remain enabled
- No external scripts or eval() usage

**Technical Constraints:**
- TypeScript strict mode enabled
- All code must pass Biome linting
- 100% test coverage not required but unit tests for utilities/components expected
- All new components should have Storybook stories
- Routes must follow file-based routing conventions

**Build Constraints:**
- Must support Windows, macOS, and Linux
- ASAR packaging enabled
- Electron Forge for packaging and distribution

**Code Quality Constraints:**
- Pre-commit hooks enforce formatting and linting
- No `any` types (Biome warning if used)
- Imports must use path aliases, not relative imports
- All components must have proper TypeScript types

## External Dependencies

**Environment Configuration:**
```bash
SECURITY_LEVEL=development
SCREENSHOT_ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000
```

**Electron Security Fuses:**
- `RunAsNode`: Disabled
- `EnableCookieEncryption`: Enabled
- `EnableNodeOptionsEnvironmentVariable`: Disabled
- `EnableNodeCliInspectArguments`: Disabled
- `EnableEmbeddedAsarIntegrityValidation`: Enabled
- `OnlyLoadAppFromAsar`: Enabled

**No External APIs or Services:**
The project is a template/scaffold with no built-in external dependencies on:
- No backend services
- No cloud providers
- No third-party APIs
- No databases

**All dependencies are build-time or UI libraries.**
