/**
 * Custom Icon Component Implementation Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Custom Icon Component - Guide for creating type-safe icon wrappers
 */
export function CustomIconComponentPage() {
  return (
    <DocLayout>
      <h1>Custom Icon Component</h1>
      <DocDescription>
        Step-by-step guide to creating a type-safe Icon component for your app. This wrapper
        provides IntelliSense, theme integration, and eliminates the need for manual loader
        configuration.
      </DocDescription>

      <Section title="Why a Custom Wrapper?">
        <SectionDescription>
          The generic Icon component in @phaserjsx/ui is intentionally unopinionated. A custom
          wrapper provides:
        </SectionDescription>

        <ul>
          <li>✅ Type-safe icon names with IntelliSense</li>
          <li>✅ No need to pass loader prop every time</li>
          <li>✅ Theme system integration</li>
          <li>✅ App-specific customization</li>
          <li>✅ Default size and styling</li>
        </ul>
      </Section>

      <Section title="Step 1: Generate Icon Types">
        <SectionDescription>
          First, run the generator to create TypeScript types for all available icons.
        </SectionDescription>

        <CodeBlock language="bash">{`pnpm run generate-icons`}</CodeBlock>

        <p>
          This creates <code>icon-types.generated.ts</code> with a union type of all icon names:
        </p>

        <CodeBlock language="typescript">{`/**
 * Auto-generated icon type definitions
 */
export type IconType =
  | 'check'
  | 'gear'
  | 'star'
  // ... 2000+ more`}</CodeBlock>
      </Section>

      <Section title="Step 2: Create Loader Function">
        <SectionDescription>
          Implement the loader that loads icons from the generated registry with caching.
        </SectionDescription>

        <CodeBlock language="typescript">{`// iconLoader.ts
import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

// Cache for loaded SVG strings
const iconCache = new Map<IconType, string>()

export async function iconLoader(type: IconType): Promise<string> {
  // Check cache first
  const cached = iconCache.get(type)
  if (cached) return cached

  // Get loader function from generated registry
  const loader = iconLoaders[type]

  if (!loader) {
    throw new Error(
      \`Icon not registered: \${type}. Run 'pnpm run generate-icons'\`
    )
  }

  // Load the icon (Vite code-splits automatically)
  const module = await loader()
  const svg = module.default

  // Cache for next time
  iconCache.set(type, svg)
  return svg
}`}</CodeBlock>

        <h3>Why Cache?</h3>
        <p>
          Caching prevents redundant module imports when the same icon is used multiple times across
          your app. The cache is in-memory and persists for the app lifetime.
        </p>
      </Section>

      <Section title="Step 3: Create Icon Component">
        <SectionDescription>
          Wrap the generic Icon with your custom loader and types.
        </SectionDescription>

        <CodeBlock language="typescript">{`// Icon.tsx
import type * as PhaserJSX from '@phaserjsx/ui'
import {
  Icon as GenericIcon,
  getThemedProps,
  useTheme,
  type IconProps as GenericIconProps,
} from '@phaserjsx/ui'
import { iconLoader } from './iconLoader'
import type { IconType } from './icon-types.generated'

// Re-export IconType for convenience
export type { IconType }

// Module augmentation for theme support
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Icon: {
      size?: number
    } & PhaserJSX.ViewTheme
  }
}

// Custom Icon props (no loader needed)
export interface IconProps extends Omit<GenericIconProps<IconType>, 'loader'> {
  type: IconType | undefined
}

export function Icon(props: IconProps) {
  const localTheme = useTheme()
  const { props: themed } = getThemedProps('Icon', localTheme, {})

  // Merge themed props with component props
  const size = props.size ?? themed.size ?? 32

  return <GenericIcon {...props} size={size} loader={iconLoader} />
}`}</CodeBlock>

        <h3>Key Features</h3>
        <ul>
          <li>
            <strong>Type Safety</strong>: IconType ensures only valid icon names
          </li>
          <li>
            <strong>No Loader Prop</strong>: Loader is configured internally
          </li>
          <li>
            <strong>Theme Support</strong>: Integrates with PhaserJSX theme system
          </li>
          <li>
            <strong>Default Size</strong>: Falls back to theme or 32px
          </li>
        </ul>
      </Section>

      <Section title="Step 4: Create useIcon Hook (Optional)">
        <SectionDescription>Add a hook for preloading icons before rendering.</SectionDescription>

        <CodeBlock language="typescript">{`// useIcon.ts
import { useIconPreload } from '@phaserjsx/ui'
import { iconLoader } from './iconLoader'
import type { IconType } from './icon-types.generated'

export function useIcon(type: IconType): boolean {
  return useIconPreload(type, iconLoader)
}`}</CodeBlock>

        <p>
          <strong>Note:</strong> This must be in a separate file to avoid Fast Refresh issues (React
          components and hooks can't be in the same file).
        </p>
      </Section>

      <Section title="Step 5: Export from Index">
        <SectionDescription>Create a barrel export for clean imports.</SectionDescription>

        <CodeBlock language="typescript">{`// index.ts
export { Icon, type IconProps, type IconType } from './Icon'
export { useIcon } from './useIcon'`}</CodeBlock>
      </Section>

      <Section title="Usage Examples">
        <SectionDescription>
          Now use your type-safe Icon component throughout your app.
        </SectionDescription>

        <h3>Basic Usage</h3>
        <CodeBlock language="tsx">{`import { Icon } from '@/components/Icon'

<View>
  <Icon type="check" size={24} />
  <Icon type="gear" size={32} />
</View>`}</CodeBlock>

        <h3>With Styling</h3>
        <CodeBlock language="tsx">{`<Icon
  type="star"
  size={48}
  tint={0xffd700}
  x={100}
  y={100}
/>`}</CodeBlock>

        <h3>With Preloading</h3>
        <CodeBlock language="tsx">{`import { Icon, useIcon } from '@/components/Icon'

function MyComponent() {
  const ready = useIcon('logo')

  return ready ? <Icon type="logo" /> : <Text text="Loading..." />
}`}</CodeBlock>

        <h3>With Theme</h3>
        <CodeBlock language="tsx">{`const theme = {
  Icon: {
    size: 48  // Default size for all icons
  }
}

<ThemeProvider theme={theme}>
  <Icon type="check" />  {/* Uses size 48 */}
  <Icon type="gear" size={24} />  {/* Override with size 24 */}
</ThemeProvider>`}</CodeBlock>
      </Section>

      <Section title="File Structure">
        <SectionDescription>
          Recommended structure for your Icon component module.
        </SectionDescription>

        <CodeBlock language="text">{`src/components/Icon/
├── Icon.tsx                      # Main component
├── iconLoader.ts                 # Loader with caching
├── useIcon.ts                    # Preload hook
├── index.ts                      # Barrel export
├── icon-types.generated.ts       # Generated types (gitignored)
└── icon-loaders.generated.ts     # Generated loaders (gitignored)`}</CodeBlock>
      </Section>

      <Section title="Complete Example">
        <SectionDescription>Full implementation with all files for reference.</SectionDescription>

        <h3>iconLoader.ts</h3>
        <CodeBlock language="typescript">{`import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

const iconCache = new Map<IconType, string>()

export async function iconLoader(type: IconType): Promise<string> {
  const cached = iconCache.get(type)
  if (cached) return cached

  const loader = iconLoaders[type]
  if (!loader) {
    throw new Error(\`Icon not registered: \${type}\`)
  }

  const module = await loader()
  const svg = module.default
  iconCache.set(type, svg)
  return svg
}`}</CodeBlock>

        <h3>Icon.tsx</h3>
        <CodeBlock language="typescript">{`import type * as PhaserJSX from '@phaserjsx/ui'
import {
  Icon as GenericIcon,
  getThemedProps,
  useTheme,
  type IconProps as GenericIconProps,
} from '@phaserjsx/ui'
import { iconLoader } from './iconLoader'
import type { IconType } from './icon-types.generated'

export type { IconType }

declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Icon: { size?: number } & PhaserJSX.ViewTheme
  }
}

export interface IconProps extends Omit<GenericIconProps<IconType>, 'loader'> {
  type: IconType | undefined
}

export function Icon(props: IconProps) {
  const localTheme = useTheme()
  const { props: themed } = getThemedProps('Icon', localTheme, {})
  const size = props.size ?? themed.size ?? 32

  return <GenericIcon {...props} size={size} loader={iconLoader} />
}`}</CodeBlock>

        <h3>useIcon.ts</h3>
        <CodeBlock language="typescript">{`import { useIconPreload } from '@phaserjsx/ui'
import { iconLoader } from './iconLoader'
import type { IconType } from './icon-types.generated'

export function useIcon(type: IconType): boolean {
  return useIconPreload(type, iconLoader)
}`}</CodeBlock>

        <h3>index.ts</h3>
        <CodeBlock language="typescript">{`export { Icon, type IconProps, type IconType } from './Icon'
export { useIcon } from './useIcon'`}</CodeBlock>
      </Section>

      <Section title="Testing">
        <SectionDescription>Verify your implementation works correctly.</SectionDescription>

        <h3>Type Safety Test</h3>
        <CodeBlock language="tsx">{`// ✅ Should work
<Icon type="check" />

// ❌ Should show type error
<Icon type="invalid-icon" />`}</CodeBlock>

        <h3>IntelliSense Test</h3>
        <p>
          Type <code>&lt;Icon type="</code> and verify IntelliSense shows all available icons with
          autocomplete.
        </p>

        <h3>Runtime Test</h3>
        <CodeBlock language="tsx">{`function IconTest() {
  return (
    <View direction="row" gap={10}>
      <Icon type="check" size={32} />
      <Icon type="gear" size={32} />
      <Icon type="star" size={32} />
    </View>
  )
}`}</CodeBlock>
      </Section>

      <Section title="Troubleshooting">
        <h3>Icons not showing</h3>
        <p>
          <strong>Problem:</strong> Icons render but nothing appears
        </p>
        <p>
          <strong>Solution:</strong> Run <code>pnpm run generate-icons</code> to ensure loaders are
          up to date. Check browser console for errors.
        </p>

        <h3>Type errors on icon names</h3>
        <p>
          <strong>Problem:</strong> TypeScript complains about icon type
        </p>
        <p>
          <strong>Solution:</strong> Regenerate types with <code>pnpm run generate-icons</code>.
          Ensure the icon exists in your configured sources.
        </p>

        <h3>Fast Refresh warning</h3>
        <p>
          <strong>Problem:</strong> "Fast refresh only works when a file only exports components"
        </p>
        <p>
          <strong>Solution:</strong> Move hooks and utility functions to separate files.
        </p>
      </Section>

      <Section title="Related Documentation">
        <ul>
          <li>
            <a href="/guides/icon-system">Icon System Overview</a> - Complete architecture
          </li>
          <li>
            <a href="/guides/icon-generator-config">Generator Configuration</a> - Config options
          </li>
          <li>
            <a href="/components/icon">Generic Icon Component</a> - Base component API
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
