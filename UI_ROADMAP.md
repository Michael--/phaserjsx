@cspell: disable

# PhaserJSX UI Roadmap

> Status-Analyse und Feature-Roadmap für das @phaserjsx/ui Package

**Stand:** 30. November 2025  
**Version:** Pre-Release (vor npm-Publish)

---

## 📊 Aktueller Status

### ✅ Kernfundament - Vollständig

**VDOM & Hooks System:**

- ✅ `useState`, `useEffect`, `useRef`, `useMemo`
- ✅ `useForceRedraw` mit Signal-Integration
- ✅ `useRedraw` für manuelle Updates
- ✅ Vollständiges Memoization-System
- ✅ Scene-aware Lifecycle-Management

**Layout Engine:**

- ✅ Flexbox (row, column, stack)
- ✅ Constraint-based Layout
- ✅ Percentage, viewport units (vw/vh)
- ✅ `calc()` Expressions
- ✅ Min/max constraints
- ✅ Gap, margin, padding

**Theme System:**

- ✅ Global & lokale Themes
- ✅ Automatische Vererbung
- ✅ Nested themes
- ✅ Type-safe mit Autocomplete
- ✅ `useTheme`, `useThemeTokens`
- ✅ Design Token System (spacing, radius, sizes, text styles)

---

### ✅ Built-in Komponenten - Primitives

**Phaser GameObjects:**

- ✅ `View` - Container mit vollständigem Layout
- ✅ `Text` - Phaser Text mit Theme-Support
- ✅ `Image` - Texturen mit Layout-Integration
- ✅ `Sprite` - Animated Sprites
- ✅ `Graphics` - Programmatische Grafiken
- ✅ `TileSprite` - Tiled Textures
- ✅ `NineSlice` - Skalierbare UI-Elemente

---

### ✅ Custom UI Komponenten - Basis vorhanden

**Buttons & Selection:**

- ✅ `Button` - Themeable Button
- ✅ `NineSliceButton` - NineSlice-basierter Button
- ✅ `IconButton` - Button mit Icon
- ✅ `Checkbox` - Checkbox mit Interaktivität
- ✅ `RadioButton` / `RadioGroup` - Radio-Buttons
- ✅ `Dropdown` - Dropdown/Select Component
- ✅ `Toggle` / `Switch` - Toggle Component mit smooth Animation

**Layout & Container:**

- ✅ `ScrollView` + `ScrollSlider` - Scrollbare Container
- ✅ `Accordion` - Expandable Panels
- ✅ `Sidebar` - Sidebar Layout
- ✅ `Divider` - Visual Separator
- ❌ `Tabs` - Tab Navigation - **FEHLT**
- ❌ `Grid` - CSS Grid Layout - **FEHLT**

**Text & Input:**

- ✅ `CharText` - Character-by-character Text
- ✅ `CharTextInput` - Text-Input-Field
- ❌ `TextArea` - Multi-line Input - **FEHLT**
- ❌ `NumberInput` - Numeric Input mit +/- - **FEHLT**

**Feedback & Overlays:**

- ✅ `Icon` - SVG-basiertes Icon-System mit Generator
- ✅ `Modal` / `Dialog`
- ❌ `Tooltip` - **FEHLT (KRITISCH)**
- ❌ `Popover` - Context Menus - **FEHLT**
- ❌ `Badge` / `Tag` - Labels & Notifications - **FEHLT**
- ❌ `ProgressBar` - Loading/Health Bars - **FEHLT**
- ❌ `Spinner` / `LoadingIndicator` - **FEHLT**

**Advanced:**

- ✅ `TransformOriginView` / `RefOriginView` - Origin-Manipulation
- ❌ `VirtualList` - Performance für große Listen - **FEHLT**
- ❌ `Tree` - Hierarchische Daten - **FEHLT**
- ❌ `Stepper` - Multi-Step Navigation - **FEHLT**

---

### ✅ Gestures & Input - Vollständig

- ✅ Tap/Click Events
- ✅ Long Press
- ✅ Drag & Drop
- ✅ Focus/Blur
- ✅ Keyboard Input (`KeyboardInputManager`)
- ✅ DOM Input Integration (`DOMInputElement`)

---

### ✅ Animation - Vollständig

- ✅ Spring Physics (`useSpring`, `useSprings`)
- ✅ Animated Signals
- ✅ GameObject Effects (shake, pulse, bounce, etc.)
- ✅ `useGameObjectEffect` Hook

---

### ⚠️ Phaser FX System - Teilweise

**PostFX/PreFX Pipeline:**

