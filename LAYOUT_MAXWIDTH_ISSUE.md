# Layout System: maxWidth Issue

## Problem Discovery

**Date:** 3. Dezember 2025  
**Component:** WrapText, Layout Engine  
**Issue:** `maxWidth` allein funktioniert nicht wie erwartet - Container werden trotzdem zu breit

## Root Cause

Das Layout-System wertet Props in dieser Reihenfolge aus:

1. **`width` Resolution** → Ermittelt Basis-Größe
   - `auto` → Content-basierte Größe (intrinsisch)
   - `fill` → Parent-basierte Größe
   - Fixed/Percent → Explizite Größe

2. **Constraint Application** → `clampSize()` wendet `minWidth`/`maxWidth` an
   - Limitiert nur die **bereits berechnete** Größe
   - Ändert NICHT das Basis-Verhalten von `width`

### Das Problem in der Praxis

```tsx
// ❌ FUNKTIONIERT NICHT WIE ERWARTET
<View maxWidth={300}>
  <WrapText text="Very long text..." />
</View>
```

**Was passiert:**

1. Outer View hat `width="auto"` (default)
2. Inner View (in WrapText) hat `width="fill"`
3. Aber: fill braucht Parent mit definierter Größe!
4. Parent ist `auto` → nimmt Content-Größe
5. Content = unwrapped Text (sehr breit)
6. `maxWidth={300}` limitiert nur, aber Content ist schon berechnet

**Resultat:** Container wird breiter als 300px, Text wrappt nicht.

### Die Lösung

```tsx
// ✅ FUNKTIONIERT
<View width={300}>
  <WrapText text="Very long text..." />
</View>
```

**Warum:**

1. Outer View hat explizite `width={300}`
2. Inner View mit `width="fill"` füllt 300px aus
3. `__getLayoutSize()` gibt 300px zurück
4. Text kriegt `wordWrap: { width: 300 }`
5. Text wrappt korrekt

## Code-Stellen

### size-resolver.ts

```typescript
// width wird zuerst resolved
let width = resolveSize(
  parsedWidth,
  parentSize?.width,
  child.width ?? 100, // Fallback = Content-Size
  parentPadding?.horizontal
)

// DANN werden constraints angewendet
width = clampSize(
  width,
  minWidth,
  maxWidth, // ← Limitiert nur!
  parentSize?.width,
  child.width,
  parentPadding?.horizontal
)
```

### WrapText Component

```tsx
// Braucht width="fill" um Parent-Größe zu erhalten
<View ref={containerRef} width={'fill'}>
  <Text {...textProps} />
</View>
```

## Implikationen

### Für Komponenten-Design

**❌ Vermeiden:**

```tsx
<View maxWidth={500}>
  {' '}
  // Ohne width
  <WrapText text="..." />
</View>
```

**✅ Empfohlen:**

```tsx
<View width={500}>           // Explizite width
  <WrapText text="..." />
</View>

// ODER

<View width="fill" maxWidth={500}>  // fill + maxWidth als Limit
  <WrapText text="..." />
</View>
```

### Für UI Library

**WrapText Dokumentation:**

- Parent-Container **MUSS** explizite `width` haben
- `maxWidth` allein reicht NICHT
- `width="fill"` im Parent funktioniert, wenn dessen Parent auch Größe hat

### Mögliche Fixes im Layout-System

**Option 1:** `maxWidth` ohne `width` → auto-apply `fill`?

```typescript
// Wenn maxWidth gesetzt aber width=auto → nutze fill statt auto?
if (maxWidth !== undefined && width === 'auto') {
  width = 'fill'
}
```

**Problem:** Breaking Change, könnte andere Layouts brechen

**Option 2:** Zwei-Pass Layout für maxWidth

```typescript
// 1. Pass: Berechne mit auto
// 2. Pass: Falls > maxWidth → Re-calc mit maxWidth als fixed width
```

**Problem:** Performance-Impact, komplexe Implementierung

**Option 3:** Dokumentation + Best Practices (current)

- Nutzer müssen explizite `width` setzen
- Komponenten wie WrapText dokumentieren Requirements

## Lessons Learned

1. **`maxWidth` ist ein Constraint, kein Size-Provider**
   - Limitiert nur, überschreibt nicht das Basis-Sizing
2. **`width="auto"` + nested `width="fill"` = Problem**
   - fill braucht Parent mit konkreter Größe
   - auto gibt keine konkrete Größe (content-based)

3. **Explizite Größen bevorzugen**
   - `width={300}` statt nur `maxWidth={300}`
   - Oder: `width="fill" maxWidth={300}` für responsive + limit

## Related Components

- **WrapText:** Braucht Parent mit expliziter width
- **Dialog:** Nutzt `maxWidth` korrekt (hat background mit fixed size)
- **AlertDialog:** Nutzt WrapText → Parent braucht width
- **Dropdown:** Overlay mit maxHeight → ähnliches Verhalten

## Action Items

- [x] Fix WrapText examples: Replace `maxWidth` mit `width`
- [x] Document WrapText requirements (parent needs explicit width)
- [ ] Review other components mit `maxWidth` usage
- [ ] Consider layout system enhancement (long-term)
- [ ] Add tests for maxWidth behavior with different width values
