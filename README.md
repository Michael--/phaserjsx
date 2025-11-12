# phaserjsx

> Declarative Phaser3 + rexUI framework with TypeScript

A modern, type-safe, declarative framework for building Phaser3 games with rexUI components.

## 🚀 Getting Started

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

## 📦 Packages

This monorepo contains the following packages:

- **[@phaserjsx/ui](./packages/ui)** - Core library for declarative Phaser3 + rexUI rendering
- **[@phaserjsx/test-ui](./apps/test-ui)** - Test and playground application

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
- [rexUI Documentation](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/)
