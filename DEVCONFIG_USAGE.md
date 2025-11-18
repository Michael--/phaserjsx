# DevConfig Usage Guide

## 🎯 Runtime Development Configuration

The **DevConfig** system enables runtime-configurable debug and development settings without recompilation.

---

## 📦 Installation & Import

```typescript
// In App.tsx or main.ts
import { DevConfig, DevPresets, DebugLogger } from '@phaserjsx/ui'
```

---

## 🚀 Quick Start – Presets

### Debug overflow masks

```typescript
import { DevPresets } from '@phaserjsx/ui'

// Makes overflow masks visible (pink, semi-transparent)
DevPresets.debugOverflow()

// Console:
// [overflowMask] Created overflow mask
// [overflowMask] Updated overflow mask world position: { x: 100, y: 200, ... }
```

### Debug layout issues

```typescript
DevPresets.debugLayout()

// Console:
// [layout] Container with 5 children
//   [layout] Direction: column, Padding: { top: 10, right: 10, ... }
//   [layout] Pre-calculated container size: { width: 200, height: 300 }
//   [positioning] Child 0 positioned at: { x: 10, y: 10 }
```

### Performance profiling

```typescript
DevPresets.profilePerformance()

// Console:
// [performance] calculateLayout: 2.3ms
// [performance] DeferredLayoutQueue: 15 callbacks batched
```

### All presets

```typescript
DevPresets.production() // Everything off (production mode)
DevPresets.debugLayout() // Layout + positioning + flex
DevPresets.debugOverflow() // Overflow masks visible
DevPresets.profilePerformance() // Performance timing
DevPresets.debugVDOM() // VDOM mount/patch/unmount
DevPresets.debugAll() // EVERYTHING on (verbose)
```

---

## 🎨 Manual Configuration

### Fine-grained debug control

```typescript
import { DevConfig } from '@phaserjsx/ui'

DevConfig.debug.enabled = true

DevConfig.debug.layout = true // Layout calculations
DevConfig.debug.overflowMask = true // Overflow mask positioning
DevConfig.debug.positioning = false // Too noisy
DevConfig.debug.flex = false // Not needed
DevConfig.debug.vdom = false // Not needed
DevConfig.debug.performance = true // Performance timing
```

### Visual debug settings

```typescript
// Make masks visible
DevConfig.visual.showOverflowMasks = true

// Custom mask color (0xRRGGBB)
DevConfig.visual.maskFillColor = 0xff00ff // Pink
DevConfig.visual.maskFillColor = 0x00ff00 // Green
DevConfig.visual.maskFillColor = 0xff0000 // Red

// Mask transparency (0.0 = invisible, 1.0 = opaque)
DevConfig.visual.maskAlpha = 0.3
DevConfig.visual.maskAlpha = 0.5
DevConfig.visual.maskAlpha = 0.0 // Production
```

---

## 💡 Practical Examples

### Scenario 1: Overflow not working

```typescript
import { DevConfig } from '@phaserjsx/ui'

DevConfig.debug.enabled = true
DevConfig.debug.overflowMask = true
DevConfig.visual.showOverflowMasks = true
DevConfig.visual.maskFillColor = 0xff00ff
DevConfig.visual.maskAlpha = 0.5
```

### Scenario 2: Layout behaves strangely

```typescript
import { DevConfig } from '@phaserjsx/ui'

DevConfig.debug.enabled = true
DevConfig.debug.layout = true
DevConfig.debug.flex = true
```

### Scenario 3: Find a performance problem

```typescript
import { DevConfig } from '@phaserjsx/ui'

DevConfig.debug.enabled = true
DevConfig.debug.performance = true
DevConfig.performance.logQueueStats = true
```

### Scenario 4: Only during development

```typescript
import { DevConfig, DevPresets } from '@phaserjsx/ui'

if (import.meta.env.DEV) {
  DevPresets.debugLayout()
} else {
  DevPresets.production()
}
```

---

## 🔧 Configuration Reference

### `DevConfig.debug`

| Option         | Description                        | Default |
| -------------- | ---------------------------------- | ------- |
| `enabled`      | Master switch for all debug output | `false` |
| `layout`       | Layout calculations                | `false` |
| `overflowMask` | Overflow-mask positioning          | `false` |
| `flex`         | Flex space distribution            | `false` |
| `positioning`  | Child positioning                  | `false` |
| `vdom`         | VDOM mount/patch/unmount           | `false` |
| `performance`  | Performance timing                 | `false` |

### `DevConfig.visual`

| Option              | Description                 | Default    |
| ------------------- | --------------------------- | ---------- |
| `showOverflowMasks` | Show overflow masks         | `false`    |
| `maskFillColor`     | Mask color (hex color)      | `0xffffff` |
| `maskAlpha`         | Mask transparency (0.0–1.0) | `0.0`      |

### `DevConfig.performance`

| Option             | Description          | Default |
| ------------------ | -------------------- | ------- |
| `useDeferredQueue` | Enable batching      | `true`  |
| `logQueueStats`    | Log queue statistics | `false` |

---

## 🎓 Advanced: Custom Debug Categories

```typescript
import { DebugLogger } from '@phaserjsx/ui'

function MyCustomComponent() {
  DebugLogger.log('layout', 'Custom component rendering')

  DebugLogger.time('performance', 'Heavy operation')
  // ... heavy operation ...
  DebugLogger.timeEnd('performance', 'Heavy operation')
}
```

---

## ⚠️ Production Best Practices

1. Always call `DevPresets.production()` in production
2. Tree-shaking removes unused debug logs
3. With `debug.enabled = false`, runtime overhead is minimal

```typescript
import { DevPresets } from '@phaserjsx/ui'

if (import.meta.env.PROD) {
  DevPresets.production()
}
```

---

## 🐛 Troubleshooting

### Debug logs not showing?

```typescript
DevConfig.debug.enabled = true
DevConfig.debug.layout = true
```

### Masks not visible?

```typescript
DevConfig.visual.showOverflowMasks = true
DevConfig.visual.maskAlpha = 0.3 // Must be > 0.0
```

### Too many logs?

```typescript
DevConfig.debug.positioning = false
DevConfig.debug.flex = false

DevPresets.debugOverflow() // Only overflow-related logs
```

---

## 📝 Commit Message Template

```text
feat: add runtime DevConfig system for debugging

Enable runtime-configurable debug settings without recompilation

Features:
- DevConfig object with debug, visual, and performance settings
- DebugLogger with category-based filtering
- DevPresets for common debugging scenarios
- Zero-cost in production (tree-shaking removes unused code)

Usage:
import { DevPresets } from '@phaserjsx/ui'
DevPresets.debugOverflow()  // Makes masks visible
```
