# PhaserJSX

> Declarative Phaser3 UI framework with React-like components and TypeScript

A modern, type-safe framework for building game UIs in Phaser3 using JSX components, hooks, and a powerful theme system.

[![npm version](https://img.shields.io/npm/v/@phaserjsx/ui.svg)](https://www.npmjs.com/package/@phaserjsx/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **React-like API** - Familiar JSX syntax with hooks (useState, useEffect, useMemo, etc.)
- 🎯 **Type-Safe** - Full TypeScript support with strict type checking
- 🎨 **Powerful Theme System** - Global and component-level theming with runtime switching
- 📦 **Rich Component Library** - Button, Text, Icon, Accordion, Dropdown, CharTextInput, and more
- 🎭 **Built-in Effects** - 23+ animation effects (pulse, shake, fade, bounce, etc.)
- 📱 **Responsive Design** - Flexible layout with multiple size value formats
- 🚀 **Performance** - Optimized VDOM reconciliation with smart dirty checking

## 📚 Documentation

**Full documentation:** [https://yourusername.github.io/phaserjsx](https://yourusername.github.io/phaserjsx)

- [Quick Start Guide](https://yourusername.github.io/phaserjsx/quick-start)
- [Layout Patterns](https://yourusername.github.io/phaserjsx/guides/layout-patterns)
- [Theme System](https://yourusername.github.io/phaserjsx/guides/theme-system)
- [Components](https://yourusername.github.io/phaserjsx/components)
- [API Reference](https://yourusername.github.io/phaserjsx/api/hooks)

## 📦 Packages

This monorepo contains:

- **[@phaserjsx/ui](./packages/ui)** - Core UI framework library ([npm](https://www.npmjs.com/package/@phaserjsx/ui))
- **[docs-site](./apps/docs-site)** - Documentation website (GitHub Pages)
- **[test-ui](./apps/test-ui)** - Development playground and testing app

## 🚀 Getting Started for Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/phaserjsx.git
cd phaserjsx

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

## 🛠️ Development

```bash
# Run development server (test-ui app)
pnpm dev

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck

# Check tooling versions
pnpm doctor
```

## 📝 Scripts

- `pnpm dev` - Start the test-ui development server
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format all code with Prettier
- `pnpm typecheck` - Type check all TypeScript files
- `pnpm changeset` - Create a new changeset for versioning
- `pnpm release` - Version and publish packages

## 🏗️ Project Structure

```
phaserjsx/
├── .github/workflows/     # GitHub Actions CI/CD
├── .husky/                # Git hooks
├── .changeset/            # Changesets configuration
├── packages/
│   └── ui/                # @phaserjsx/ui core library
├── apps/
│   └── test-ui/           # @phaserjsx/test-ui playground app
├── package.json           # Root package manifest
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── tsconfig.base.json     # Shared TypeScript configuration
```

## 🔧 Tooling

This project uses:

- **pnpm** - Fast, efficient package manager with workspace support
- **TypeScript** - Type-safe JavaScript with strict mode enabled
- **Vite** - Lightning-fast build tool and dev server
- **Vitest** - Fast unit testing framework
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks
- **lint-staged** - Run linters on staged files
- **Commitlint** - Conventional commit messages
- **Changesets** - Version management and publishing

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm changeset` to document your changes
4. Commit using conventional commits format
5. Open a pull request

## 📄 License

MIT

## 🔗 Links

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
