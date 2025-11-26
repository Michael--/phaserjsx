# Icon System with Tree-Shaking

## Problem

The original icon system used static imports:

```typescript
import bell_fill from 'bootstrap-icons/icons/bell-fill.svg'
import boxes from 'bootstrap-icons/icons/boxes.svg'
// ... all icons were imported

const iconRegistry: Record<IconType, string> = {
  'bell-fill': bell_fill,
  boxes: boxes,
  // ...
}
```

**Problem:** All imported icons end up in the bundle, even if they are not used.

## Solution

### 1. Manual Icon Registration for Real Tree-Shaking

The final implementation uses **explicit icon registration**:

```typescript
const iconLoaders: Record<string, () => Promise<{ default: string }>> = {
  'bell-fill': () => import('bootstrap-icons/icons/bell-fill.svg'),
  boxes: () => import('bootstrap-icons/icons/boxes.svg'),
  // only registered icons are bundled
}

async function loadIcon(type: IconType): Promise<string> {
  const loader = iconLoaders[type]
  if (!loader) {
    throw new Error(`Icon not registered: ${type}`)
  }
  const module = await loader()
  return module.default
}
```

**Advantage:** Only explicitly registered icons are included in the bundle.

**Note:** `import.meta.glob()` does not work for tree-shaking because Vite bundles all matched files at build time.

### 2. Type-Only Definitions

All 2078 Bootstrap icon names are available as TypeScript types:

```typescript
export type IconType = 'bell-fill' | 'boxes' | 'bricks' | ... // 2078 Icons
```

**Advantage:** Full type safety without bundle impact.

### 3. Icon Generator

Script for automatically generating icon types:

```bash
pnpm run generate-icons
```

Generates `apps/test-ui/src/components/icon-types.generated.ts` with all available icons.

## Usage

```tsx
import { Icon } from '@/components'

// Type-safe with IntelliSense for all 2078 icons
<Icon type="bell-fill" size={32} />
<Icon type="boxes" size={48} />
```

## Bundle Analysis

### Before (static imports)

- All imported icons in the bundle
- No code splitting
- Larger bundle size

### After (dynamic imports)

```
dist/assets/icons/icons/bell-fill-D7HmZJz2.js    0.47 kB
dist/assets/icons/icons/boxes-DHGjwfBQ.js        1.04 kB
dist/assets/icons/icons/bricks-C1HQY1nd.js       0.81 kB
```

- Each icon in separate chunk
- Automatic lazy loading
- Only used icons in the bundle

## Vite Configuration

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('bootstrap-icons/icons/')) {
          const iconName = id.match(/icons\/([^.]+)\.svg/)?.[1]
          return iconName ? `icons/${iconName}` : undefined
        }
      },
    },
  },
}
```

## Advantages

✅ **Full type safety** for all 2078 Bootstrap Icons  
✅ **Zero bundle impact** for unused icons  
✅ **Automatic code splitting** through Vite  
✅ **Lazy loading** on-demand  
✅ **Caching** of already loaded icons  
✅ **Easy extension** through generator script

## Adapting the Icon Generator

The generator can be adapted for other icon libraries:

```typescript
// scripts/generate-icon-types.ts
const iconsDir = join(
  process.cwd(),
  'node_modules/.pnpm/your-icon-lib@1.0.0/node_modules/your-icon-lib/icons'
)
```

Then adjust the path in the icon loader:

```typescript
const module = await import(`your-icon-lib/icons/${type}.svg`)
```
