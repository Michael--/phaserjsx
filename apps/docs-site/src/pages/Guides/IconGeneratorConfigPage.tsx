/**
 * Icon Generator Configuration Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Icon Generator Configuration - Complete reference for icon-generator.config.ts
 */
export function IconGeneratorConfigPage() {
  return (
    <DocLayout>
      <h1>Icon Generator Configuration</h1>
      <DocDescription>
        Complete reference for configuring the icon generator system through icon-generator
        .config.ts. Control icon sources, type generation, loader generation, and custom detection
        patterns.
      </DocDescription>

      <Section title="Basic Setup">
        <SectionDescription>
          Create icon-generator.config.ts in your project root with defineIconConfig helper.
        </SectionDescription>

        <CodeBlock language="typescript">{`import { defineIconConfig } from '@phaserjsx/ui/scripts/icon-generator-config'

export default defineIconConfig({
  source: [
    {
      package: 'bootstrap-icons',
      iconsPath: 'icons',
      label: 'Bootstrap Icons',
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

      <Section title="Icon Sources">
        <SectionDescription>
          Configure where icons come from - npm packages or local directories.
        </SectionDescription>

        <h3>From npm Package</h3>
        <CodeBlock language="typescript">{`source: [
  {
    package: 'bootstrap-icons',      // npm package name
    iconsPath: 'icons',              // Path to icons within package
    label: 'Bootstrap Icons',        // Display label in logs
  },
]`}</CodeBlock>

        <h3>From Local Directory</h3>
        <CodeBlock language="typescript">{`source: [
  {
    directory: './src/custom-icons', // Path to local SVG files
    label: 'Custom Icons',           // Display label in logs
  },
]`}</CodeBlock>

        <h3>Multiple Sources</h3>
        <p>Combine npm packages and local directories:</p>
        <CodeBlock language="typescript">{`source: [
  {
    package: 'bootstrap-icons',
    iconsPath: 'icons',
    label: 'Bootstrap Icons',
  },
  {
    directory: './src/custom-icons',
    label: 'Custom Icons',
  },
  {
    package: 'feather-icons',
    iconsPath: 'dist/icons',
    label: 'Feather Icons',
  },
]`}</CodeBlock>
        <p>
          Icons from all sources are merged into a single type union and loader registry. Name
          conflicts are resolved by preferring the first source.
        </p>
      </Section>

      <Section title="Type Generation">
        <SectionDescription>
          Configure TypeScript type generation for icon names.
        </SectionDescription>

        <h3>Basic Configuration</h3>
        <CodeBlock language="typescript">{`types: {
  enabled: true,                                  // Enable type generation
  output: './src/components/Icon/icon-types.generated.ts',
  typeName: 'IconType',                           // Name of the generated type
  scanIconDirectory: 'start',                     // When to generate
}`}</CodeBlock>

        <h3>Generation Modes</h3>
        <ul>
          <li>
            <code>'never'</code> - Disable automatic generation (use CLI manually)
          </li>
          <li>
            <code>'start'</code> - Generate once at dev server start (default)
          </li>
          <li>
            <code>'watch'</code> - Regenerate when SVG files change
          </li>
        </ul>

        <h3>Generated Output</h3>
        <CodeBlock language="typescript">{`/**
 * Auto-generated icon type definitions
 * Sources: Bootstrap Icons (2078), Custom Icons (3)
 * Total unique icons: 2081
 */
export type IconType =
  | 'check'
  | 'gear'
  | 'star'
  | 'custom-logo'
  | 'custom-check'
  // ... all icons`}</CodeBlock>
      </Section>

      <Section title="Loader Generation">
        <SectionDescription>
          Configure dynamic import generation for actually used icons.
        </SectionDescription>

        <h3>Basic Configuration</h3>
        <CodeBlock language="typescript">{`loaders: {
  enabled: true,                                    // Enable loader generation
  output: './src/components/Icon/icon-loaders.generated.ts',
  scanDir: './src',                                 // Directory to scan for usage
  componentNames: ['Icon'],                         // Component names to detect
  generateLoaders: 'watch',                         // When to generate
  validate: true,                                   // Warn about missing icons
}`}</CodeBlock>

        <h3>Component Names</h3>
        <p>Specify which component names to scan for:</p>
        <CodeBlock language="typescript">{`componentNames: ['Icon', 'BootstrapIcon', 'CustomIcon']`}</CodeBlock>
        <p>Generator will find icons in:</p>
        <CodeBlock language="tsx">{`<Icon type="check" />
<BootstrapIcon type="gear" />
<CustomIcon type="star" />`}</CodeBlock>

        <h3>Generation Modes</h3>
        <ul>
          <li>
            <code>'start'</code> - Generate once at dev server start
          </li>
          <li>
            <code>'watch'</code> - Regenerate when code changes (default, recommended)
          </li>
        </ul>

        <h3>Validation</h3>
        <p>
          When <code>validate: true</code>, warns about icons used in code but not available in
          types:
        </p>
        <CodeBlock language="text">{`⚠️  Found 1 icons not in types file:
   nonexistent-icon

💡 This icon will be excluded from loaders`}</CodeBlock>

        <h3>Generated Output</h3>
        <CodeBlock language="typescript">{`/**
 * Auto-generated icon loaders
 * Generated by scanning: ./src
 */
export type IconLoaderFn = () => Promise<{ default: string }>

export const iconLoaders: Record<string, IconLoaderFn> = {
  'check': () => import('bootstrap-icons/icons/check.svg' as string),
  'gear': () => import('bootstrap-icons/icons/gear.svg' as string),
  'custom-logo': () => import('./../custom-icons/custom-logo.svg'),
}`}</CodeBlock>
      </Section>

      <Section title="Custom Patterns">
        <SectionDescription>
          Define custom regex patterns to detect icon usage in non-JSX contexts.
        </SectionDescription>

        <h3>Built-in Patterns</h3>
        <p>Generator automatically detects:</p>
        <ul>
          <li>
            JSX: <code>&lt;Icon type="..." /&gt;</code>
          </li>
          <li>
            Theme objects: <code>themed.xxxIcon ?? '...'</code>
          </li>
          <li>
            Object properties: <code>{`icon: '...'`}</code>
          </li>
        </ul>

        <h3>Adding Custom Patterns</h3>
        <CodeBlock language="typescript">{`customPatterns: [
  {
    name: 'Theme icon properties',
    pattern: '(\\\\w*[Ii]con):\\\\s*[\\'"](\\\\w+)[\\'"',
    captureGroup: 2,  // Which regex group contains the icon name
  },
  {
    name: 'Config objects',
    pattern: 'iconName:\\\\s*[\\'"](\\\\w+)[\\'"',
    captureGroup: 1,
  },
]`}</CodeBlock>

        <h3>Pattern Matching</h3>
        <p>Example code that will be matched:</p>
        <CodeBlock language="typescript">{`// Theme objects
const theme = {
  prefixIcon: 'gear',      // Matched by customPattern
  checkedIcon: 'check',    // Matched by customPattern
}

// Config objects
const config = {
  iconName: 'star'         // Matched by custom config pattern
}`}</CodeBlock>

        <h3>Testing Patterns</h3>
        <p>Use the generator in verbose mode to see what gets matched:</p>
        <CodeBlock language="bash">{`pnpm run generate-icons --verbose`}</CodeBlock>
      </Section>

      <Section title="Exclude Patterns">
        <SectionDescription>
          Exclude directories from being scanned for icon usage.
        </SectionDescription>

        <CodeBlock language="typescript">{`exclude: ['node_modules', 'dist', '.git', 'build', 'coverage']`}</CodeBlock>
        <p>
          Default excludes: <code>node_modules</code>, <code>dist</code>, <code>.git</code>
        </p>
      </Section>

      <Section title="Complete Example">
        <SectionDescription>
          Full configuration with all options for a real-world setup.
        </SectionDescription>

        <CodeBlock language="typescript">{`import { defineIconConfig } from '@phaserjsx/ui/scripts/icon-generator-config'

export default defineIconConfig({
  // Multiple icon sources
  source: [
    {
      package: 'bootstrap-icons',
      iconsPath: 'icons',
      label: 'Bootstrap Icons',
    },
    {
      directory: './src/custom-icons',
      label: 'Custom Icons',
    },
  ],

  // Type generation
  types: {
    enabled: true,
    scanIconDirectory: 'start',  // Once at server start
    output: './src/components/Icon/icon-types.generated.ts',
    typeName: 'IconType',
  },

  // Loader generation
  loaders: {
    enabled: true,
    generateLoaders: 'watch',    // Regenerate on code changes
    output: './src/components/Icon/icon-loaders.generated.ts',
    scanDir: './src',
    componentNames: ['Icon', 'BootstrapIcon'],
    validate: true,              // Warn about missing icons
  },

  // Custom detection patterns
  customPatterns: [
    {
      name: 'Theme icon properties',
      pattern: '(\\\\w*[Ii]con):\\\\s*[\\'"](\\\\w+)[\\'"',
      captureGroup: 2,
    },
  ],

  // Exclude directories
  exclude: ['node_modules', 'dist', '.git', 'build'],
})`}</CodeBlock>
      </Section>

      <Section title="Related Documentation">
        <ul>
          <li>
            <a href="/guides/icon-system">Icon System Overview</a> - Complete architecture guide
          </li>
          <li>
            <a href="/guides/custom-icon-component">Custom Icon Implementation</a> - Creating
            wrappers
          </li>
          <li>
            <a href="/guides/custom-svg-icons">Custom SVG Icons</a> - Adding local icons
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
