# PhaserJSX UI Documentation Site

Documentation and showcase site for @number10/phaserjsx component library.

This docs site documents the PhaserJSX 4.x line for Phaser 4. Phaser 3 projects should use `@number10/phaserjsx@0.6.1`.

Current docs target `@number10/phaserjsx@4.1.0`, including the standalone stencil clip extension for native Phaser Containers.

## Architecture

This is a **React-based** documentation site that demonstrates PhaserJSX components in live, interactive examples.

### JSX Separation Strategy

The site uses **two separate JSX runtimes** without conflicts:

- **React JSX** (`@jsxImportSource react`) - For docs UI (navigation, layout, text)
- **PhaserJSX** (`@jsxImportSource @number10/phaserjsx`) - For live component examples (Phaser canvas)

### How It Works

1. **Docs UI (React)**: Navigation, text, code samples rendered as HTML/DOM
2. **Live Examples (PhaserJSX)**: Interactive Phaser components in isolated canvas
3. **Bridge Pattern**: `LiveExample` component wraps Phaser.Game, mounts PhaserJSX components

The View documentation also includes a native Phaser stencil clip example that uses PhaserJSX only as the root mount and demonstrates direct `Container#setStencilClip(...)` usage.

## Development

```bash
pnpm install
cd apps/docs-site
pnpm run dev
```

Visit http://localhost:5173

## Status

✅ **Phase 1 Complete** - Foundation ready with JSX separation verified!
