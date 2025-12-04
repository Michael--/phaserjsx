# Documentation & Showcase Strategy für @phaserjsx/ui

**Stand:** 4. Dezember 2025  
**Ziel:** Professionelle, online-fähige Dokumentations- und Showcase-Lösung

---

## 🎯 Problem Statement

Die aktuelle `test-ui` App ist:

- ✅ Gut für lokale Entwicklung
- ❌ Unhandlich als Demo/Dokumentation
- ❌ Nicht online-publishable (keine HTML-Doku)
- ❌ Keine Code-Samples neben den Examples
- ❌ Keine API-Dokumentation
- ❌ Single-App-Ansatz (zu fett)

**Anforderungen:**

1. Live-Examples (echte Phaser-Canvas mit Interaktivität)
2. Code-Samples (TypeScript/JSX Source)
3. API-Dokumentation (Props, Types, etc.)
4. Online-Deploy (GitHub Pages, Netlify, etc.)
5. Wartbar & skalierbar
6. Nicht mehrere separate Apps

---

## 📊 Analyse: Existierende Lösungen

### Option 1: **Storybook** (UI Component Standard)

**Was ist Storybook?**

- De-facto Standard für React/Vue/Angular Component Libraries
- Isolierte Component Stories (ein State = eine Story)
- Addons für Controls, Actions, Docs, etc.
- Automatische Props-Dokumentation (über TypeScript)
- GitHub Pages Deploy

**Pros:**

- ✅ Industry Standard (bekannt, vertraut)
- ✅ Riesiges Ecosystem (Addons)
- ✅ Automatische Docs aus TypeScript
- ✅ Controls für Props (Interactive Playground)
- ✅ Sehr gute Online-Docs (storybook.js.org)
- ✅ MDX Support (Markdown + JSX)
- ✅ Multi-Framework (React, Vue, etc.)

**Cons:**

- ❌ **KRITISCH:** Kein Phaser-Support out-of-the-box
  - Phaser benötigt Canvas + Game Instance
  - Storybook ist DOM-fokussiert (nicht Canvas)
  - Story-Isolation könnte schwierig sein (Phaser.Game Lifecycle)
- ❌ Overhead (schwere Dependencies)
- ❌ Custom Renderer nötig (Phaser-spezifisch)
- ❌ Weniger Kontrolle über Layout

**Umsetzbarkeit:** 🟡 **MÖGLICH, ABER AUFWENDIG**

- Bräuchten Custom Renderer für Phaser
- Jede Story = eigene Phaser.Game Instance?
- Lifecycle-Management komplex

**Aufwand:** ~5-7 Tage (Custom Renderer + Setup)

---

### Option 2: **Docusaurus** (Documentation Sites)

**Was ist Docusaurus?**

- Dokumentations-Generator (Markdown + React Components)
- Von Facebook/Meta entwickelt
- Designed für API-Docs, Guides, Tutorials
- React-basiert (kann React Components embedden)
- Algolia Search Integration
- Versioning Support

**Pros:**

- ✅ Sehr gut für Docs + Guides
- ✅ MDX Support (Markdown + JSX)
- ✅ React Components embeddable
- ✅ SEO-freundlich
- ✅ Sidebar Navigation (gut für viele Examples)
- ✅ Dark Mode built-in
- ✅ Versioning (wichtig für Releases)
- ✅ Blog Support (Changelogs, Announcements)

**Cons:**

- ❌ Kein Component Showcase (manuell bauen)
- ❌ Props-Tables manuell erstellen
- ❌ Weniger Interactive als Storybook
- ❌ **Phaser-Integration:** Müssen wir selbst bauen

**Umsetzbarkeit:** 🟢 **GUT**

- Markdown-Docs für Guides/API
- Custom React Components für Live-Examples
- Phaser-Canvas als React Component wrapper

**Aufwand:** ~3-4 Tage (Setup + Custom Components)

---

### Option 3: **Histoire** (Storybook für Vite)

