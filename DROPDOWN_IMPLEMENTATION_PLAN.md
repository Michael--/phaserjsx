# Dropdown/Select Component - Implementation Plan

> Detaillierter Implementierungsplan für Dropdown/Select Komponente

**Datum:** 30. November 2025  
**Status:** 🔴 Phase 1 - Kritisch für v1.0  
**Geschätzter Aufwand:** 2 Tage

---

## 📋 Übersicht

### Ziel

Eine vollständig themeable, keyboard-navigierbare Dropdown/Select Komponente auf Basis vorhandener Primitives (View, Text, ScrollView).

### Features

- ✅ Single-Select & Multi-Select Modi
- ✅ Keyboard Navigation (Arrow Keys, Enter, Escape)
- ✅ Search/Filter (optional)
- ✅ Custom Option Rendering
- ✅ Scrollbare Option-Liste
- ✅ Theme-Integration (vollständig)
- ✅ Animationen (Expand/Collapse mit Spring Physics)
- ✅ Disabled State
- ✅ Portal/Layer System (für z-index über Parent)

---

## 🏗️ Architektur

### Komponenten-Hierarchie

```
Dropdown (Main Component)
├── Trigger (View + Text/Content)
│   ├── Label/Selected Value
│   └── Arrow Icon (rotiert bei open/close)
├── Overlay (Portal-rendered, außerhalb Tree)
│   └── OptionsList (View + ScrollView)
│       ├── SearchInput (optional, CharTextInput)
│       └── Options (ScrollView)
│           ├── Option (View + Text)
│           ├── Option (View + Text)
│           └── ...
```

### Komponenten-Dateien

```
packages/ui/src/components/custom/
├── Dropdown.tsx           # Main Dropdown/Select Component
├── DropdownOption.tsx     # Single Option (internal)
└── DropdownOverlay.tsx    # Overlay/Portal Component (internal)
```

---

## 🎨 API Design

### 1. Dropdown Component

```tsx
/**
 * Option type for Dropdown
 */
export interface DropdownOption<T = string> {
  /** Unique value */
  value: T
  /** Display label */
  label: string
  /** Disabled state */
  disabled?: boolean
  /** Custom icon/prefix content (user provides) */
  prefix?: ChildrenType
  /** Custom suffix content (user provides) */
  suffix?: ChildrenType
}

/**
 * Props for Dropdown component
 */
export interface DropdownProps<T = string> extends ViewProps, EffectDefinition {
  /** Available options */
  options: DropdownOption<T>[]

  /** Selected value (controlled) */
  value?: T | T[]

  /** Default selected value (uncontrolled) */
  defaultValue?: T | T[]

  /** Placeholder text when nothing selected */
  placeholder?: string

  /** Multi-select mode */
  multiple?: boolean

  /** Enable search/filter */
  searchable?: boolean

  /** Search placeholder */
  searchPlaceholder?: string

  /** Disabled state */
  disabled?: boolean

  /** Maximum height of dropdown list */
  maxHeight?: number

  /** Position of dropdown (default: 'bottom') */
  placement?: 'top' | 'bottom' | 'auto'

  /** Custom render function for selected value */
  renderValue?: (selected: DropdownOption<T> | DropdownOption<T>[]) => ChildrenType

  /** Custom render function for option */
  renderOption?: (option: DropdownOption<T>, isSelected: boolean) => ChildrenType

  /** Custom arrow/indicator (default: simple Graphics triangle) */
  arrow?: ChildrenType

  /** Callback when selection changes */
  onChange?: (value: T | T[]) => void

  /** Callback when dropdown opens */
  onOpen?: () => void

  /** Callback when dropdown closes */
  onClose?: () => void

  /** Animation config for expand/collapse */
  animationConfig?: AnimationConfig

  /** Close on select (default: true for single, false for multi) */
  closeOnSelect?: boolean
}

/**
 * Dropdown/Select component
 */
export function Dropdown<T = string>(props: DropdownProps<T>): JSX.Element
```

### 2. Theme Definition

