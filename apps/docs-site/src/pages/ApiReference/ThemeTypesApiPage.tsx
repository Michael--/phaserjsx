/**
 * Theme Types API Reference
 */
/** @jsxImportSource react */
import { DocDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

export function ThemeTypesApiPage() {
  return (
    <DocLayout>
      <h1>API Reference: Theme Types</h1>
      <DocDescription>
        Type definitions for the theming system. Centralized styling for components through
        type-safe theme definitions.
      </DocDescription>
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="mb-4">
          The theme system provides centralized styling for all components through type-safe theme
          definitions. Themes support component-specific styles, nested component themes, and
          runtime theme switching.
        </p>
      </section>

      {/* Theme */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Theme</h2>
        <p className="mb-4">
          Complete theme definition with all component styles. Built-in components are required,
          custom components are optional.
        </p>
        <CodeBlock language="typescript">
          {`type Theme = {
  [K in keyof BuiltInComponentThemes]: BuiltInComponentThemes[K]
} & {
  [K in keyof CustomComponentThemes]?: CustomComponentThemes[K]
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Example:</h4>
          <CodeBlock language="typescript">
            {`const myTheme: Theme = {
  View: {
    backgroundColor: 0x1a1a1a,
    cornerRadius: 8,
  },
  Text: {
    style: {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
    },
  },
  Button: {
    backgroundColor: 0x3b82f6,
    padding: { horizontal: 20, vertical: 10 },
  },
  // ... other components
}`}
          </CodeBlock>
        </div>
      </section>

      {/* PartialTheme */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">PartialTheme</h2>
        <p className="mb-4">
          Partial theme allows overriding specific component styles without defining the complete
          theme.
        </p>
        <CodeBlock language="typescript">
          {`type PartialTheme = {
  [K in keyof ComponentThemes]?: Partial<ComponentThemes[K]>
} & {
  __colorPreset?: {
    name: string
    mode?: 'light' | 'dark'
  }
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Example:</h4>
          <CodeBlock language="typescript">
            {`// Override only specific components
const overrides: PartialTheme = {
  Button: {
    backgroundColor: 0xff0000,
  },
  Text: {
    style: { fontSize: '18px' },
  },
}

// With color preset
const themedOverrides: PartialTheme = {
  __colorPreset: {
    name: 'ocean',
    mode: 'dark',
  },
  Button: {
    cornerRadius: 12,
  },
}`}
          </CodeBlock>
        </div>
      </section>

      {/* Component Themes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Component Themes</h2>
        <p className="mb-4">Individual component theme definitions.</p>

        <div className="space-y-8">
          {/* ViewTheme */}
          <div>
            <h3 className="text-xl font-semibold mb-3">ViewTheme</h3>
            <p className="mb-3">Theme definition for View component.</p>
            <CodeBlock language="typescript">
              {`interface ViewTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    Partial<LayoutProps>,
    Partial<BackgroundProps>,
    NestedComponentThemes {}`}
            </CodeBlock>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold mb-2">Example:</h4>
              <CodeBlock language="typescript">
                {`View: {
  backgroundColor: 0xf3f4f6,
  cornerRadius: 8,
  padding: 16,
  gap: 12,
  // Nested component themes
  Text: {
    style: { color: '#111827' },
  },
}`}
              </CodeBlock>
            </div>
          </div>

          {/* TextTheme */}
          <div>
            <h3 className="text-xl font-semibold mb-3">TextTheme</h3>
            <p className="mb-3">Theme definition for Text component.</p>
            <CodeBlock language="typescript">
              {`interface TextTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    Partial<TextSpecificProps>,
    NestedComponentThemes {
  visible?: boolean | Display
  style?: Phaser.Types.GameObjects.Text.TextStyle
}`}
            </CodeBlock>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold mb-2">Example:</h4>
              <CodeBlock language="typescript">
                {`Text: {
  style: {
    fontFamily: 'Inter',
    fontSize: '16px',
    color: '#1f2937',
    align: 'left',
  },
  maxWidth: 600,
}`}
              </CodeBlock>
            </div>
          </div>

          {/* IconTheme */}
          <div>
            <h3 className="text-xl font-semibold mb-3">IconTheme</h3>
            <p className="mb-3">Theme definition for Icon component.</p>
            <CodeBlock language="typescript">
              {`interface IconTheme extends Partial<IconProps> {}`}
            </CodeBlock>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold mb-2">Example:</h4>
              <CodeBlock language="typescript">
                {`Icon: {
  size: 24,
  color: 0x6b7280,
  strokeWidth: 2,
}`}
              </CodeBlock>
            </div>
          </div>

          {/* NineSliceTheme */}
          <div>
            <h3 className="text-xl font-semibold mb-3">NineSliceTheme</h3>
            <p className="mb-3">Theme definition for NineSlice component.</p>
            <CodeBlock language="typescript">
              {`interface NineSliceTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  visible?: boolean | Display
  texture?: string
  leftWidth?: number
  rightWidth?: number
  topHeight?: number
  bottomHeight?: number
}`}
            </CodeBlock>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold mb-2">Example:</h4>
              <CodeBlock language="typescript">
                {`NineSlice: {
  texture: 'panel',
  leftWidth: 10,
  rightWidth: 10,
  topHeight: 10,
  bottomHeight: 10,
}`}
              </CodeBlock>
            </div>
          </div>

          {/* Other Component Themes */}
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Sprite, Image, Graphics, TileSprite Themes
            </h3>
            <p className="mb-3">Minimal theme support for Phaser primitives.</p>
            <CodeBlock language="typescript">
              {`interface SpriteTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  visible?: boolean | Display
  texture?: string
  tint?: number
}

interface ImageTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  visible?: boolean | Display
  texture?: string
  tint?: number
}

interface GraphicsTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  visible?: boolean | Display
}

interface TileSpriteTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  visible?: boolean | Display
  texture?: string
  tint?: number
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Nested Component Themes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Nested Component Themes</h2>
        <p className="mb-4">
          Component themes can include nested themes for child components, enabling hierarchical
          styling.
        </p>
        <CodeBlock language="typescript">
          {`type NestedComponentThemes = {
  [K in Exclude<
    keyof ComponentThemes,
    'view' | 'text' | 'nineslice' | 'sprite' | 'image' | 'graphics' | 'tilesprite'
  >]?: Partial<ComponentThemes[K]>
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Example:</h4>
          <CodeBlock language="typescript">
            {`// Theme with nested component themes
Button: {
  backgroundColor: 0x3b82f6,
  padding: { horizontal: 20, vertical: 10 },
  cornerRadius: 8,
  // Nested Icon theme
  Icon: {
    size: 20,
    color: 0xffffff,
  },
  // Nested Text theme
  Text: {
    style: {
      fontSize: '16px',
      color: '#ffffff',
      fontWeight: 'bold',
    },
  },
}

// Component implementation must propagate nestedTheme
function Button(props: ButtonProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Button', localTheme, {})
  
  return (
    <View {...themed} theme={nestedTheme}>  {/* CRITICAL: theme={nestedTheme} */}
      <Icon name="check" />  {/* Receives nested Icon theme */}
      <Text text={props.label} />  {/* Receives nested Text theme */}
    </View>
  )
}`}
          </CodeBlock>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <h4 className="font-semibold mb-2">⚠️ Critical Pattern:</h4>
          <p className="mb-2">
            Custom components with nested themes <strong>MUST propagate nestedTheme</strong> via{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">theme={'{nestedTheme}'}</code> prop.
          </p>
          <p className="mb-2">Without propagation:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Child components won't receive nested theme config</li>
            <li>Theme hierarchy breaks (Global → Component → Nested → Props)</li>
            <li>
              Example:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {'Accordion: { Icon: { size: 42 } }'}
              </code>{' '}
              won't work
            </li>
          </ul>
        </div>
      </section>

      {/* ComponentThemes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">ComponentThemes</h2>
        <p className="mb-4">Complete component themes combining built-in and custom components.</p>
        <CodeBlock language="typescript">
          {`interface ComponentThemes
  extends BuiltInComponentThemes,
    CustomComponentThemes {}

interface BuiltInComponentThemes {
  // Primitives (lowercase) - internal use
  view: ViewTheme
  text: TextTheme
  nineslice: NineSliceTheme
  sprite: SpriteTheme
  image: ImageTheme
  graphics: GraphicsTheme
  tilesprite: TileSpriteTheme
  
  // Public API (uppercase)
  View: ViewTheme
  Text: TextTheme
  NineSlice: NineSliceTheme
  Sprite: SpriteTheme
  Image: ImageTheme
  Graphics: GraphicsTheme
  TileSprite: TileSpriteTheme
  Icon: IconTheme
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Extending with Custom Components:</h4>
          <CodeBlock language="typescript">
            {`// In your theme-custom.ts
import type { ButtonProps } from './components/Button'
import type { CardProps } from './components/Card'

export interface CustomComponentThemes {
  Button: Partial<ButtonProps>
  Card: Partial<CardProps>
}

// Now available in ComponentThemes
const theme: PartialTheme = {
  Button: {
    backgroundColor: 0x3b82f6,
  },
  Card: {
    padding: 20,
    cornerRadius: 12,
  },
}`}
          </CodeBlock>
        </div>
      </section>

      {/* Usage Patterns */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Usage Patterns</h2>

        <div className="space-y-8">
          {/* Creating Themes */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Creating Themes</h3>
            <CodeBlock language="typescript">
              {`import { Theme, PartialTheme } from '@phaserjsx/ui'

// Complete theme
const darkTheme: Theme = {
  View: {
    backgroundColor: 0x1a1a1a,
    cornerRadius: 8,
  },
  Text: {
    style: {
      fontFamily: 'Inter',
      fontSize: '16px',
      color: '#ffffff',
    },
  },
  // ... all other built-in components
}

// Partial theme for overrides
const customizations: PartialTheme = {
  Button: {
    backgroundColor: 0xff0000,
  },
  Icon: {
    size: 28,
  },
}`}
            </CodeBlock>
          </div>

          {/* Applying Themes */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Applying Themes</h3>
            <CodeBlock language="tsx">
              {`import { ThemeProvider } from '@phaserjsx/ui'

// Global theme
<ThemeProvider theme={myTheme}>
  <App />
</ThemeProvider>

// Local theme override
<View theme={customizations}>
  <Button />  {/* Uses customizations.Button */}
</View>

// Nested theme propagation
<View theme={parentTheme}>
  <CustomComponent />  {/* Must propagate nestedTheme internally */}
</View>`}
            </CodeBlock>
          </div>

          {/* Accessing Theme */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Accessing Theme in Components</h3>
            <CodeBlock language="tsx">
              {`import { useTheme, getThemedProps } from '@phaserjsx/ui'

function MyComponent(props: MyComponentProps) {
  // Get current theme context
  const localTheme = useTheme()
  
  // Merge theme + props with priority: props > theme
  const { props: themed, nestedTheme } = getThemedProps(
    'MyComponent',
    localTheme,
    props
  )
  
  return (
    <View {...themed} theme={nestedTheme}>
      {props.children}
    </View>
  )
}`}
            </CodeBlock>
          </div>

          {/* Runtime Theme Switching */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Runtime Theme Switching</h3>
            <CodeBlock language="tsx">
              {`import { useState } from 'react'
import { ThemeProvider } from '@phaserjsx/ui'

function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme)
  
  return (
    <ThemeProvider theme={currentTheme}>
      <Button onTouch={() => setCurrentTheme(darkTheme)}>
        Switch to Dark
      </Button>
      <Content />
    </ThemeProvider>
  )
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Theme Organization</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Create base themes for common styles (light, dark, high-contrast)</li>
              <li>Use PartialTheme for context-specific overrides (modals, cards, forms)</li>
              <li>Group related component themes together in separate files</li>
              <li>Use color presets for consistent color schemes</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Nested Theme Propagation</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Always propagate <code>nestedTheme</code> in custom components with children
              </li>
              <li>
                Use <code>getThemedProps()</code> to extract nested theme correctly
              </li>
              <li>Test nested themes with multi-level component hierarchies</li>
              <li>Document which child components receive nested themes</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Type Safety</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Extend <code>CustomComponentThemes</code> for custom components
              </li>
              <li>Use strict TypeScript types for theme definitions</li>
              <li>Leverage IDE autocomplete for theme property discovery</li>
              <li>Validate themes at build time, not runtime</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Performance</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Theme changes trigger re-renders - minimize theme switching frequency</li>
              <li>
                Use <code>useMemo</code> for expensive theme calculations
              </li>
              <li>Prefer static themes over dynamic theme generation</li>
              <li>Cache theme objects to prevent unnecessary re-creation</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Design Tokens</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Use <code>useThemeTokens()</code> for design token access (colors, spacing, etc.)
              </li>
              <li>Reference tokens in themes instead of hardcoded values</li>
              <li>Keep color presets separate from component themes</li>
              <li>Document token naming conventions for consistency</li>
            </ul>
          </div>
        </div>
      </section>
    </DocLayout>
  )
}