**Was ist Histoire?**

- Modern alternative zu Storybook
- Vite-native (⚡ ultra-fast)
- Vue/Svelte fokussiert (aber auch React möglich)
- Leichtgewichtig
- Sehr ähnliche Story-Konzepte

**Pros:**

- ✅ Vite-native (extrem schnell)
- ✅ Leichtgewichtig vs. Storybook
- ✅ Modern & clean UI
- ✅ MDX-like Docs
- ✅ Controls/Actions

**Cons:**

- ❌ **Noch schlechter für Phaser** als Storybook
- ❌ Kleineres Ecosystem
- ❌ Weniger bekannt
- ❌ Custom Renderer nötig

**Umsetzbarkeit:** 🟡 **MÖGLICH, aber weniger Nutzen als Storybook**

**Aufwand:** ~5 Tage

---

### Option 4: **Custom Vite App** (Full Control)

**Was ist das?**

- Eigene Vite-App als Dokumentations-Site
- Volle Kontrolle über Layout & Features
- Inspiriert von anderen Projekten (z.B. Phaser Labs)
- Mix aus Docs + Live Examples

**Pros:**

- ✅ **VOLLE KONTROLLE** über Phaser-Integration
- ✅ Maßgeschneidert für @phaserjsx/ui
- ✅ Keine Kämpfe mit Frameworks
- ✅ Kann `test-ui` Code wiederverwenden
- ✅ Einfacher zu verstehen & warten
- ✅ Performant (Vite)
- ✅ Flexibles Routing (Vue Router / React Router)

**Cons:**

- ❌ Mehr Custom-Code nötig
- ❌ Keine Props-Auto-Docs (müssen manuell pflegen)
- ❌ Keine Controls/Actions out-of-the-box

**Umsetzbarkeit:** 🟢 **SEHR GUT**

- Können existierende Examples direkt nutzen
- Phaser-Integration ist bekannt
- Full Stack (Vite + React/Vue + Phaser)

**Aufwand:** ~4-5 Tage (von Grund auf) **ODER** ~2 Tage (test-ui umbauen)

---

### Option 5: **Hybrid: Docusaurus + Custom Vite App**

**Was ist das?**

- Docusaurus für Docs, Guides, API Reference (Markdown)
- Separate Vite-App für Interactive Examples (embedded via iframe)
- Oder: Docusaurus mit custom React Components für Phaser

**Pros:**

- ✅ **Best of Both Worlds**
- ✅ Docs & Guides in Markdown (leicht zu schreiben)
- ✅ Live Examples in Vite (volle Kontrolle)
- ✅ Saubere Trennung (Docs vs. Examples)
- ✅ SEO für Docs, Performance für Examples

**Cons:**

- ❌ Zwei separate Systeme (mehr Overhead)
- ❌ Deploy-Komplexität (zwei Builds)
- ❌ Cross-linking zwischen Docs & Examples

**Umsetzbarkeit:** 🟢 **GUT, aber komplex**

**Aufwand:** ~6-7 Tage

---

## 🏆 Empfehlung & Bewertung

### 🥇 **Empfehlung: Option 4 - Custom Vite App** (mit Inspiration von anderen)

**Begründung:**

1. **Phaser-Native:** Wir bauen eine Phaser-Library, Phaser sollte First-Class Citizen sein
2. **Control:** Volle Kontrolle über Layout, Features, Performance
3. **Reusability:** Können existierende `test-ui` Examples direkt nutzen
4. **Simplicity:** Weniger Abstractions, einfacher zu warten
5. **Learning from Others:** Inspirieren uns an erfolgreichen Projekten

**Vergleichstabelle:**

