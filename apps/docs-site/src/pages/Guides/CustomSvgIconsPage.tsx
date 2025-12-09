/**
 * Custom SVG Icons Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Custom SVG Icons - Guide for adding your own icon files
 */
export function CustomSvgIconsPage() {
  return (
    <DocLayout>
      <h1>Custom SVG Icons</h1>
      <DocDescription>
        Learn how to add your own SVG icon files alongside npm icon packages. Combine Bootstrap
        Icons with custom logos, brand assets, and app-specific icons.
      </DocDescription>

      <Section title="Why Custom Icons?">
        <SectionDescription>
          Icon libraries like Bootstrap Icons provide thousands of icons, but you'll often need:
        </SectionDescription>

        <ul>
          <li>Company logos and branding</li>
          <li>Product-specific icons</li>
          <li>Custom illustrations</li>
          <li>Icons not available in libraries</li>
        </ul>

        <p>
          The icon system supports mixing npm packages and local SVG files with full type safety.
        </p>
      </Section>

      <Section title="Step 1: Create Icons Directory">
        <SectionDescription>Create a directory for your custom SVG files.</SectionDescription>

        <CodeBlock language="bash">{`mkdir -p src/custom-icons`}</CodeBlock>

        <h3>Recommended Structure</h3>
        <CodeBlock language="text">{`src/
├── custom-icons/
│   ├── custom-logo.svg
│   ├── custom-check.svg
│   └── custom-plus.svg
└── components/
    └── Icon/`}</CodeBlock>
      </Section>

      <Section title="Step 2: Add SVG Files">
        <SectionDescription>
          Create or copy SVG files into your custom icons directory.
        </SectionDescription>

        <h3>SVG Format Requirements</h3>
        <ul>
          <li>Valid SVG XML format</li>
          <li>
            Use <code>currentColor</code> for fill/stroke to enable tinting
          </li>
          <li>Remove hardcoded width/height (or use viewBox)</li>
          <li>Optimize with SVGO for smaller size</li>
          <li>Use kebab-case filenames (custom-icon.svg)</li>
        </ul>

        <h3>Example SVG</h3>
        <CodeBlock language="xml">{`<!-- custom-check.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
</svg>`}</CodeBlock>

        <h3>Naming Convention</h3>
        <p>Use a prefix to avoid conflicts with library icons:</p>
        <ul>
          <li>
            <code>custom-check.svg</code> (vs. Bootstrap's <code>check.svg</code>)
          </li>
          <li>
            <code>brand-logo.svg</code>
          </li>
          <li>
            <code>app-icon.svg</code>
          </li>
        </ul>
      </Section>

      <Section title="Step 3: Configure Generator">
        <SectionDescription>
          Update icon-generator.config.ts to include your custom directory.
        </SectionDescription>

        <CodeBlock language="typescript">{`import { defineIconConfig } from '@number10/phaserjsx/scripts/icon-generator-config'

export default defineIconConfig({
  // Multiple sources: npm package + local directory
  source: [
    {
      package: 'bootstrap-icons',
      iconsPath: 'icons',
      label: 'Bootstrap Icons',
    },
    {
      directory: './src/custom-icons',  // Add custom directory
      label: 'Custom Icons',
    },
  ],

  types: {
    enabled: true,
    output: './src/components/Icon/icon-types.generated.ts',
    typeName: 'IconType',
  },

  loaders: {
    enabled: true,
    output: './src/components/Icon/icon-loaders.generated.ts',
    scanDir: './src',
    componentNames: ['Icon'],
  },
})`}</CodeBlock>
      </Section>

      <Section title="Step 4: Generate Types">
        <SectionDescription>
          Run the generator to create types and loaders for all icons.
        </SectionDescription>

        <CodeBlock language="bash">{`pnpm run generate-icons`}</CodeBlock>

        <h3>Generator Output</h3>
        <CodeBlock language="text">{`🎨 Icon Generator

📝 Generating icon types...
📦 Scanning package: bootstrap-icons
✓ Found 2078 icons from Bootstrap Icons
📁 Scanning directory: ./src/custom-icons
✓ Found 3 icons from Custom Icons
✓ Total unique icons: 2081
✓ Generated: icon-types.generated.ts

⚡ Generating icon loaders...
✓ Found 5 unique icons
  Icons: check, gear, custom-logo, custom-check, custom-plus
✓ Generated: icon-loaders.generated.ts`}</CodeBlock>

        <h3>Generated Types</h3>
        <CodeBlock language="typescript">{`// icon-types.generated.ts
/**
 * Sources: Bootstrap Icons (2078), Custom Icons (3)
 * Total unique icons: 2081
 */
export type IconType =
  | 'check'          // Bootstrap
  | 'gear'           // Bootstrap
  | 'star'           // Bootstrap
  | 'custom-logo'    // Custom
  | 'custom-check'   // Custom
  | 'custom-plus'    // Custom
  // ... more`}</CodeBlock>

        <h3>Generated Loaders</h3>
        <CodeBlock language="typescript">{`// icon-loaders.generated.ts
export const iconLoaders: Record<string, IconLoaderFn> = {
  'check': () => import('bootstrap-icons/icons/check.svg' as string),
  'gear': () => import('bootstrap-icons/icons/gear.svg' as string),
  'custom-logo': () => import('./../../custom-icons/custom-logo.svg'),
  'custom-check': () => import('./../../custom-icons/custom-check.svg'),
  'custom-plus': () => import('./../../custom-icons/custom-plus.svg'),
}`}</CodeBlock>
      </Section>

      <Section title="Step 5: Use Custom Icons">
        <SectionDescription>
          Your custom icons now work exactly like library icons with full type safety.
        </SectionDescription>

        <CodeBlock language="tsx">{`import { Icon } from '@/components/Icon'

function MyComponent() {
  return (
    <View direction="row" gap={10}>
      {/* Library icons */}
      <Icon type="check" size={32} />
      <Icon type="gear" size={32} />

      {/* Custom icons */}
      <Icon type="custom-logo" size={48} />
      <Icon type="custom-check" size={32} tint={0x00ff00} />
    </View>
  )
}`}</CodeBlock>

        <h3>IntelliSense</h3>
        <p>
          Type <code>&lt;Icon type="custom-</code> and IntelliSense will show your custom icons with
          autocomplete.
        </p>
      </Section>

      <Section title="Watch Mode">
        <SectionDescription>
          Enable automatic regeneration when adding new SVG files.
        </SectionDescription>

        <CodeBlock language="typescript">{`// icon-generator.config.ts
types: {
  enabled: true,
  scanIconDirectory: 'watch',  // Regenerate when SVGs change
  // ...
}`}</CodeBlock>

        <h3>Workflow</h3>
        <ol>
          <li>Add new SVG file to custom-icons/</li>
          <li>Generator detects change (if watch enabled)</li>
          <li>Types regenerate automatically</li>
          <li>HMR updates IntelliSense</li>
          <li>Use new icon immediately</li>
        </ol>
      </Section>

      <Section title="Multiple Custom Directories">
        <SectionDescription>
          Organize icons into multiple directories by category.
        </SectionDescription>

        <CodeBlock language="typescript">{`source: [
  {
    package: 'bootstrap-icons',
    iconsPath: 'icons',
    label: 'Bootstrap Icons',
  },
  {
    directory: './src/icons/brand',
    label: 'Brand Icons',
  },
  {
    directory: './src/icons/products',
    label: 'Product Icons',
  },
  {
    directory: './src/icons/illustrations',
    label: 'Illustrations',
  },
]`}</CodeBlock>

        <h3>Directory Structure</h3>
        <CodeBlock language="text">{`src/icons/
├── brand/
│   ├── company-logo.svg
│   └── partner-logo.svg
├── products/
│   ├── product-a-icon.svg
│   └── product-b-icon.svg
└── illustrations/
    ├── hero-illustration.svg
    └── error-illustration.svg`}</CodeBlock>
      </Section>

      <Section title="SVG Optimization">
        <SectionDescription>
          Optimize SVGs for smaller bundle size and better performance.
        </SectionDescription>

        <h3>Using SVGO</h3>
        <CodeBlock language="bash">{`# Install SVGO
npm install -g svgo

# Optimize single file
svgo custom-icon.svg

# Optimize all files in directory
svgo -f src/custom-icons`}</CodeBlock>

        <h3>SVGO Configuration</h3>
        <CodeBlock language="javascript">{`// svgo.config.js
module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,  // Keep viewBox
          removeUselessStrokeAndFill: false,  // Keep currentColor
        },
      },
    },
  ],
}`}</CodeBlock>

        <h3>Manual Optimization</h3>
        <ul>
          <li>
            Remove unnecessary <code>&lt;g&gt;</code> wrappers
          </li>
          <li>Combine paths where possible</li>
          <li>Remove comments and metadata</li>
          <li>
            Use <code>fill="currentColor"</code> instead of hex colors
          </li>
          <li>Remove fixed width/height attributes</li>
        </ul>
      </Section>

      <Section title="Name Conflicts">
        <SectionDescription>
          Handle icons with the same name from different sources.
        </SectionDescription>

        <h3>Resolution Order</h3>
        <p>When multiple sources have the same icon name, the first source wins:</p>
        <CodeBlock language="typescript">{`source: [
  { directory: './src/custom-icons' },      // Priority 1
  { package: 'bootstrap-icons' },           // Priority 2
]

// custom-icons/check.svg will be used
// bootstrap-icons/check.svg will be ignored`}</CodeBlock>

        <h3>Best Practice</h3>
        <p>Use prefixes to avoid conflicts:</p>
        <ul>
          <li>
            Custom: <code>custom-check.svg</code>
          </li>
          <li>
            Library: <code>check.svg</code>
          </li>
        </ul>
      </Section>

      <Section title="Testing Custom Icons">
        <SectionDescription>Verify your custom icons work correctly.</SectionDescription>

        <h3>Visual Test Component</h3>
        <CodeBlock language="tsx">{`function CustomIconTest() {
  return (
    <View direction="column" gap={20}>
      <Text text="Custom Icons" />

      <View direction="row" gap={10}>
        <Icon type="custom-logo" size={48} />
        <Icon type="custom-check" size={48} tint={0x00ff00} />
        <Icon type="custom-plus" size={48} tint={0x0000ff} />
      </View>

      <Text text="Library Icons" />

      <View direction="row" gap={10}>
        <Icon type="check" size={48} />
        <Icon type="gear" size={48} />
        <Icon type="star" size={48} />
      </View>
    </View>
  )
}`}</CodeBlock>

        <h3>Type Safety Test</h3>
        <CodeBlock language="tsx">{`// ✅ Should work
<Icon type="custom-logo" />

// ❌ Should show type error
<Icon type="nonexistent-custom-icon" />`}</CodeBlock>
      </Section>

      <Section title="Troubleshooting">
        <h3>Custom icon not appearing in types</h3>
        <p>
          <strong>Problem:</strong> Added SVG but not in IconType
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>
            Verify file is in configured directory (<code>./src/custom-icons</code>)
          </li>
          <li>Check file has .svg extension</li>
          <li>
            Run <code>pnpm run generate-icons</code> manually
          </li>
          <li>Restart dev server if watch mode not working</li>
        </ul>

        <h3>Custom icon not loading at runtime</h3>
        <p>
          <strong>Problem:</strong> Icon in types but fails to load
        </p>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Check SVG file is valid XML</li>
          <li>Verify Vite can resolve the import path</li>
          <li>Check browser console for errors</li>
          <li>Regenerate loaders after adding icon to code</li>
        </ul>

        <h3>Wrong icon appears</h3>
        <p>
          <strong>Problem:</strong> Different icon than expected shows up
        </p>
        <p>
          <strong>Solution:</strong> Name conflict. Use prefixed names or reorder sources in config.
        </p>
      </Section>

      <Section title="Related Documentation">
        <ul>
          <li>
            <a href="/guides/icon-system">Icon System Overview</a> - Complete architecture
          </li>
          <li>
            <a href="/guides/icon-generator-config">Generator Configuration</a> - Config reference
          </li>
          <li>
            <a href="/guides/custom-icon-component">Custom Icon Implementation</a> - Creating
            wrappers
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
