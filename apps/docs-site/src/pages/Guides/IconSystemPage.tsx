/**
 * Icon System Overview Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Icon System Overview - Complete guide to the icon system architecture
 */
export function IconSystemPage() {
  return (
    <DocLayout>
      <h1>Icon System</h1>
      <DocDescription>
        Type-safe icon system with automatic tree-shaking, lazy loading, and theme integration.
        Supports Bootstrap Icons and custom SVGs with zero bundle impact for unused icons.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          The Icon System is a sophisticated solution that combines type safety, performance, and
          developer experience.
        </SectionDescription>

        <h3>Key Features</h3>
        <ul>
          <li>✅ Full TypeScript IntelliSense for 2000+ icons</li>
          <li>✅ Automatic tree-shaking (only used icons in bundle)</li>
          <li>✅ Code-splitting per icon</li>
          <li>✅ SVG caching for performance</li>
          <li>✅ Theme system integration</li>
          <li>✅ Custom SVG support</li>
          <li>✅ Hot Module Replacement (HMR)</li>
        </ul>

        <h3>Core Components</h3>
        <ul>
          <li>
            <strong>Generic Icon Component</strong> - Pluggable loader system in @number10/phaserjsx
          </li>
          <li>
            <strong>Custom Icon Wrapper</strong> - Type-safe app-specific implementation
          </li>
          <li>
            <strong>Generator System</strong> - Automatic type and loader generation
          </li>
          <li>
            <strong>Vite Plugin</strong> - Seamless build integration
          </li>
        </ul>
      </Section>

      <Section title="Architecture">
        <SectionDescription>
          The system is designed with separation of concerns to maximize flexibility and type
          safety.
        </SectionDescription>

        <h3>1. Generic Icon (packages/ui)</h3>
        <p>
          The base component accepts any icon type and loader function. It has no built-in icon
          knowledge:
        </p>
        <CodeBlock language="tsx">
          {`<Icon<T>
  type={iconType}
  loader={iconLoader}
  size={32}
/>`}
        </CodeBlock>

        <h3>2. Custom Icon Wrapper (per app)</h3>
        <p>App-specific wrapper with concrete icon types and configured loader:</p>
        <CodeBlock language="tsx">
          {`<Icon
  type="check" // ← Type-safe, IntelliSense works
  size={24}
/>`}
        </CodeBlock>

        <h3>3. Generated Files</h3>
        <p>Two files are automatically generated:</p>
        <ul>
          <li>
            <code>icon-types.generated.ts</code> - TypeScript union of all available icons
          </li>
          <li>
            <code>icon-loaders.generated.ts</code> - Dynamic imports for used icons only
          </li>
        </ul>

        <h3>Why This Design?</h3>
        <p>
          The generic component stays icon-agnostic, allowing any app to use different icon
          libraries (Bootstrap Icons, Feather Icons, custom SVGs) with full type safety.
        </p>
      </Section>

      <Section title="Tree-Shaking Concept">
        <SectionDescription>
          Understanding how the system achieves perfect tree-shaking through dynamic imports.
        </SectionDescription>

        <h3>The Problem</h3>
        <p>Static imports bundle ALL icons, even unused ones:</p>
        <CodeBlock language="typescript">
          {`// ❌ All 2000+ icons in bundle
import check from 'bootstrap-icons/icons/check.svg'
import gear from 'bootstrap-icons/icons/gear.svg'
// ... 2000+ more imports

const icons = { check, gear, ... }`}
        </CodeBlock>

        <h3>The Solution</h3>
        <p>Dynamic imports + generated registry = perfect tree-shaking:</p>
        <CodeBlock language="typescript">
          {`// ✅ Only used icons in bundle
export const iconLoaders = {
  'check': () => import('bootstrap-icons/icons/check.svg'),
  'gear': () => import('bootstrap-icons/icons/gear.svg'),
  // Only icons found in your code
}`}
        </CodeBlock>

        <h3>How It Works</h3>
        <ol>
          <li>
            <strong>Scan Phase</strong> - Generator scans your source code for{' '}
            <code>&lt;Icon type="..."</code> patterns
          </li>
          <li>
            <strong>Generate Phase</strong> - Creates loader registry with only found icons
          </li>
          <li>
            <strong>Build Phase</strong> - Vite creates separate chunks per icon
          </li>
          <li>
            <strong>Runtime</strong> - Icons load on-demand when first rendered
          </li>
        </ol>

        <h3>Bundle Results</h3>
        <p>Each icon becomes a tiny, lazy-loaded chunk:</p>
        <CodeBlock language="text">
          {`dist/assets/icons/check-D7HmZJz2.js    0.47 kB
dist/assets/icons/gear-DHGjwfBQ.js     0.52 kB`}
        </CodeBlock>
      </Section>

      <Section title="Generator System">
        <SectionDescription>
          The generator system automates type and loader generation.
        </SectionDescription>

        <h3>Components</h3>

        <h4>1. CLI Scripts</h4>
        <ul>
          <li>
            <code>generate-icon-types</code> - Scans icon sources, generates TypeScript types
          </li>
          <li>
            <code>generate-icon-loaders</code> - Scans code usage, generates dynamic imports
          </li>
          <li>
            <code>generate-icons</code> - Runs both generators
          </li>
        </ul>

        <h4>2. Config File (icon-generator.config.ts)</h4>
        <p>Central configuration for:</p>
        <ul>
          <li>Icon sources (npm packages, local directories)</li>
          <li>Type generation settings</li>
          <li>Loader generation settings</li>
          <li>Custom detection patterns</li>
          <li>Validation rules</li>
        </ul>

        <h4>3. Vite Plugin</h4>
        <p>Integrates generators into dev/build workflow:</p>
        <ul>
          <li>Auto-generates on server start</li>
          <li>Watch mode for HMR</li>
          <li>Regenerates on file changes</li>
        </ul>

        <h3>Workflow</h3>
        <CodeBlock language="text">
          {`Dev Start → Generate types (all icons)
         → Generate loaders (used icons)

Code Change → Watch detects <Icon type="new-icon" />
           → Regenerate loaders
           → HMR updates`}
        </CodeBlock>
      </Section>

      <Section title="Vite Integration">
        <SectionDescription>
          The Vite plugin seamlessly integrates icon generation into your build process.
        </SectionDescription>

        <h3>Configuration</h3>
        <CodeBlock language="typescript">
          {`import { iconGeneratorPlugin } from '@number10/phaserjsx/vite-plugin-icons'

export default defineConfig({
  plugins: [
    iconGeneratorPlugin({
      configPath: './icon-generator.config.ts',
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split icons into separate chunks
          if (id.includes('bootstrap-icons/icons/')) {
            const iconName = id.match(/icons\\/([^.]+)\\.svg/)?.[1]
            return iconName ? \`icons/\${iconName}\` : undefined
          }
        }
      }
    }
  }
})`}
        </CodeBlock>

        <h3>Generation Modes</h3>
        <ul>
          <li>
            <code>scanIconDirectory: 'start'</code> - Generate types once at server start
          </li>
          <li>
            <code>scanIconDirectory: 'watch'</code> - Regenerate when SVG files change
          </li>
          <li>
            <code>generateLoaders: 'start'</code> - Generate loaders once
          </li>
          <li>
            <code>generateLoaders: 'watch'</code> - Regenerate when code changes (default)
          </li>
        </ul>

        <h3>Benefits</h3>
        <ul>
          <li>Zero manual maintenance</li>
          <li>HMR support</li>
          <li>Build optimization</li>
          <li>Development speed</li>
        </ul>
      </Section>

      <Section title="Best Practices">
        <h3>Use Type-Safe Wrapper</h3>
        <p>
          Always create a custom Icon component with concrete types. Never use the generic Icon
          &lt;T&gt; directly in app code.
        </p>
        <CodeBlock language="tsx">
          {`// ✅ DO: Type-safe wrapper
import { Icon } from '@/components/Icon'
<Icon type="check" /> // IntelliSense works

// ❌ DON'T: Generic component
import { Icon } from '@number10/phaserjsx'
<Icon type="check" loader={...} /> // Manual loader, no types`}
        </CodeBlock>

        <h3>Preload Critical Icons</h3>
        <p>
          Use useIcon hook to preload icons that appear immediately, avoiding flash of missing
          content.
        </p>
        <CodeBlock language="tsx">
          {`// ✅ DO: Preload logo
const iconReady = useIcon('logo')
return iconReady ? <Icon type="logo" /> : null

// ❌ DON'T: Load with delay
<Icon type="logo" />`}
        </CodeBlock>

        <h3>Configure Watch Mode</h3>
        <p>Enable watch mode in development for automatic loader updates when adding new icons.</p>
        <CodeBlock language="typescript">
          {`// ✅ DO: Auto-update
loaders: {
  generateLoaders: 'watch',
}

// ❌ DON'T: Manual regeneration
loaders: {
  generateLoaders: 'start',
}`}
        </CodeBlock>

        <h3>Use Custom Patterns</h3>
        <p>
          Define custom patterns to detect icon usage in theme objects and other non-JSX contexts.
          This ensures icons referenced outside of JSX elements are included in the loader registry.
        </p>
        <CodeBlock language="typescript">{`// Detect theme icon properties
customPatterns: [
  {
    name: 'Theme icons',
    pattern: '(\\\\w*Icon):\\\\s*[\\'"](\\\\w+)[\\'"',
    captureGroup: 2
  }
]

theme: { prefixIcon: 'gear' } // Now detected and included`}</CodeBlock>
      </Section>

      <Section title="Related Documentation">
        <ul>
          <li>
            <a href="/components/icon">Generic Icon Component</a> - The pluggable Icon&lt;T&gt;
            component
          </li>
          <li>
            <a href="/guides/icon-generator-config">Generator Configuration</a> -
            icon-generator.config.ts reference
          </li>
          <li>
            <a href="/guides/custom-icon-component">Custom Icon Implementation</a> - Creating
            type-safe wrappers
          </li>
          <li>
            <a href="/guides/custom-svg-icons">Custom SVG Icons</a> - Adding your own icon files
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