- ❌ `useFX` Hook - Für postFX/preFX Pipeline
- ❌ FX Registry mit Presets (Shadow, Glow, Blur, etc.)
- ❌ `useShadow`, `useGlow`, `useBlur` - Convenience Hooks
- ❌ FX Animation Support (animated FX properties)
- ❌ Theme-Integration für FX
- **Status:** Nicht implementiert, aber Phaser-native Unterstützung vorhanden

---

### ✅ SVG & Textures - Vollständig

- ✅ `useSVGTexture` / `useSVGTextures`
- ✅ SVG zu Phaser Texture Konvertierung
- ✅ Icon Generator System (automatisch)

---

### ✅ Color System - Vollständig

- ✅ `useColors`, `useColorMode`
- ✅ Dark/Light Mode Support
- ✅ Color Tokens
- ✅ Theme-basierte Farben

---

## 🚨 Feature-Roadmap

### 🔴 Phase 1: Kritische Komponenten (Pre-npm-Release)

**Priorität: HOCH - Unverzichtbar für v1.0**

#### 1. Dropdown/Select Component ✅ **FERTIG!**

- ✅ `Dropdown` - Single & Multi-Select
- ✅ Overlay-Management System
- ✅ Keyboard Navigation (Arrow Keys, Enter, Escape)
- ✅ Search/Filter in Dropdown
- ✅ Custom Rendering (renderValue, renderOption)
- ✅ Theme-Integration (vollständig)
- ✅ Spring Animations
- ✅ Auto-Placement (top/bottom/auto)
- ✅ Icon Support (prefix/suffix)
- ✅ Disabled State
- **Aufwand:** 2 Stunden (schneller als geplant!)
- **Status:** Production-ready mit Example

#### 2. Slider/Range Component ✅ **FERTIG!**

- ✅ `Slider` - Horizontal/Vertical Slider
- ✅ `RangeSlider` - Min/Max Selection mit zwei Thumbs
- ✅ Vertical Slider Support
- ✅ Reverse Direction (right-to-left, bottom-to-top)
- ✅ Step/Snap Values
- ✅ Custom Thumb Rendering
- ✅ Custom Track Rendering
- ✅ Marks/Ticks Support
- ✅ Value Labels
- ✅ Min Distance zwischen Thumbs (RangeSlider)
- ✅ Theme-Integration (vollständig)
- ✅ Disabled State
- **Aufwand:** 2 Stunden
- **Status:** Production-ready mit Examples
- **Architektur:** Gemeinsame BaseSlider-Implementierung für beide Komponenten

#### 3. Toggle/Switch Component

- ✅ `Toggle` - iOS-style Switch
- ✅ Animation (Slide + Fade)
- ❌ Loading State
- ✅ Disabled State
- **Aufwand:** 0.5 Tage
- **Begründung:** Moderne Alternative zu Checkbox

#### 4. Modal/Dialog System

- ✅ `Modal` - Fullscreen Overlay
- ❌ `Dialog` - Centered Modal
- ❌ `AlertDialog` - Confirm/Cancel
- ✅ Portal/Layer System (render außerhalb Tree)
- ✅ Backdrop (dimmed background)
- ❌ Focus Trap
- ✅ ESC-Key zum Schließen
- ✅ Animation (Fade + Scale)
- **Aufwand:** 2 Tage
- **Begründung:** Unverzichtbar für UX (Confirmations, Settings, Dialogs)

#### 5. Tooltip Component

- ❌ `Tooltip` - Hover-Info
- ❌ Position Logic (top, bottom, left, right, auto)
- ❌ Arrow/Pointer
- ❌ Delay Configuration
- ❌ Touch Support (Long Press)
- **Aufwand:** 1 Tag
- **Begründung:** Verbessert UX massiv (Erklärungen, Hints)

**Gesamtaufwand Phase 1:** ~6-7 Arbeitstage

---

### 🟠 Phase 1.5: Phaser-spezifische Features (Optional für v1.0)

**Priorität: MITTEL-HOCH - Phaser-native, low-cost, high-impact**

#### 6. Phaser FX System (PostFX/PreFX)

- ❌ `useFX` - Hook für postFX/preFX Pipeline
- ❌ FX Registry mit Presets
  - Shadow (drop shadow, inner shadow)
  - Glow (outer glow, inner glow)
  - Blur (box blur, gaussian blur)
  - Pixelate
  - Vignette
  - Color Matrix (grayscale, sepia, etc.)
