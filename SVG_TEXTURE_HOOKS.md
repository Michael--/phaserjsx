# SVG Texture Hooks

## Overview

New hooks for loading SVG graphics as Phaser textures with automatic cleanup and scene management.

## Features

- ✅ **No ref required** - Scene is automatically detected from component context
- ✅ **Automatic cleanup** - Textures removed from Phaser on unmount
- ✅ **Loading state** - Returns boolean `ready` flag
- ✅ **Multiple formats** - Supports raw SVG strings, data URLs, and external URLs
- ✅ **TypeScript strict** - Full type safety with JSDoc comments
- ✅ **Tested** - Unit tests included

## API

### `useSVGTexture(key, svg, width?, height?)`

Load a single SVG as a Phaser texture.

**Parameters:**

- `key: string` - Unique texture key
- `svg: string` - SVG string or URL
- `width?: number` - Texture width in pixels (default: 32)
- `height?: number` - Texture height in pixels (default: 32)

**Returns:** `boolean` - `true` when texture is loaded

**Example:**

```tsx
import bellIcon from './icons/bell.svg?raw'

function MyIcon() {
  const ready = useSVGTexture('icon-bell', bellIcon, 32, 32)
  return <Image texture={ready ? 'icon-bell' : ''} />
}
```

### `useSVGTextures(configs)`

Load multiple SVG textures in parallel.

**Parameters:**

- `configs: SVGTextureConfig[]` - Array of texture configurations

**Type:**

```typescript
interface SVGTextureConfig {
  key: string // Unique texture key
  svg: string // SVG string or URL
  width?: number // Width in pixels (default: 32)
  height?: number // Height in pixels (default: 32)
}
```

**Returns:** `boolean` - `true` when all textures are loaded

**Example:**

```tsx
import bellIcon from './icons/bell.svg?raw'
import settingsIcon from './icons/settings.svg?raw'

function MyIcons() {
  const ready = useSVGTextures([
    { key: 'icon-bell', svg: bellIcon, width: 32, height: 32 },
    { key: 'icon-settings', svg: settingsIcon, width: 24 },
  ])

  return ready ? (
    <View gap={10}>
      <Image texture="icon-bell" />
      <Image texture="icon-settings" />
    </View>
  ) : null
}
```

### `svgToTexture(scene, key, svg, width?, height?)`

Low-level utility for manual texture creation (not a hook).

**Parameters:**

- `scene: Phaser.Scene` - Phaser scene instance
- `key: string` - Unique texture key
- `svg: string` - SVG string or URL
- `width?: number` - Width in pixels (default: 32)
- `height?: number` - Height in pixels (default: 32)

**Returns:** `Promise<void>`

**Example:**

```typescript
import { svgToTexture } from '@number10/phaserjsx'

await svgToTexture(scene, 'my-icon', svgString, 64, 64)
```

## Implementation Details

### Files Created

- `packages/ui/src/utils/svg-texture.ts` - Core utility function
- `packages/ui/src/hooks.ts` - Added `useSVGTexture` and `useSVGTextures`
- `packages/ui/src/hooks-svg.test.ts` - Unit tests

### Files Modified

- `packages/ui/src/index.ts` - Exported new APIs
- `apps/test-ui/src/examples/TestExample.tsx` - Demo implementation

## How It Works

1. **Scene Detection**: Hooks extract scene from component's parent context
2. **SVG Loading**: Creates HTMLImageElement from SVG string/URL
3. **Canvas Rendering**: Renders SVG to canvas at specified dimensions
4. **Texture Registration**: Adds canvas to Phaser texture manager
5. **Cleanup**: Removes texture on component unmount

## Import

```typescript
import {
  useSVGTexture,
  useSVGTextures,
  svgToTexture,
  type SVGTextureConfig,
} from '@number10/phaserjsx'
```

## Notes

- SVG strings must start with `<svg`
- Blob URLs are automatically created and revoked for raw SVG strings
- Existing textures with same key are replaced
- All textures are cleaned up on unmount to prevent memory leaks