| Kriterium        | Storybook | Docusaurus | Histoire  | Custom Vite        | Hybrid    |
| ---------------- | --------- | ---------- | --------- | ------------------ | --------- |
| Phaser Support   | 🔴 Schwer | 🟡 OK      | 🔴 Schwer | 🟢 Perfekt         | 🟢 Gut    |
| Aufwand          | 5-7d      | 3-4d       | 5d        | 4-5d (2d refactor) | 6-7d      |
| Live Examples    | ✅        | ⚠️ Custom  | ✅        | ✅                 | ✅        |
| Code Samples     | ✅        | ⚠️ Manual  | ✅        | ⚠️ Manual          | ✅        |
| API Docs         | ✅ Auto   | ⚠️ Manual  | ✅ Auto   | ❌ Manual          | ✅ Auto   |
| Controls         | ✅        | ❌         | ✅        | ⚠️ Custom          | ⚠️ Custom |
| Wartbarkeit      | 🟡        | 🟢         | 🟡        | 🟢                 | 🟡        |
| Bekanntheitsgrad | 🟢 High   | 🟢 High    | 🟡 Medium | 🔴 Custom          | 🟡        |
| SEO              | 🟡        | 🟢         | 🟡        | 🟡                 | 🟢        |

**Score:**

- Custom Vite: 🌟🌟🌟🌟🌟 (Best Fit für Phaser-Library)
- Docusaurus: 🌟🌟🌟🌟 (Gut für Docs, weniger für Examples)
- Storybook: 🌟🌟🌟 (Standard, aber Phaser-Integration schwer)
- Hybrid: 🌟🌟🌟🌟 (Gute Lösung, aber Overhead)
- Histoire: 🌟🌟 (Kein Vorteil vs. Custom)

---

## 🎨 Design Konzept: Custom Docs Site

### Architektur

```
docs-site/ (New Vite App)
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Landing Page
│   │   ├── GettingStarted.tsx    # Installation & Quick Start
│   │   ├── Components/
│   │   │   ├── ComponentList.tsx # Component Overview
│   │   │   ├── Button.tsx        # Button Docs + Live Example
│   │   │   ├── Dropdown.tsx
│   │   │   └── ...
│   │   ├── Guides/
│   │   │   ├── ThemeSystem.tsx
│   │   │   ├── LayoutEngine.tsx
│   │   │   └── ...
│   │   └── API/
│   │       ├── Hooks.tsx         # Hook Reference
│   │       └── Types.tsx         # Type Reference
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── DocLayout.tsx     # Page Layout mit Sidebar
│   │   │   ├── Sidebar.tsx       # Navigation
│   │   │   └── Header.tsx
│   │   ├── Example/
│   │   │   ├── LiveExample.tsx   # Phaser Canvas Wrapper
│   │   │   ├── CodeBlock.tsx     # Syntax-Highlighted Code
│   │   │   └── Playground.tsx    # Interactive Controls
│   │   └── Markdown/
│   │       ├── MDXRenderer.tsx   # Markdown Renderer
│   │       └── PropsTable.tsx    # Props Documentation
│   ├── examples/                 # IMPORTED FROM test-ui!
│   │   ├── ButtonExample.tsx
│   │   ├── DropdownExample.tsx
│   │   └── ...
│   └── content/                  # Markdown Docs
│       ├── getting-started.md
│       ├── components/
│       │   ├── button.md
│       │   └── ...
│       └── guides/
│           └── theme-system.md
```

### Features

1. **Live Examples:**
   - Phaser Canvas embedded in Page
   - Code neben dem Canvas (Syntax Highlighting)
   - "Copy Code" Button
   - Optional: Interactive Controls (Props ändern)

2. **Code Samples:**
   - Syntax Highlighting (Shiki / Prism)
   - Copy to Clipboard
   - Multiple Examples pro Component (Tabs)

3. **API Documentation:**
   - Props Tables (manually maintained JSON)
   - Type Definitions (generated from TypeScript)
   - Examples für jeden Prop

4. **Navigation:**
   - Sidebar mit Kategorien (wie test-ui)
   - Search (Flexsearch oder Pagefind)
   - Breadcrumbs
   - "Next/Previous" Navigation

