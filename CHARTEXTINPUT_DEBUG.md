# CharTextInput Debugging Guide

## Problem: Input reagiert nicht auf Klicks

CharTextInput nutzt ein **unsichtbares HTML Input Overlay** über dem Phaser-Canvas, um Keyboard-Events zu empfangen. Wenn das Input nicht reagiert, ist das Overlay falsch positioniert.

## Debug-Schritte

### 1. Debug-Modus aktivieren

```tsx
<CharTextInput
  value={value}
  onChange={setValue}
  debugHtmlInput={true} // ← Macht Overlay sichtbar
  width={300}
  height={40}
/>
```

Das Overlay wird mit **rotem gestricheltem Rand** sichtbar und sollte genau über dem CharTextInput liegen.

### 2. Überprüfe Canvas-Position

**Problem**: Canvas in React-App anders eingebettet als in test-ui

**Mögliche Ursachen**:

- Canvas-Parent hat CSS transforms
- Canvas ist in scrollbarem Container
- Canvas hat position: relative/absolute
- Viewport-Scale stimmt nicht

**Prüfen in Browser DevTools**:

```javascript
// Im Browser Console:
const canvas = document.querySelector('canvas')
console.log('Canvas rect:', canvas.getBoundingClientRect())
console.log('Parent rect:', canvas.parentElement.getBoundingClientRect())
```

### 3. Positionsberechnung prüfen

**Datei**: `packages/ui/src/utils/dom-input-manager.ts` (Zeile 167-206)

```typescript
private updatePosition(): void {
  const canvas = this.scene.game.canvas
  const canvasRect = canvas.getBoundingClientRect()

  // World position
  const worldTransform = this.container.getWorldTransformMatrix()
  const worldX = worldTransform.tx
  const worldY = worldTransform.ty

  // Scaling
  const zoom = this.scene.cameras.main.zoom
  const scale = this.scene.game.scale

  // Final position
  const left = canvasRect.left + worldX * zoom * scale.displayScale.x
  const top = canvasRect.top + worldY * zoom * scale.displayScale.y
}
```

**Häufige Probleme**:

- `canvasRect.left/top` falsch wenn Canvas gescrollt ist
- `worldX/worldY` stimmt nicht mit visueller Position überein
- `zoom` oder `displayScale` falsch konfiguriert

### 4. Temporärer Fix: window.scrollY berücksichtigen

Wenn Canvas in scrollbarem Container ist:

```typescript
// In updatePosition():
const left = canvasRect.left + worldX * zoom * scale.displayScale.x
const top = canvasRect.top + worldY * zoom * scale.displayScale.y + window.scrollY
```

### 5. Layout-Unterschiede prüfen

**test-ui** (funktioniert):

- Canvas nimmt ganzen Viewport ein
- Keine scrollbaren Container
- Canvas position: fixed oder static

**docs-site** (funktioniert nicht):

- Canvas in React-Component eingebettet
- Möglicherweise in Sidebar-Layout
- Canvas in scrollbarem Content-Bereich

**Prüfe in ComponentPage.tsx**:

```tsx
// Wie wird Phaser Canvas eingebettet?
<div className="example-container">
  <Game /> {/* ← Hier Canvas erstellen */}
</div>
```

### 6. LiveExample Component prüfen

**Datei**: `apps/docs-site/src/components/LiveExample.tsx`

Prüfe:

- Canvas parent element styles
- Container overflow/scroll settings
- Position/transform CSS properties

### 7. Phaser Config prüfen

**Unterschiede in Scale Config**:

```typescript
// test-ui
scale: {
  mode: Phaser.Scale.FIT,
  parent: 'game-container',
  // ...
}

// docs-site
scale: {
  mode: Phaser.Scale.NONE, // ← Könnte anders sein
  // ...
}
```

## Schnelle Diagnose

1. **Aktiviere Debug-Modus** in einem Example
2. **Klicke auf CharTextInput**
3. **Beobachte rotes Overlay**:
   - ✅ Overlay genau über Input → Problem anderswo
   - ❌ Overlay falsch positioniert → Positions-Berechnung falsch
   - ❌ Overlay nicht sichtbar → HTML Element nicht erstellt

## Workaround für docs-site

Falls schnelle Lösung benötigt:

```tsx
// In dom-input-manager.ts, updatePosition()
const parent = canvas.parentElement
const parentRect = parent?.getBoundingClientRect() ?? canvasRect

// Use parent as reference instead of canvas
const left = parentRect.left + worldX * zoom * scale.displayScale.x
const top = parentRect.top + worldY * zoom * scale.displayScale.y
```

## Nächste Schritte

1. Debug-Example in docs-site öffnen
2. Browser DevTools → Element Inspector
3. HTML Input Element finden (opacity: 0.3 im Debug-Mode)
4. Position vergleichen mit visuellem CharTextInput
5. Offset berechnen und in updatePosition() korrigieren
