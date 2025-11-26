# Icon System with Tree-Shaking

## Problem

Das ursprüngliche Icon-System verwendete statische Imports:

```typescript
import bell_fill from 'bootstrap-icons/icons/bell-fill.svg'
import boxes from 'bootstrap-icons/icons/boxes.svg'
// ... alle Icons wurden importiert

const iconRegistry: Record<IconType, string> = {
  'bell-fill': bell_fill,
  boxes: boxes,
  // ...
}
```

**Problem:** Alle importierten Icons landen im Bundle, auch wenn sie nicht verwendet werden.

## Lösung

### 1. Dynamic Imports für Tree-Shaking

Die neue Implementierung verwendet **dynamische Imports**:

```typescript
async function loadIcon(type: IconType): Promise<string> {
  // Dynamic import - Vite erstellt automatisch separate Chunks
  const module = await import(`bootstrap-icons/icons/${type}.svg`)
  return module.default as string
}
```

**Vorteil:** Nur tatsächlich verwendete Icons werden ins Bundle aufgenommen.

### 2. Type-Only Definitions

Alle 2078 Bootstrap-Icon-Namen sind als TypeScript-Type verfügbar:

```typescript
export type IconType = 'bell-fill' | 'boxes' | 'bricks' | ... // 2078 Icons
```

**Vorteil:** Vollständige Typsicherheit ohne Bundle-Impact.

### 3. Icon-Generator

Script zum automatischen Generieren der Icon-Typen:

```bash
pnpm run generate-icons
```

Generiert `apps/test-ui/src/components/icon-types.generated.ts` mit allen verfügbaren Icons.

## Verwendung

```tsx
import { Icon } from '@/components'

// Typsicher mit IntelliSense für alle 2078 Icons
<Icon type="bell-fill" size={32} />
<Icon type="boxes" size={48} />
```

## Bundle-Analyse

### Vorher (statische Imports)

- Alle importierten Icons im Bundle
- Keine Code-Splitting
- Größere Bundle-Größe

### Nachher (dynamic imports)

```
dist/assets/icons/icons/bell-fill-D7HmZJz2.js    0.47 kB
dist/assets/icons/icons/boxes-DHGjwfBQ.js        1.04 kB
dist/assets/icons/icons/bricks-C1HQY1nd.js       0.81 kB
```

- Jedes Icon in separatem Chunk
- Automatisches Lazy-Loading
- Nur verwendete Icons im Bundle

## Vite-Konfiguration

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

## Vorteile

✅ **Vollständige Typsicherheit** für alle 2078 Bootstrap Icons  
✅ **Zero Bundle Impact** für ungenutzte Icons  
✅ **Automatisches Code-Splitting** durch Vite  
✅ **Lazy Loading** on-demand  
✅ **Caching** bereits geladener Icons  
✅ **Einfache Erweiterung** durch Generator-Script

## Icon-Generator anpassen

Der Generator kann für andere Icon-Libraries angepasst werden:

```typescript
// scripts/generate-icon-types.ts
const iconsDir = join(
  process.cwd(),
  'node_modules/.pnpm/your-icon-lib@1.0.0/node_modules/your-icon-lib/icons'
)
```

Dann im Icon-Loader den Pfad anpassen:

```typescript
const module = await import(`your-icon-lib/icons/${type}.svg`)
```