5. **Theme:**
   - Dark/Light Mode (wie test-ui)
   - Consistent mit @phaserjsx/ui Theme

### Technology Stack

```typescript
// Core
- Vite (Build Tool)
- React (UI Framework) - ODER Vue (wenn bevorzugt)
- TypeScript (Type Safety)

// Routing
- React Router v7 (oder TanStack Router)

// Markdown
- MDX (Markdown + JSX Components)
- Remark/Rehype Plugins (Code Highlighting, etc.)

// Code Highlighting
- Shiki (VS Code themes, sehr gut)

// Search
- Pagefind (static search, sehr leicht)

// Deployment
- GitHub Pages (kostenlos)
- Netlify (auch kostenlos, mit Preview Deploys)
```

### Example Page Structure

```tsx
// src/pages/Components/Button.tsx
import { LiveExample } from '@/components/Example/LiveExample'
import { CodeBlock } from '@/components/Example/CodeBlock'
import { PropsTable } from '@/components/Markdown/PropsTable'
import { ButtonExample } from '@/examples/ButtonExample'

export function ButtonPage() {
  return (
    <DocLayout>
      <h1>Button Component</h1>
      <p>Interactive button with theme support...</p>

      {/* Live Example */}
      <LiveExample>
        <ButtonExample />
      </LiveExample>

      {/* Code */}
      <CodeBlock language="tsx">
        {`<Button variant="primary" onClick={() => console.log('Clicked!')}>
  Click Me
</Button>`}
      </CodeBlock>

      {/* Props */}
      <h2>Props</h2>
      <PropsTable component="Button" />

      {/* Examples */}
      <h2>Examples</h2>
      {/* More examples... */}
    </DocLayout>
  )
}
```

---

## 📋 Implementation Plan (Step-by-Step)

### Phase 1: Foundation (Tag 1-2)

**Aufgaben:**

1. ✅ Create new Vite app: `docs-site`
   - `pnpm create vite docs-site --template react-ts`
   - Workspace Setup in `pnpm-workspace.yaml`
2. ✅ Setup Routing (React Router v7)
3. ✅ Create Basic Layout (Header, Sidebar, Content)
4. ✅ Setup MDX Support (vite-plugin-mdx)
5. ✅ Configure Syntax Highlighting (Shiki)
6. ✅ Dark/Light Mode (reuse from test-ui)

**Deliverables:**

- Working Vite app mit Routing
- Layout with Sidebar
- First Page mit Markdown

---

### Phase 2: Example Integration (Tag 2-3)

**Aufgaben:**

1. ✅ Create `LiveExample` Component (Phaser Canvas wrapper)
2. ✅ Import Examples from `test-ui/examples`
   - Shared package? Or symlink?
3. ✅ Create first Component Page (Button)
   - Live Example
   - Code Sample
   - Props Table (manual JSON)
4. ✅ Test Phaser Lifecycle in Docs Context

**Deliverables:**

- Working Live Examples
- First Component documented

---

### Phase 3: Content Migration (Tag 3-4)

**Aufgaben:**

1. ✅ Migrate alle Examples from test-ui
2. ✅ Create Category Pages (Components, Layout, Theming, etc.)
3. ✅ Write Markdown Docs für:
   - Getting Started
   - Installation
   - Quick Start
4. ✅ Create API Reference Pages (Hooks, Components)

**Deliverables:**

- Alle Examples integriert
- Basic Docs fertig

---

### Phase 4: Enhanced Features (Tag 4-5)

**Aufgaben:**

1. ✅ Add Search (Pagefind)
2. ✅ Add Copy Code Button
3. ✅ Add Props Tables (generate from TS?)
4. ✅ Add Interactive Playground (optional)
   - Controls für Props
   - Real-time Preview
5. ✅ Responsive Design (Mobile/Tablet)

**Deliverables:**

- Feature-complete Docs Site

---

### Phase 5: Deployment & Polish (Tag 5-6)

**Aufgaben:**

