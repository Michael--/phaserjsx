# Multi-Mount Strategy: Render Context Isolation

## Problem

Aktuell verhindert eine Reihe von globalen Singletons das mehrfache Mounting von JSX-Bäumen:

### Kritische Singletons:

1. **`CURRENT: Ctx | null`** (hooks.ts)
   - Speichert aktiven Hook-Context während Render
   - Problem: Überschreibung bei verschachtelten Renders

2. **`textureRegistry`** (texture-registry.ts)
   - Globale Instanz für Texture-Management
   - Problem: Shared Scene reference

3. **`viewportRegistry`** (viewport-context.ts)
   - Speichert viewport dimensions
   - Problem: Single parent reference

4. **`themeRegistry`** (theme.ts)
   - Globale Theme-Verwaltung
   - OK: Themes sollten global sein

5. **`window.__phaserScene`** (vdom.ts)
   - Global scene reference für useScene()
   - Problem: Überschreibung bei mehreren Scenes

6. **`GestureManager`** (gesture-manager.ts)
   - Per Scene singleton via `scene.data`
   - ✅ OK: Bereits scene-isoliert!

7. **`DeferredLayoutQueue` / `LayoutBatchQueue`** (layout-engine.ts)
   - Static classes für batching
   - Problem: Shared state über alle mounts

## Lösung: Render Context Pattern

### Strategie 1: **Scene-Based Context (Empfohlen)**

**Vorteile:**

- ✅ Minimal-invasiv: Nutzt existierende `scene.data` API
- ✅ Automatische Cleanup bei Scene destroy
- ✅ Ähnlich wie GestureManager (bereits implementiert)
- ✅ Keine Breaking Changes für User Code

**Implementierung:**

```typescript
// packages/ui/src/render-context.ts

/**
 * Render context - isolates global state per mount point
 * Stored in scene.data to ensure proper isolation
 */
import type Phaser from 'phaser'
import type { Ctx } from './hooks'
import { TextureRegistry } from './utils/texture-registry'
import { ViewportRegistry } from './viewport-context'

export class RenderContext {
  // Hook context stack (replaces global CURRENT)
  private currentCtx: Ctx | null = null

  // Texture management (per mount)
  public textureRegistry: TextureRegistry

  // Viewport dimensions (per mount)
  public viewportRegistry: ViewportRegistry

  // Deferred layout callbacks (per mount)
  private deferredCallbacks: (() => void)[] = []
  private deferredScheduled = false

  // Layout batch queue (per mount)
  private layoutBatchMap = new Map<any, any>()

  constructor(public scene: Phaser.Scene) {
    this.textureRegistry = new TextureRegistry()
    this.textureRegistry.setScene(scene)
    this.viewportRegistry = new ViewportRegistry()
  }

  // Hook context management
  getCurrent(): Ctx | null {
    return this.currentCtx
  }

  setCurrent(ctx: Ctx | null): void {
    this.currentCtx = ctx
  }

  // Deferred layout queue
  deferLayout(callback: () => void): void {
    this.deferredCallbacks.push(callback)
    if (!this.deferredScheduled) {
      this.deferredScheduled = true
      requestAnimationFrame(() => this.flushDeferred())
    }
  }

  private flushDeferred(): void {
    this.deferredScheduled = false
    const callbacks = [...this.deferredCallbacks]
    this.deferredCallbacks = []
    callbacks.forEach((cb) => {
      try {
        cb()
      } catch (err) {
        console.error('Deferred callback error:', err)
      }
    })
  }

  // Layout batch management
  getLayoutBatch(): Map<any, any> {
    return this.layoutBatchMap
  }

  clearLayoutBatch(): void {
    this.layoutBatchMap.clear()
  }
}

/**
 * Get or create RenderContext for a scene/container
 */
export function getRenderContext(
  parentOrScene: Phaser.Scene | Phaser.GameObjects.Container
): RenderContext {
  const scene = parentOrScene instanceof Phaser.Scene ? parentOrScene : parentOrScene.scene

  if (!scene || !scene.data) {
    throw new Error('Invalid scene or scene.data')
  }

  // Use unique key per container to support multiple mounts in same scene
  const containerKey =
    parentOrScene instanceof Phaser.GameObjects.Container
      ? `__renderContext_${parentOrScene.name || parentOrScene.id}__`
      : '__renderContext_scene__'

  let context = scene.data.get(containerKey) as RenderContext | undefined

  if (!context) {
    context = new RenderContext(scene)
    scene.data.set(containerKey, context)

    // Cleanup on destroy
    scene.events.once('shutdown', () => {
      scene.data.remove(containerKey)
    })
  }

  return context
}
```

**Migration der Hooks:**

```typescript
// packages/ui/src/hooks.ts

import { getRenderContext } from './render-context'

// Hilfsfunktion: Context aus parent extrahieren
function getContextFromParent(parent: ParentType): RenderContext {
  return getRenderContext(parent)
}

export function withHooks<T>(ctx: Ctx, render: () => T): T {
  const renderContext = getContextFromParent(ctx.parent)
  const prev = renderContext.getCurrent()
  renderContext.setCurrent(ctx)
  ctx.index = 0
  ctx.effects = []
  const out = render()
  renderContext.setCurrent(prev)
  return out
}

export function useState<T>(initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const renderContext = getContextFromParent(CURRENT!.parent)
  const c = renderContext.getCurrent()!
  // ... rest bleibt gleich
}

// Analog für useRef, useEffect, useMemo, etc.
```