```tsx
// In theme-custom.ts
export interface DropdownTheme extends ViewTheme, EffectDefinition {
  /** Trigger styling */
  trigger?: {
    backgroundColor?: number
    borderColor?: number
    borderWidth?: number
    cornerRadius?: number
    padding?: number | EdgeInsets
    minWidth?: SizeValue
    height?: SizeValue
  }

  /** Trigger hover state */
  triggerHover?: {
    backgroundColor?: number
    borderColor?: number
  }

  /** Trigger open state */
  triggerOpen?: {
    backgroundColor?: number
    borderColor?: number
  }

  /** Trigger disabled state */
  triggerDisabled?: {
    backgroundColor?: number
    alpha?: number
  }

  /** Arrow/Indicator styling (for default Graphics fallback) */
  arrow?: {
    color?: number
    size?: number
  }

  /** Note: Icons müssen vom User als children übergeben werden! */

  /** Overlay/List styling */
  overlay?: {
    backgroundColor?: number
    borderColor?: number
    borderWidth?: number
    cornerRadius?: number
    maxHeight?: number
    padding?: number | EdgeInsets
  }

  /** Option styling */
  option?: {
    backgroundColor?: number
    padding?: number | EdgeInsets
    height?: SizeValue
  }

  /** Option hover state */
  optionHover?: {
    backgroundColor?: number
  }

  /** Option selected state */
  optionSelected?: {
    backgroundColor?: number
    textColor?: string
  }

  /** Option disabled state */
  optionDisabled?: {
    alpha?: number
  }

  /** Text styling */
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle

  /** Placeholder text styling */
  placeholderStyle?: Phaser.Types.GameObjects.Text.TextStyle

  /** Search input styling */
  searchInput?: {
    backgroundColor?: number
    borderColor?: number
    height?: SizeValue
  }

  /** Animation config */
  animationConfig?: AnimationConfig

  /** Gap between options */
  optionGap?: number
}

// Default Theme
export const defaultTheme = {
  Dropdown: {
    trigger: {
      backgroundColor: 0x2a2a2a,
      borderColor: 0x666666,
      borderWidth: 1,
      cornerRadius: 4,
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      minWidth: 200,
      height: 36,
    },
    triggerHover: {
      borderColor: 0x4a9eff,
    },
    triggerOpen: {
      borderColor: 0x4a9eff,
      backgroundColor: 0x333333,
    },
    triggerDisabled: {
      backgroundColor: 0x1a1a1a,
      alpha: 0.5,
    },
    arrow: {
      color: 0xffffff,
      size: 12,
    },
    overlay: {
      backgroundColor: 0x2a2a2a,
      borderColor: 0x666666,
      borderWidth: 1,
      cornerRadius: 4,
      maxHeight: 300,
      padding: 4,
    },
    option: {
      backgroundColor: 0x00000000, // transparent
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      height: 32,
    },
    optionHover: {
      backgroundColor: 0x3a3a3a,
    },
    optionSelected: {
      backgroundColor: 0x4a9eff,
      textColor: '#ffffff',
    },
    optionDisabled: {
      alpha: 0.3,
    },
    textStyle: {
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'Arial',
    },
    placeholderStyle: {
      color: '#666666',
      fontSize: '14px',
      fontFamily: 'Arial',
    },
    searchInput: {
      backgroundColor: 0x1a1a1a,
      borderColor: 0x666666,
      height: 32,
    },
    animationConfig: 'gentle',
    optionGap: 2,
  },
}
```

---

## 🔧 Implementierung - Schritt für Schritt

### Phase 1: Basic Single-Select Dropdown (4h)

**Datei:** `Dropdown.tsx`

1. **Setup & State Management**

   ```tsx
   - useState für isOpen, selectedValue, hoveredIndex
   - useRef für containerRef, overlayRef
   - useTheme & getThemedProps für Theme-Integration
   ```

2. **Trigger Component**

   ```tsx
   - View mit onClick → Toggle isOpen
   - Text mit selected label oder placeholder
   - Arrow/Indicator (als children übergeben oder Graphics-fallback)
   - Hover State mit useGameObjectEffect

   ⚠️ WICHTIG: Icons sind nicht in @number10/phaserjsx verfügbar!
   - Nutze children Slot für Arrow/Icon
   - Fallback: Simple Graphics Triangle
   - User kann custom Icon/SVG als children übergeben
   ```

