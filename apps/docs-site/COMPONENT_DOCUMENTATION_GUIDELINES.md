# Component Documentation Guidelines

## Overview

This document defines the standard approach for documenting PhaserJSX UI components. Follow this structure for consistency across all component documentation.

## File Structure

Every documented component requires **three files**:

### 1. Content Definition (`src/content/{component}.content.ts`)

TypeScript file containing all documentation content using the `ComponentDocs` interface.

**Template:**

```typescript
/**
 * {Component} component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  QuickStart{Component}Example,
  // ... other examples
} from '@/examples/{component}'
import type { ComponentDocs } from '@/types/docs'

export const {component}Content: ComponentDocs = {
  title: '{Component}',
  description: 'Brief description of the component purpose and key features.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Most basic usage - minimal example',
    component: QuickStart{Component}Example,
    height: SCENE_SIZES.compact,
    code: `/** @jsxImportSource @phaserjsx/ui */
// Minimal working example code here
`,
  },

  examples: [
    {
      id: 'example-1',
      title: 'Example Title',
      description: 'What this example demonstrates',
      component: Example1{Component}Example,
      height: SCENE_SIZES.small,
      code: `/** @jsxImportSource @phaserjsx/ui */
// Example code here
`,
    },
    // More examples in progressive complexity order
  ],

  propsEssential: [
    // Top 5-7 most important props
  ],

  propsComplete: [
    // All props including essential + advanced
  ],

  inherits: [
    {
      component: 'ParentComponent',
      link: '/components/parent',
      description: 'Inherits all layout/styling props from ParentComponent',
    },
  ],
}
```

### 2. Example Components (`src/examples/{component}/`)

Separate PhaserJSX components for each example.

**Structure:**

```
src/examples/{component}/
├── index.ts              # Re-exports all examples
├── QuickStartExample.tsx # Most basic example
├── Example1.tsx          # Progressive examples...
├── Example2.tsx
└── ...
```

**Example Template:**

```tsx
/**
 * {Component} {Feature} Example - Brief description
 */
/** @jsxImportSource @phaserjsx/ui */
import { Component, View } from '@phaserjsx/ui'

export function Feature{Component}Example() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      {/* Focused example demonstrating specific feature */}
    </View>
  )
}
```

**Example Guidelines:**

- Each file exports ONE example function
- Use descriptive names: `{Feature}{Component}Example`
- Add JSDoc comment explaining what's demonstrated
- Always include `@jsxImportSource @phaserjsx/ui`
- Keep examples focused on one concept
- Use consistent padding/layout for visual consistency

### 3. Documentation Page (`src/pages/Components/{Component}Page.tsx`)

React component rendering the documentation UI.

**Template:**

```tsx
/**
 * {Component} Component Documentation Page
 */
/** @jsxImportSource react */
import {
  DocDescription,
  ExampleSection,
  InheritedProps,
  PropsTable,
  Section,
  SectionDescription,
  ToggleButton,
} from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { {component}Content } from '@/content/{component}.content'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

export function {Component}Page() {
  const [showAllProps, setShowAllProps] = useState(false)

  return (
    <DocLayout>
      <h1>{componentContent.title}</h1>
      <DocDescription>{componentContent.description}</DocDescription>

      <Section title="Quick Start">
        <SectionDescription>{componentContent.quickStart.description}</SectionDescription>
        <LiveExample
          sceneFactory={() =>
            createPhaserScene(
              componentContent.quickStart.component,
              undefined,
              componentContent.quickStart.background
            )
          }
          height={componentContent.quickStart.height}
          background={componentContent.quickStart.background}
        />
        <div className="code-wrapper">
          <CodeBlock language="tsx">{componentContent.quickStart.code}</CodeBlock>
        </div>
      </Section>

      <Section title="Examples">
        {componentContent.examples.map((example) => (
          <ExampleSection key={example.id} example={example} />
        ))}
      </Section>

      <Section title="API Reference">
        <h3>{Component} Props</h3>
        <PropsTable props={componentContent.propsEssential} />

        <ToggleButton
          isActive={showAllProps}
          activeText="← Show Essential Props Only"
          inactiveText="Show All {Component} Props →"
          onClick={() => setShowAllProps(!showAllProps)}
        />

        {showAllProps && (
          <div className="toggle-section">
            <h3>Complete {Component} Props</h3>
            <PropsTable props={componentContent.propsComplete} />
          </div>
        )}

        {componentContent.inherits && <InheritedProps inherits={componentContent.inherits} />}
      </Section>
    </DocLayout>
  )
}
```

## Content Guidelines

### Quick Start Section

- **Purpose:** Show the absolute minimum code to use the component
- **Complexity:** Keep it simple - one component, minimal props
- **Height:** Use `SCENE_SIZES.compact` (150px) unless component needs more space
- **Code:** Match the example component exactly

### Examples Section

- **Order:** Progressive complexity (basic → advanced)
- **Coverage:** Demonstrate all major features
- **Typical Examples:**
  - Variants/Styles (if applicable)
  - States (disabled, active, loading, etc.)
  - With Icons
  - Sizing & Layout
  - Effects/Animations
  - Theme Integration
  - Event Handling
  - Advanced Compositions