**Migration mountJSX:**

```typescript
// packages/ui/src/vdom.ts

export function mountJSX(
  parentOrScene: ParentType,
  type: NodeType | ((props: unknown) => VNode),
  props: Record<string, unknown> = {}
): Phaser.GameObjects.GameObject {
  const scene = parentOrScene instanceof Phaser.Scene ? parentOrScene : parentOrScene.scene

  // Get or create render context for this mount point
  const renderContext = getRenderContext(parentOrScene)

  // Set viewport dimensions
  if (scene) {
    renderContext.viewportRegistry.setViewport(scene.scale.width, scene.scale.height, scene)
  }

  const vnode: VNode = { type, props, children: [] }

  // Store root VNode on context instead of scene
  if (parentOrScene instanceof Phaser.GameObjects.Container) {
    ;(parentOrScene as any).__rootVNode = vnode
  } else {
    ;(scene as any).__rootVNode = vnode
  }

  return mount(parentOrScene, vnode)
}
```

---

### Strategie 2: **Container-Based Context**

Weniger empfohlen, da mehr Refactoring nötig:

```typescript
// Jeden Container mit Context erweitern
interface ContainerWithContext extends Phaser.GameObjects.Container {
  __renderContext: RenderContext
}

// Bei mount Context am Container speichern
function mountJSX(container: Phaser.GameObjects.Container, ...) {
  container.__renderContext = new RenderContext(container.scene)
  // ...
}
```

**Nachteil:** Erfordert Änderungen in vielen Stellen wo Container genutzt werden.

---

### Strategie 3: **Mount-ID Based Isolation**

Jeder `mountJSX()` Call bekommt eine eindeutige ID:

```typescript
const mountId = Symbol('mount')
const contexts = new WeakMap<Symbol, RenderContext>()

export function mountJSX(...) {
  const context = new RenderContext()
  contexts.set(mountId, context)

  // VNode erweitern um __mountId
  vnode.__mountId = mountId

  // In hooks: Context via mountId auflösen
  const mountId = CURRENT.componentVNode.__mountId
  const context = contexts.get(mountId)
}
```

**Nachteil:** Performance overhead durch WeakMap lookups.

---

## Empfehlung: **Strategie 1 (Scene-Based)**

### Vorteile:

- ✅ Nutzt etabliertes Phaser Pattern (`scene.data`)
- ✅ Automatisches Cleanup
- ✅ Minimal-invasiv
- ✅ Ähnlich zu GestureManager (consistency)
- ✅ Unterstützt mehrere mounts pro Scene über Container-IDs

### Migrationsplan:

**Phase 1: Context Infrastructure**

1. `render-context.ts` erstellen
2. `getRenderContext()` implementieren

**Phase 2: Hooks Migration** 3. `CURRENT` durch context-based access ersetzen 4. Texture/Viewport Registry in Context verschieben 5. Deferred/Batch Queues in Context verschieben

**Phase 3: VDOM Integration** 6. `mountJSX()` anpassen für context creation 7. `mount()` / `patch()` für context passing 8. `useScene()` anpassen

**Phase 4: Testing** 9. Dual mount test cases 10. Performance benchmarks 11. Cleanup tests (scene destroy)

### Breaking Changes:

- ❌ **Keine Breaking Changes** für normale User
- ⚠️ Nur für Nutzer die direkt auf Internals zugreifen

### Performance Impact:

- Minimal: Zusätzlicher Map lookup pro Hook Call
- Vorteil: Bessere Isolation = weniger Bugs

---

## Alternative: Quick Fix (Nicht empfohlen)

Falls komplettes Refactoring zu aufwendig:

```typescript
// Namespace pro mount
const mountNamespaces = new WeakMap<any, {
  CURRENT: Ctx | null
  textureRegistry: TextureRegistry
  // ...
}>()

export function mountJSX(parent, ...) {
  const namespace = {
    CURRENT: null,
    textureRegistry: new TextureRegistry(),
    // ...
  }
  mountNamespaces.set(parent, namespace)

  // Alle Zugriffe über namespace
  const ns = mountNamespaces.get(parent)!
  ns.CURRENT = ctx
}
```

**Nachteil:** Sehr hacky, schwer zu maintainen.

---

## Implementierungs-Aufwand

| Strategie           | Aufwand | Code Changes | Breaking Changes           |
| ------------------- | ------- | ------------ | -------------------------- |
| Scene-Based Context | ~4h     | ~15 files    | None                       |
| Container-Based     | ~8h     | ~30 files    | Some                       |
| Mount-ID Based      | ~6h     | ~20 files    | None                       |
| Quick Fix           | ~1h     | ~5 files     | None (aber technical debt) |

**Empfehlung:** Scene-Based Context (~4 Stunden, clean solution)

---

## Nächste Schritte

1. ✅ Entscheidung: Welche Strategie?
2. Proof of Concept für `render-context.ts`
3. Migration eines Subsystems (z.B. hooks)
4. Test mit dual mount
5. Vollständige Migration
6. Performance Testing
7. Documentation Update

Soll ich mit der Implementierung von **Strategie 1 (Scene-Based)** beginnen?
