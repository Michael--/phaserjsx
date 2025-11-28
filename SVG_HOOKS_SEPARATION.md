# SVG Hooks Separation

## Overview

SVG texture hooks have been separated from `hooks.ts` into their own module `hooks-svg.ts` to maintain global texture management, which is necessary because Phaser's TextureManager is inherently global.

## Why Separate?

When implementing multi-mount support with `RenderContext`, most hooks needed per-mount isolation (useState, useEffect, etc.). However, **SVG textures must remain globally managed** because:

1. Phaser's `TextureManager` is global per game instance
2. Textures are shared resources that should be reused across multiple UI mounts
3. Preventing duplicate texture loading and memory waste

## What Was Moved

### From `hooks.ts` → `hooks-svg.ts`

- `useSVGTexture(key, svg, width, height)` - Load single SVG texture
- `useSVGTextures(configs)` - Load multiple SVG textures
- `SVGTextureConfig` interface

### Changes to `hooks-svg.ts`

- Uses global `textureRegistry` (not context-specific)
- Gets Phaser scene from `window.__phaserScene` global
- Manages texture lifecycle globally across all mounts

### Changes to `hooks.ts`

- Removed all SVG-related functions and types
- Added comment directing developers to `hooks-svg.ts`
- Removed unused `Phaser` import

### Changes to `index.ts`

- Added `export * from './hooks-svg'`
- Updated `SVGTextureConfig` export from `./hooks-svg` instead of `./hooks`

## Usage

### Before (all from hooks.ts)

```typescript
import { useSVGTexture, useState } from '@phaserjsx/ui'
```

### After (automatic, no change needed)

```typescript
// Still works - exports forwarded from index.ts
import { useSVGTexture, useState } from '@phaserjsx/ui'
```

### Direct Import (if preferred)

```typescript
import { useSVGTexture, type SVGTextureConfig } from '@phaserjsx/ui/hooks-svg'
import { useState } from '@phaserjsx/ui/hooks'
```

## File Structure

```
packages/ui/src/
├── hooks.ts              # Core hooks with RenderContext isolation
├── hooks-svg.ts          # SVG texture hooks with global management (NEW)
├── index.ts              # Exports both modules
└── utils/
    ├── texture-registry.ts  # Global texture registry
    └── svg-texture.ts       # SVG to Phaser texture conversion
```

## Implementation Details

### Global Texture Registry

```typescript
// hooks-svg.ts uses global registry
import { textureRegistry } from './utils/texture-registry'

export function useSVGTexture(key, svg, width, height) {
  // textureRegistry is shared across all mounts
  const scene = window.__phaserScene

  useEffect(() => {
    textureRegistry.loadTexture(key, svg, width, height)
    return () => textureRegistry.releaseTexture(key)
  }, [key, svg, width, height])
}
```

### Per-Mount Hook Context

```typescript
// hooks.ts uses RenderContext for isolation
export function useState<T>(init: T) {
  const ctx = getCurrent() // Gets context from RenderContext
  // Each mount has its own state
}
```

## Benefits

1. **Clear Separation**: Texture management vs. component state
2. **Prevents Data Theft**: "Sonst passiert das die eine mountJSX Instance der anderen die Daten klaut!"
3. **Performance**: Shared textures across mounts, no duplication
4. **Maintainability**: SVG hooks can evolve independently

## Testing

Dual mount now works correctly:

```typescript
// main.ts - Both mounts share same textures
mountJSX(scene, <App />)
mountJSX(scene.add.container(500, 0), <App />)

// Icon components in both mounts use same global textures
```

## Migration Notes

No migration needed for existing code - exports are forwarded from `index.ts`.

## Commit Message

```
refactor: separate SVG hooks to hooks-svg.ts for global texture management

- Move useSVGTexture and useSVGTextures to hooks-svg.ts
- Use global textureRegistry instead of context-specific
- Prevent texture data theft between mountJSX instances
- Export hooks-svg from index.ts for backward compatibility
```