3. **Overlay Component (Basic)**

   ```tsx
   - View mit absolute Position (relativ zu Trigger)
   - Berechne Position: below/above Trigger
   - ScrollView für Options-Liste
   - onClick outside → Close (useEffect mit scene.input)
   ```

4. **Option Rendering**

   ```tsx
   - Map über options Array
   - View + Text für jede Option
   - Hover State (useGameObjectEffect)
   - onClick → Select & Close
   ```

5. **Keyboard Navigation (Basic)**
   ```tsx
   - Arrow Up/Down → Navigate hoveredIndex
   - Enter → Select hovered option
   - Escape → Close
   ```

**Output:** Funktionierendes Single-Select Dropdown mit Theme-Support

---

### Phase 2: Multi-Select & Search (3h)

1. **Multi-Select Mode**

   ```tsx
   - selectedValue → selectedValues (Array)
   - Checkbox in Options (wenn multiple=true)
   - closeOnSelect → false by default
   - renderValue → Show "X selected" oder Chips
   ```

2. **Search/Filter**

   ```tsx
   - CharTextInput an der Spitze der Overlay
   - useState für searchQuery
   - Filter options basierend auf query
   - Focus Search Input beim Öffnen
   ```

3. **Custom Rendering**

   ```tsx
   - renderValue Prop → Custom Selected Display
   - renderOption Prop → Custom Option Display
   - prefix/suffix Slots in DropdownOption (user provides Icons)
   - arrow Prop für custom Indicator (user provides)
   ```

   **Icon-Handling:**

   ```tsx
   // User muss Icons selbst bereitstellen (aus test-ui)
   <Dropdown
     options={options}
     arrow={<Icon type="chevron-down" />} // User-provided
   />

   <Dropdown
     options={[
       { value: '1', label: 'Home', prefix: <Icon type="home" /> },
       { value: '2', label: 'User', prefix: <Icon type="user" /> },
     ]}
   />
   ```

**Output:** Vollständiges Feature-Set (Single + Multi + Search)

---

### Phase 3: Animations & Polish (2h)

1. **Spring Animations**

   ```tsx
   - useSpring für Overlay-Height (0 → actualHeight)
   - Arrow Rotation (0° → 180°)
   - Option Hover Effects (scale, opacity)
   ```

2. **Portal/Layer System**

   ```tsx
   - Overlay muss über Parent Container rendern
   - Erstelle "Overlay Layer" in Scene (höchster Depth)
   - mountJSX in Overlay Layer statt in Parent
   ```

3. **Auto-Placement**

   ```tsx
   - Berechne verfügbaren Raum above/below
   - placement='auto' → Automatische Positionierung
   - Flip Dropdown wenn kein Platz
   ```

4. **Accessibility Improvements**
   ```tsx
   - Focus Management (Tab Key)
   - ARIA-like Properties (role, aria-expanded)
   - Disabled State für Options
   ```

**Output:** Production-Ready Dropdown mit Animations & Smart Placement

---

### Phase 4: Testing & Examples (1h)

1. **Unit Tests**

   ```tsx
   - packages/ui/src/components/custom/Dropdown.test.tsx
   - Test: Open/Close
   - Test: Selection (Single/Multi)
   - Test: Keyboard Navigation
   - Test: Search Filter
   ```

2. **Example Component**

   ```tsx
   - apps/test-ui/src/examples/DropdownExample.tsx
   - Single-Select Beispiel
   - Multi-Select Beispiel
   - Searchable Beispiel
   - Custom Rendering Beispiel
   - Disabled State Beispiel
   ```

3. **Theme Example**
   ```tsx
   - apps/test-ui/src/Theme.tsx
   - Custom Dropdown Theme
   - Variants (primary, outline, etc.)
   ```

**Output:** Getestete Komponente mit vollständiger Dokumentation

---

## 🎯 Technische Details

### Portal/Layer System

**Problem:** Overlay muss über Parent-Container rendern (z-index)

**Lösung:**

```tsx
// Create overlay layer in scene (once)
const overlayLayer = scene.add.container(0, 0)
overlayLayer.setDepth(10000) // Highest depth

// Mount dropdown overlay into overlay layer
mountJSX(<DropdownOverlay {...props} />, scene, overlayLayer)
```

