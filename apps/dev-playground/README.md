# PhaserJSX Dev Playground

Focused development environment for testing new PhaserJSX features.

## Purpose

This app is a lightweight playground for:

- Testing new features in development
- Experimenting with specific components
- Quick prototyping without the overhead of test-ui

Unlike `test-ui` which contains comprehensive examples, this playground is intentionally minimal and focused on current development tasks.

## Development

```bash
# Start dev server (port 5174)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Structure

- `src/main.ts` - Phaser initialization with standard mountJSX
- `src/App.tsx` - Main app component (customize for your tests)
- `public/assets/` - Asset files (add as needed)

## Notes

- Builds directly against `@number10/phaserjsx` workspace package
- Uses different port (5174) to avoid conflict with test-ui (5173)
- Darker background (#2a2a2a) to distinguish from test-ui visually