- ❌ Convenience Hooks:
  - `useShadow(ref, { offsetX, offsetY, blur, color })`
  - `useGlow(ref, { color, quality, distance })`
  - `useBlur(ref, { strength, quality })`
- ❌ FX Animation Support (Spring-animated FX)
- ❌ Theme-Integration (z.B. `shadow` als Theme-Property)
- **Aufwand:** 1.5 Tage
- **Begründung:** Phaser-native, Performance-effizient, große UX-Verbesserung (Shadows!)

#### 7. Particle System Integration

- ❌ `Particles` Component - Wrapper für Phaser ParticleEmitter
- ❌ `useParticles` Hook - Programmatic Particle Control
- ❌ Particle Presets (explosion, trail, rain, snow, etc.)
- ❌ Integration mit Layout-System
- **Aufwand:** 1 Tag
- **Begründung:** Game-typische Feature, einfach zu wrappen

#### 8. Video Component

- ❌ `Video` Component - Phaser Video GameObject
- ❌ Controls (play, pause, seek)
- ❌ Events (onPlay, onPause, onEnd)
- ❌ Layout-Integration
- **Aufwand:** 0.5 Tage
- **Begründung:** Cutscenes, Tutorials, Intro-Videos

#### 9. Camera Effects

- ❌ `useCameraFX` - Shake, Flash, Fade, Zoom
- ❌ `useScreenShake` - Convenience Hook
- ❌ `useCameraFlash` - Flash Effect
- ❌ `useCameraFade` - Fade In/Out
- **Aufwand:** 0.5 Tage
- **Begründung:** Game-typisch, einfach zu implementieren

#### 10. Sound/Audio Hooks

- ❌ `useSound` - Play/Stop/Pause Sounds
- ❌ `useMusic` - Background Music Management
- ❌ `useSoundFX` - Sound Effects Library
- ❌ Audio Sprite Support
- **Aufwand:** 1 Tag
- **Begründung:** Jedes Game braucht Audio, bessere Integration

**Gesamtaufwand Phase 1.5:** ~4.5 Tage

---

### 🟡 Phase 2: Wichtige Erweiterungen (Post-Release v1.1)

**Priorität: MITTEL - Sehr nützlich**

#### 11. Tabs Component

- ❌ `Tabs` - Tab Container
- ❌ `Tab` - Einzelner Tab
- ❌ Horizontal/Vertical Orientation
- ❌ Lazy Loading von Tab-Content
- ❌ Keyboard Navigation (Tab Key)
- **Aufwand:** 1.5 Tage

#### 12. ProgressBar Component

- ❌ `ProgressBar` - Linear Progress
- ❌ `CircularProgress` - Circular Progress
- ❌ Determinate/Indeterminate Modes
- ❌ Animated Transitions
- ❌ Labels & Percentage Display
- **Aufwand:** 1 Tag

#### 13. Badge/Tag Component

- ❌ `Badge` - Notification Badge
- ❌ `Tag` - Label/Chip
- ❌ Closeable Tags
- ❌ Color Variants
- ❌ Size Variants
- **Aufwand:** 0.5 Tage

#### 14. Grid Layout Component

- ❌ `Grid` - CSS Grid für UI
- ❌ Auto-columns/rows
- ❌ Gap Support
- ❌ Responsive Breakpoints
- **Aufwand:** 2 Tage

#### 15. Form System

- ❌ `Form` - Form Container
- ❌ Validation System
- ❌ Error Messages
- ❌ Field Dependencies
- ❌ `useForm` Hook
- **Aufwand:** 2 Tage

**Gesamtaufwand Phase 2:** ~7 Arbeitstage

---

### 🟢 Phase 3: Nice-to-Have (v1.2+)

**Priorität: NIEDRIG - Optional**

#### 16. Popover/Menu Component

- ❌ `Popover` - Context Menu Container
- ❌ `Menu` / `MenuItem` - Menu Items
- ❌ Nested Menus (Submenus)
- ❌ Keyboard Navigation
- ❌ Click Outside to Close
- **Aufwand:** 1.5 Tage

#### 17. Stepper/Pagination Component

- ❌ `Stepper` - Multi-Step Navigation
- ❌ `Pagination` - Page Navigation
- ❌ Progress Indicator
- ❌ Validation per Step
- **Aufwand:** 1 Tag

#### 18. Tree Component

- ❌ `Tree` - Hierarchical Data
- ❌ `TreeItem` - Single Node
- ❌ Expand/Collapse Animation
- ❌ Checkbox Support (Multi-Select)
- ❌ Lazy Loading
- **Aufwand:** 2 Tage

#### 19. Virtual Scroll