1. ✅ Setup GitHub Actions (Build + Deploy)
2. ✅ Deploy zu GitHub Pages (`https://<user>.github.io/phaserjsx`)
3. ✅ SEO Optimization (meta tags, sitemap)
4. ✅ Performance Optimization (lazy loading, code splitting)
5. ✅ Final Polish (Styling, Animations)

**Deliverables:**

- Live Docs Site online
- CI/CD Pipeline

---

## 🚀 Migration Strategy (test-ui → docs-site)

### Option A: Parallel Existence (Recommended)

```
apps/
├── test-ui/           # Keep for internal development
└── docs-site/         # New public-facing docs
```

**Pros:**

- Test-UI bleibt als Playground
- Docs-Site ist sauber & focused
- Keine Breaking Changes

**Cons:**

- Duplicate Code (Examples)

**Lösung:** Shared Examples Package

```
packages/
├── ui/                # @phaserjsx/ui
└── examples/          # @phaserjsx/examples
    └── src/
        ├── ButtonExample.tsx
        ├── DropdownExample.tsx
        └── ...

apps/
├── test-ui/           # Import from @phaserjsx/examples
└── docs-site/         # Import from @phaserjsx/examples
```

---

### Option B: Replace test-ui (Not Recommended)

- ❌ Verlieren Playground-Funktionalität
- ❌ Mehr Breaking Changes

---

## 💡 Inspiration: Erfolgreiche Docs Sites

### 1. **Chakra UI Docs** (chakra-ui.com)

- Sehr clean & modern
- Live Examples + Code
- Props Tables
- Dark Mode
- Search
- **Tech:** Docusaurus

### 2. **Material-UI Docs** (mui.com)

- Interactive Examples
- Code Playground
- API Tables (auto-generated)
- **Tech:** Custom Next.js App

### 3. **Mantine Docs** (mantine.dev)

- Very polished
- Interactive Controls
- Code Samples
- **Tech:** Custom Vite App (!)

### 4. **Radix UI Docs** (radix-ui.com)

- Focus auf API & Accessibility
- Clean Design
- **Tech:** Custom Next.js

**Gemeinsame Muster:**

- Sidebar Navigation
- Live Examples + Code Side-by-Side
- Dark/Light Mode
- Search
- Props Documentation
- Category-based Organization

---

## 📊 Success Metrics

Nach Launch:

1. ✅ Alle 30+ Components dokumentiert
2. ✅ Live Examples für jeden Component
3. ✅ Code Samples kopierbar
4. ✅ API Reference vollständig
5. ✅ Search funktioniert
6. ✅ Mobile-responsive
7. ✅ <3s Page Load Time
8. ✅ GitHub Pages Deployment

---

## 🔮 Future Enhancements (Post-MVP)

1. **TypeScript API Generation:**
   - Auto-generate Props Tables from TSDoc
   - Tool: `typedoc` oder `api-extractor`

2. **Interactive Playground:**
   - Live Code Editor (Monaco Editor)
   - Props Controls (Knobs)
   - Real-time Preview

3. **Examples Gallery:**
   - Community Examples
   - Templates & Boilerplates

4. **Blog/Changelog:**
   - Release Notes
   - Tutorials
   - Case Studies

5. **Versioning:**
   - Docs für v1.0, v1.1, etc.
   - Version Switcher

---

## 🎯 Final Recommendation

### **GO WITH: Custom Vite Docs App**

**Next Steps:**

1. Create `apps/docs-site` (Vite + React + TypeScript)
2. Setup Basic Layout & Routing
3. Create `packages/examples` (shared examples)
4. Migrate first 5 Components (Button, Dropdown, Checkbox, Toggle, Slider)
5. Deploy Preview to Netlify
6. Iterate & Improve

**Timeline:** 5-6 Tage Full-Time (oder 2-3 Wochen part-time)

**ROI:**

- ✅ Professionelle Präsentation
- ✅ Einfacher für neue User (Documentation)
- ✅ Bessere Adoption (npm Package)
- ✅ SEO & Discoverability
- ✅ Community Contributions