**Alternative (einfacher für Phase 1):**

```tsx
// Setze Overlay Depth sehr hoch
<View depth={1000}>{/* Overlay Content */}</View>
```

### Position Calculation

**⚠️ WICHTIG: Nutze Layout-System, NICHT getBounds()!**

```tsx
// ❌ FALSCH: getBounds() ist trügerisch (besonders bei rotation!)
// const triggerBounds = triggerRef.current?.getBounds()

// ✅ RICHTIG: Nutze Layout-System Dimensionen
const triggerContainer = triggerRef.current as GameObjectWithLayout
const triggerSize = triggerContainer?.__getLayoutSize?.() ?? { width: 0, height: 0 }
const triggerX = triggerContainer?.x ?? 0
const triggerY = triggerContainer?.y ?? 0

// Calculate overlay position
const overlayX = triggerX
const overlayY =
  placement === 'bottom'
    ? triggerY + triggerSize.height + 4 // 4px gap
    : triggerY - overlayHeight - 4

// Auto-placement logic
if (placement === 'auto') {
  const spaceBelow = scene.scale.height - (triggerY + triggerSize.height)
  const spaceAbove = triggerY

  if (spaceBelow < overlayHeight && spaceAbove > spaceBelow) {
    // Place above
    overlayY = triggerY - overlayHeight - 4
  } else {
    // Place below
    overlayY = triggerY + triggerSize.height + 4
  }
}
```

**Warum Layout-System statt getBounds():**

- `getBounds()` liefert falsche Werte bei rotation/scale
- `__getLayoutSize()` ist die Quelle der Wahrheit
- Position via `x`/`y` Properties ist präzise
- Layout-System kennt die echten Dimensionen

### Keyboard Navigation

**⚠️ WICHTIG: Nur wenige Komponenten nutzen Keyboard bisher (CharTextInput)**

```tsx
useEffect(() => {
  if (!isOpen) return

  // Nutze scene.input.keyboard (Phaser native)
  const keyboard = scene.input.keyboard
  if (!keyboard) return

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHoveredIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHoveredIndex((prev) => Math.max(prev - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (hoveredIndex >= 0) {
        handleSelect(filteredOptions[hoveredIndex].value)
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
    }
  }

  keyboard.on('keydown', handleKeyDown)

  return () => {
    keyboard.off('keydown', handleKeyDown)
  }
}, [isOpen, hoveredIndex, filteredOptions])
```

**Alternative: KeyboardInputManager**

```tsx
// CharTextInput-style Keyboard-Handling
import { KeyboardInputManager } from '../../utils/KeyboardInputManager'

const keyboardManager = new KeyboardInputManager(container, {
  onKeyDown: (event) => {
    // Handle keyboard events
  },
})
```

### Click Outside Detection

```tsx
useEffect(() => {
  if (!isOpen) return

  const handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    // ✅ Check if click is inside using Layout-System dimensions
    const triggerContainer = triggerRef.current as GameObjectWithLayout
    const overlayContainer = overlayRef.current as GameObjectWithLayout

    // Helper: Check if point is inside container
    const isInside = (container: GameObjectWithLayout | null, px: number, py: number) => {
      if (!container) return false

      const size = container.__getLayoutSize?.() ?? { width: 0, height: 0 }
      const x = container.x ?? 0
      const y = container.y ?? 0

      return px >= x && px <= x + size.width && py >= y && py <= y + size.height
    }

    const clickedInside =
      isInside(triggerContainer, pointer.x, pointer.y) ||
      isInside(overlayContainer, pointer.x, pointer.y)

    if (!clickedInside) {
      setIsOpen(false)
    }
  }

  scene.input.on('pointerdown', handlePointerDown)

  return () => {
    scene.input.off('pointerdown', handlePointerDown)
  }
}, [isOpen])
```

---

## 📦 Dateistruktur