### Props Tables

#### Essential Props (`propsEssential`)

- Top 5-7 most important props
- Props needed for 80% of use cases
- Include: core functionality, variants, common interactions
- Shown by default

#### Complete Props (`propsComplete`)

- All props including essential ones
- Include advanced customization options
- Hidden behind "Show All Props" toggle
- Full reference for power users

**Prop Definition Format:**

```typescript
{
  name: 'propName',
  type: 'string | number',
  default: '"default-value"',  // Optional, quoted for strings
  description: 'Clear, concise explanation of what this prop does'
}
```

### Inherited Props

- Document component inheritance chain
- Link to parent component documentation
- Explain what functionality is inherited

## Scene Heights (`SCENE_SIZES`)

Use predefined constants for consistency:

```typescript
import { SCENE_SIZES } from '@/constants/scene-sizes'

SCENE_SIZES.compact // 150px - Quick start, single element
SCENE_SIZES.small // 250px - Simple examples, few elements
SCENE_SIZES.medium // 400px - Complex layouts, multiple elements
SCENE_SIZES.large // 600px - Advanced examples, rich demos
```

## Code Examples Best Practices

### Always Include

- `/** @jsxImportSource @phaserjsx/ui */` pragma
- Necessary imports
- Working, copy-paste ready code
- Proper indentation (2 spaces)

### JSDoc Comments

- Add brief description for each example file
- Explain what specific feature is demonstrated

### Example Code Format

```tsx
/** @jsxImportSource @phaserjsx/ui */
import { Component, Text, View } from '@phaserjsx/ui'

export function FeatureExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <Component>
        <Text text="Example Content" />
      </Component>
    </View>
  )
}
```

### Component-Specific Patterns

#### Text Component Styling

The `Text` component uses Phaser's `style` prop for visual styling instead of direct props:

```tsx
// ✅ Correct - Use style object with Phaser format
<Text text="Hello" style={{ color: '#ffffff', fontSize: '20px' }} />

// ❌ Wrong - Direct props don't exist
<Text text="Hello" color={0xffffff} fontSize={20} />
```

**Common Text style properties:**

- `color: '#hexcolor'` - Text color (CSS hex format)
- `fontSize: '20px'` - Font size (string with unit)
- `fontFamily: 'Arial'` - Font family
- `fontStyle: 'bold'` - Font style (bold, italic, etc.)
- `align: 'center'` - Text alignment

#### Color Format Guidelines

**Background/Border colors** (View, Button, etc.):

```tsx
<View backgroundColor={0x3498db} borderColor={0xe74c3c} />
```

- Use hex number format: `0xRRGGBB`
- Example: `0x3498db` (blue), `0xe74c3c` (red)

**Text colors** (via style prop):

```tsx
<Text text="Hello" style={{ color: '#3498db' }} />
```

- Use CSS hex string format: `'#RRGGBB'`
- Example: `'#3498db'` (blue), `'#e74c3c'` (red)

## Integration Checklist

After creating documentation files:

1. **Export page in routing:**

   ```typescript
   // src/pages/Components/index.ts
   export { ComponentPage } from './ComponentPage'
   ```

2. **Add route:**

   ```typescript
   // src/App.tsx
   import { ComponentPage } from '@/pages'

   <Route path="/components/component" element={<ComponentPage />} />
   ```

3. **Update sidebar:**

   ```typescript
   // src/components/Layout/Sidebar.tsx
   {
     title: 'Components',
     items: [
       // ...
       { label: 'Component', path: '/components/component' },
     ]
   }
   ```

## Quality Standards

- **Code Quality:** All example code must be valid, runnable PhaserJSX
- **Type Safety:** Full TypeScript types, no `any`
- **Comments:** English only, JSDoc for all exports
- **Consistency:** Follow existing Button documentation as reference
- **Progressive Learning:** Start simple, build complexity gradually
- **Visual Consistency:** Use consistent padding/spacing in examples
- **Accessibility:** Consider disabled states, keyboard navigation where applicable

## Reference Implementation

See `Button` component documentation as the canonical reference:

- `/apps/docs-site/src/content/button.content.ts`
- `/apps/docs-site/src/examples/button/`
- `/apps/docs-site/src/pages/Components/ButtonPage.tsx`

## Common Pitfalls & Solutions

### Empty View is Invisible

An empty `<View />` without background or content won't be visible:

```tsx
// ❌ Invisible - no background, no content
<View width={200} height={100} />

// ✅ Visible - has background
<View width={200} height={100} backgroundColor={0x3498db} />

// ✅ Visible - has content
<View width={200} height={100}>
  <Text text="Content" />
</View>
```

**Documentation tip:** Mention this in component descriptions where applicable, especially for View.

### Text Styling Confusion

Common mistake: trying to use color/fontSize as direct props on Text.

**Solution in docs:** Always show Text with `style` prop in examples, never with direct styling props.

## Notes

- This structure ensures consistency, maintainability, and great DX
- Separation of content/examples/pages allows independent updates
- Type safety via `ComponentDocs` interface catches errors early
- Progressive disclosure (essential → all props) balances clarity and completeness
- **View component documentation** provides additional reference for layout-focused components