---

## 📚 Resources & Tools

### Build Tools

- Vite: https://vite.dev
- Vite Plugin MDX: https://github.com/brillout/vite-plugin-mdx

### Syntax Highlighting

- Shiki: https://shiki.style
- Prism: https://prismjs.com

### Search

- Pagefind: https://pagefind.app
- FlexSearch: https://github.com/nextapps-de/flexsearch

### Markdown

- MDX: https://mdxjs.com
- Remark/Rehype: https://unifiedjs.com

### Deployment

- GitHub Pages: https://pages.github.com
- Netlify: https://netlify.com

### Inspiration

- Mantine: https://mantine.dev (Custom Vite!)
- Chakra UI: https://chakra-ui.com
- Radix UI: https://radix-ui.com

---

## 🚨 CRITICAL: JSX-Namespace-Konflikt (React vs. PhaserJSX)

### Problem-Analyse

Die Docs-Site (React) und PhaserJSX nutzen **beide JSX**, aber mit **unterschiedlichen Runtimes**:

**PhaserJSX:**

```typescript
// packages/ui/tsconfig.json
{
  "jsx": "react-jsx",
  "jsxImportSource": "."  // → @phaserjsx/ui
}

// Component File
/** @jsxImportSource @phaserjsx/ui */
<View>...</View>  // → VNode (Phaser GameObject)
```

**React (für Docs):**

```typescript
// docs-site/tsconfig.json
{
  "jsx": "react-jsx",
  "jsxImportSource": "react"  // → React
}

// Docs File
/** @jsxImportSource react */
<div>...</div>  // → ReactElement (DOM)
```

### Potenzielle Konflikte

#### 1. **TypeScript JSX-Namespace Kollision**

```tsx
// ❌ PROBLEM: Beide wollen den gleichen JSX namespace!
// PhaserJSX File
/** @jsxImportSource @phaserjsx/ui */
<View>...</View>  // → VNode

// React File (same project)
/** @jsxImportSource react */
<div>...</div>    // → ReactElement
```

#### 2. **Component Name Collisions**

```tsx
// ❌ KONFLIKT: Beide haben <Button>, <View>, etc.
import { Button as PhaserButton } from '@phaserjsx/ui'
import { Button as ReactButton } from 'react-component-lib'
```

#### 3. **Mixed Rendering (GEHT NICHT)**

```tsx
// ❌ UNMÖGLICH: React kann Phaser-Components nicht rendern
function DocPage() {
  return (
    <div>
      {' '}
      {/* React DOM */}
      <ButtonExample /> {/* PhaserJSX - different runtime! */}
    </div>
  )
}
```

---

## ✅ Lösung: Klare Separation + Canvas Isolation

### Architektur-Pattern (EMPFOHLEN)

**Konzept:** React rendert nur das Docs-Layout, Phaser läuft in isoliertem Canvas

```
docs-site/ (React + Vite)
├── src/
│   ├── pages/                    # React Components (@jsxImportSource react)
│   │   └── ButtonPage.tsx        # Docs UI (HTML/CSS)
│   ├── components/               # React Components
│   │   └── LiveExample.tsx       # React wrapper für Phaser Canvas
│   └── utils/
│       └── phaser-bridge.ts      # Phaser Scene Factory
│
packages/examples/ (PhaserJSX)
└── src/
    └── ButtonExample.tsx         # @jsxImportSource @phaserjsx/ui
```

### Implementation Example

#### 1. React Docs Page (HTML UI)

```tsx
// docs-site/src/pages/ButtonPage.tsx
/** @jsxImportSource react */
import { LiveExample } from '@/components/LiveExample'
import { CodeBlock } from '@/components/CodeBlock'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { ButtonExample } from '@phaserjsx/examples'

export function ButtonPage() {
  return (
    <div>
      {' '}
      {/* React DOM */}
      <h1>Button Component</h1>
      <p>Interactive button with theme support...</p>
      {/* Phaser Canvas Container */}
      <LiveExample sceneFactory={() => createPhaserScene(ButtonExample)} />
      <CodeBlock language="tsx">
        {`/** @jsxImportSource @phaserjsx/ui */