```
packages/ui/src/components/custom/
├── Dropdown.tsx              # Main component (400 lines)
│   ├── DropdownProps
│   ├── DropdownOption
│   ├── Dropdown()
│   ├── DropdownTrigger() (internal)
│   ├── DropdownOverlay() (internal)
│   ├── DropdownOptionItem() (internal)
│   └── DefaultArrow() (simple Graphics triangle fallback)
│
└── Dropdown.test.tsx         # Tests (100 lines)

packages/ui/src/layout/types.ts
└── GameObjectWithLayout (bereits vorhanden)
    └── __getLayoutSize() nutzen!

packages/ui/src/theme-custom.ts
└── DropdownTheme interface

packages/ui/src/theme-defaults.ts
└── Dropdown default theme

apps/test-ui/src/examples/
└── DropdownExample.tsx       # Examples (200 lines)
```

---

## ✅ Checkliste

### MVP (Phase 1)

- [ ] Basic Dropdown Component Setup
- [ ] Trigger mit Toggle-Funktionalität
- [ ] Overlay mit Options-Liste
- [ ] Single-Select Logic
- [ ] Basic Theme-Integration
- [ ] Keyboard Navigation (Arrow, Enter, Escape)
- [ ] Click Outside to Close
- [ ] Basic Animation (Fade In/Out)

### Full Feature Set (Phase 2)

- [ ] Multi-Select Mode
- [ ] Search/Filter Functionality
- [ ] Custom renderValue
- [ ] Custom renderOption
- [ ] Icon Support in Options
- [ ] Disabled State (Component & Options)

### Polish (Phase 3)

- [ ] Spring Animations (Height, Arrow)
- [ ] Auto-Placement Logic
- [ ] Portal/Layer System (proper z-index)
- [ ] Hover Effects mit useGameObjectEffect
- [ ] Focus Management
- [ ] Performance Optimization (Virtual Scroll bei >100 Options?)

### Testing & Docs (Phase 4)

- [ ] Unit Tests (Vitest)
- [ ] Example Component
- [ ] Theme Example
- [ ] JSDoc Comments
- [ ] README Update

---

## 🚀 Next Steps

1. ✅ **Plan erstellt** → Review & Feedback
2. ⏭️ **Phase 1:** Basic Dropdown implementieren (4h)
3. ⏭️ **Phase 2:** Multi-Select & Search (3h)
4. ⏭️ **Phase 3:** Animations & Polish (2h)
5. ⏭️ **Phase 4:** Testing & Examples (1h)

**Gesamtaufwand:** ~10 Stunden = 1.5 Arbeitstage

---

## ⚠️ Wichtige Design-Entscheidungen

### 1. Layout-System statt getBounds()

- **Nutze:** `__getLayoutSize()`, `x`, `y` Properties
- **Vermeide:** `getBounds()` (falsch bei rotation/scale!)
- **Grund:** Layout-System ist Source of Truth

### 2. Icons/Arrow Handling

- **Problem:** @number10/phaserjsx hat keine Icons
- **Lösung:** User übergibt Icons als children/props
- **Fallback:** Simple Graphics Triangle als Default-Arrow
- **Beispiel:**

  ```tsx
  // In test-ui (hat Icons):
  <Dropdown arrow={<Icon type="chevron-down" />} />

  // Ohne Icons (nutzt fallback):
  <Dropdown /> // → Graphics Triangle
  ```

### 3. Keyboard Events

- **Status:** Selten genutzt (nur CharTextInput bisher)
- **Nutze:** `scene.input.keyboard` (Phaser native)
- **Alternative:** `KeyboardInputManager` (wie CharTextInput)
- **Cleanup:** Wichtig für Memory Leaks!

### 4. Container Width/Height

- **Nutze:** `container.width`, `container.height` (Phaser Properties)
- **Oder:** `__getLayoutSize()` für Layout-Dimensionen
- **Beispiel:** Siehe ScrollView (Line 73-76)

---

## 💡 Optimierungen & Future Ideas

### Performance

- Virtual Scrolling bei >100 Options (Phase 3+)
- Memoization von gefilterten Options
- Lazy Loading von Option Content

### UX

- Grouped Options (Optgroups)
- Option Dividers
- Loading State
- Empty State ("No results found")
- Clear Button (für Single-Select)

### Advanced Features

- Async Options Loading
- Infinite Scroll
- Creatable Options (Add new on Enter)
- Tags/Chips für Multi-Select Display
- Max Selected Limit

---

**Status:** 📋 Plan fertig, bereit für Implementation!