- ❌ `VirtualList` - Optimized for 1000+ Items
- ❌ Dynamic Row Heights
- ❌ Scroll Position Restoration
- ❌ Infinite Scroll
- **Aufwand:** 2 Tage

#### 20. Drag & Drop Zones

- ❌ `Draggable` - Draggable Wrapper
- ❌ `DropZone` - Drop Target
- ❌ Visual Feedback (Ghost, Placeholder)
- ❌ Multi-Zone Support
- ❌ Constraints & Snapping
- **Aufwand:** 2 Tage

#### 21. Additional Input Components

- ❌ `TextArea` - Multi-line Text Input
- ❌ `NumberInput` - Numeric Input with Spinners
- ❌ `DatePicker` - Date Selection
- ❌ `ColorPicker` - Color Selection
- **Aufwand:** 3 Tage

#### 22. Additional Feedback Components

- ❌ `Toast` / `Snackbar` - Notifications
- ❌ `Skeleton` - Loading Placeholders
- ❌ `Spinner` - Loading Indicator
- ❌ `Empty State` - No-Data Placeholder
- **Aufwand:** 1.5 Tage

**Gesamtaufwand Phase 3:** ~13 Arbeitstage

---

## 🎯 Kritischer Pfad zum npm-Release

### Minimum Viable Product (MVP):

1. ✅ **Core System** - Fertig
2. ✅ **Layout Engine** - Fertig
3. ✅ **Theme System** - Fertig
4. ✅ **Basic Components** - Fertig
5. ✅ **Dropdown/Select** - Fertig
6. ✅ **Slider** - Fertig
7. ✅ **Toggle** - Fertig
8. ❌ **Modal/Dialog** - **BLOCKER**
9. ❌ **Tooltip** - **BLOCKER**

### Timeline bis Release:

- **Phase 1 (Kritisch):** 6-7 Tage → **v1.0.0 Release-Ready (UI-fokussiert)**
- **Phase 1.5 (Phaser-Features):** +4.5 Tage → **v1.0.0 Game-Ready** _(optional)_
- **Phase 2 (Wichtig):** +7 Tage → **v1.1.0 Feature-Complete**
- **Phase 3 (Optional):** +13 Tage → **v1.2.0 Advanced Features**

**Empfehlung:** Phase 1 + 1.5 für v1.0.0 (FX/Shadow ist wichtig für professionelle UI!)

---

## 🔧 System-Verbesserungen

### Infrastruktur (Phase 1 - Kritisch)

- ✅ **Portal/Layer System** - Für Modals/Tooltips/Popovers (BLOCKER für Phase 1)
- ✅ **Z-Index Management** - Automatische Layer-Verwaltung
- ❌ **Focus Management System** - Keyboard Navigation
- ❌ **Accessibility Utilities** - ARIA-like Helpers
- ❌ **Error Boundaries** - Error-Handling in Komponenten

### Dokumentation & Testing (Post-v1.0)

- ❌ **Storybook/Docs** - Component Documentation
- ❌ **E2E Tests** - Integration Tests für Komponenten
- ❌ **Performance Profiler** - Layout/Render Performance Monitoring
- ❌ **Dev Tools Extension** - Browser DevTools für PhaserJSX VDOM

---

## 💪 Stärken des Systems (Alleinstellungsmerkmale)

1. ✅ **React-like DX** - JSX + Hooks für Phaser
2. ✅ **Vollständige Type Safety** - Best-in-class TypeScript
3. ✅ **Flexbox Layout Engine** - Einzigartig in Phaser-Welt
4. ✅ **Theme System** - Überlegen gegenüber Alternativen
5. ✅ **Spring Physics Animations** - Modern & smooth
6. ✅ **SVG Icon Generator** - Automatisiert & type-safe
7. ✅ **Design Token System** - Semantic Styling
8. ✅ **Signal Integration** - Reactive State Management
9. ⚠️ **Phaser-native FX** - PostFX/PreFX noch nicht integriert (Phase 1.5)

---

## 🏆 Vergleich mit Konkurrenz

### vs. rex-ui (rexUI)

- ✅ Bessere DX (JSX vs. Imperative API)
- ✅ Moderne Layout-Engine (Flexbox)
- ✅ Theme System
- ❌ Weniger "Game-spezifische" UI (aktuell)

### vs. phaser3-rex-plugins

- ✅ Type Safety
- ✅ Developer Experience
- ✅ Declarative API
- ❌ Weniger Komponenten (noch)

### vs. phat-ui / phaser-ui-components

- ✅ Deutlich überlegen in allen Bereichen