import { Button } from '@phaserjsx/ui'

<Button>Click Me</Button>`}
      </CodeBlock>
    </div>
  )
}
```

#### 2. PhaserJSX Example (Phaser GameObjects)

```tsx
// packages/examples/src/ButtonExample.tsx
/** @jsxImportSource @phaserjsx/ui */
import { Button, View } from '@phaserjsx/ui'

export function ButtonExample() {
  return (
    <View>
      {' '}
      {/* PhaserJSX VNode → Phaser Container */}
      <Button onClick={() => console.log('Clicked!')}>Click Me</Button>
    </View>
  )
}
```

#### 3. Bridge Component (React → Phaser)

```tsx
// docs-site/src/components/LiveExample.tsx
/** @jsxImportSource react */
import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

interface LiveExampleProps {
  sceneFactory: () => typeof Phaser.Scene
}

export function LiveExample({ sceneFactory }: LiveExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create isolated Phaser Game instance
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#2d2d2d',
      scene: sceneFactory(),
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [sceneFactory])

  return (
    <div
      ref={containerRef}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  )
}
```

#### 4. Phaser Scene Factory

```typescript
// docs-site/src/utils/phaser-bridge.ts
import Phaser from 'phaser'
import { mount } from '@phaserjsx/ui'
import type { VNode } from '@phaserjsx/ui'

/**
 * Creates a Phaser Scene that mounts a PhaserJSX component
 */
export function createPhaserScene(component: () => VNode) {
  return class ExampleScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ExampleScene' })
    }

    create() {
      // Mount PhaserJSX component into this scene
      mount(component(), this)
    }
  }
}
```

### TypeScript Configuration

#### docs-site/tsconfig.json (React)

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react", // ← Default: React
    "types": ["vite/client", "node"]
  },
  "include": ["src/**/*"]
}
```

#### packages/examples/tsconfig.json (PhaserJSX)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@phaserjsx/ui", // ← Default: PhaserJSX
    "types": ["phaser"]
  },
  "include": ["src/**/*"]
}
```

### Key Principles

1. ✅ **Never mix** React JSX + Phaser JSX in same file
2. ✅ **Use `@jsxImportSource`** pragma in jeder file (explizit!)
3. ✅ **Bridge Pattern:** React wraps Phaser Canvas (kein direktes Rendering)
4. ✅ **Separate Packages:**
   - `docs-site/` → React (HTML/CSS UI)
   - `packages/examples/` → PhaserJSX (Phaser GameObjects)
5. ✅ **Isolation:** Jeder Phaser Example läuft in eigener Game Instance

### Vorteile dieser Lösung

- ✅ **Klare Trennung:** React für Navigation/Layout, Phaser für Examples
- ✅ **Keine Konflikte:** Different files, different JSX sources
- ✅ **TypeScript happy:** Jede File hat eigenen JSX namespace
- ✅ **Bewährt:** Proven pattern (Phaser Labs, Excalibur.js, etc.)
- ✅ **Wartbar:** Klare Grenzen zwischen Docs & Examples
- ✅ **Flexibel:** Können React-Ecosystem nutzen (Router, MDX, etc.)

### Alternative Lösungen (nicht empfohlen)

#### Option B: Pure HTML Docs (Kein React)

- ✅ Keine JSX-Konflikte
- ❌ Weniger DX, mehr manual work
- ❌ Kein Component Model für Docs UI

#### Option C: Astro (Island Architecture)

- ✅ Static HTML + Islands
- ✅ Kein JSX-Konflikt (eigenes Template System)
- ⚠️ Neue Technologie, mehr Setup-Zeit

---

**Status:** Ready for Implementation 🚀