---

## 📝 Notizen

### Architektur-Entscheidungen

- Alle Custom Components nutzen Built-in Primitives
- Theme-Propagation durch `nestedTheme`
- Layout-Participation über `headless` Flag
- Gesture-System unabhängig von Komponenten

### Performance-Optimierungen

- VDOM mit Memoization
- Smart Layout-Updates (nur bei Änderungen)
- Effect-System mit Cleanup-Management
- Signal-based Updates mit Throttling

### Breaking Changes für v1.0

- Keine bekannten Breaking Changes geplant
- API ist stabil

---

## ✅ Release-Checkliste

### Pre-Release (v1.0.0)

- ❌ Phase 1 Komponenten implementiert
- ❌ Portal/Layer System
- ❌ Dokumentation (README + API Docs)
- ❌ Examples für alle Komponenten
- ❌ Unit Tests (>80% Coverage)
- ❌ Performance Benchmarks
- ❌ Bundle Size Check (<100kb gzipped)
- ❌ npm Package Metadata
- ❌ LICENSE File
- ❌ CHANGELOG.md

### Post-Release

- ❌ GitHub Pages mit Examples
- ❌ npm Badge im README
- ❌ Community Feedback sammeln
- ❌ Phase 2 starten

---

---

## 🎮 Phaser-spezifische Features - Detailanalyse

### Warum `useFX` besonders wichtig ist:

**Phaser PostFX/PreFX System:**

- ✅ **WebGL-Pipeline-Effekte** - Extrem performant (GPU-accelerated)
- ✅ **Native Phaser-Integration** - Keine zusätzlichen Dependencies
- ✅ **Low-Cost, High-Impact** - Wenig Code, große Wirkung

**Use Cases:**

- Drop Shadows für UI-Elemente (professioneller Look!)
- Glow-Effekte für Buttons (Hover/Active States)
- Blur für Backdrop/Modals
- Grayscale für Disabled States
- Vignette für Atmosphäre

**Beispiel-API:**

```tsx
// Convenience Hook
<View ref={viewRef}>
  {useShadow(viewRef, {
    offsetX: 4,
    offsetY: 4,
    blur: 8,
    color: 0x000000
  })}
</View>

// Oder via Theme
<View shadow={{ offsetX: 4, offsetY: 4, blur: 8 }}>
  Content
</View>

// Generic FX Hook
<Image ref={imgRef}>
  {useFX(imgRef, 'Shadow', { x: 4, y: 4, blur: 8 })}
  {useFX(imgRef, 'Glow', { color: 0xff0000, distance: 10 })}
</Image>
```

### Weitere Low-Cost Features:

**Camera Effects (`useCameraFX`):**

- ✅ Bereits in Phaser eingebaut
- ✅ Scene-weite Effekte (Shake, Flash, Fade)
- ✅ Sehr einfach zu wrappen
- 📦 Code: ~100 Zeilen

**Particle System (`Particles`):**

- ✅ Phaser ParticleEmitter Wrapper
- ✅ Layout-Integration (Position, Size)
- ✅ Presets für gängige Effekte
- 📦 Code: ~200 Zeilen

**Audio Hooks (`useSound`, `useMusic`):**

- ✅ Bessere DX als `scene.sound.play()`
- ✅ React-like Audio Management
- ✅ Auto-Cleanup bei Unmount
- 📦 Code: ~150 Zeilen

**Video Component:**

- ✅ Phaser Video GameObject Wrapper
- ✅ Cutscenes, Tutorials, Backgrounds
- 📦 Code: ~100 Zeilen

---

## 📈 Impact vs. Effort - Quick Wins

| Feature                      | Effort | Impact     | Priorität  |
| ---------------------------- | ------ | ---------- | ---------- |
| **useFX (Shadow/Glow/Blur)** | 1.5d   | ⭐⭐⭐⭐⭐ | 🔴 HOCH    |
| **useCameraFX**              | 0.5d   | ⭐⭐⭐⭐   | 🟡 MITTEL  |
| **useSound/useMusic**        | 1d     | ⭐⭐⭐⭐   | 🟡 MITTEL  |
| **Particles Component**      | 1d     | ⭐⭐⭐     | 🟢 NIEDRIG |
| **Video Component**          | 0.5d   | ⭐⭐       | 🟢 NIEDRIG |

**Empfehlung:** `useFX` ist **absolute Priorität** nach Phase 1! Shadows/Glow machen den Unterschied zwischen "OK" und "Professionell".

---

**Nächster Schritt:** Dropdown/Select Component implementieren! 🚀
