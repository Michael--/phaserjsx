/**
 * Testing & Development Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, PropsTable, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

export function TestingPage() {
  const exampleProps = [
    {
      name: 'id',
      type: 'string',
      description: 'Unique identifier',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Display title',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Brief description',
    },
    {
      name: 'component',
      type: '(props) => VNode',
      description: 'PhaserJSX component function',
    },
    {
      name: 'height',
      type: 'SceneSize | number',
      description: 'Scene height (use SCENE_SIZES constants)',
    },
    {
      name: 'code',
      type: 'string',
      description: 'Source code to display',
    },
    {
      name: 'background',
      type: 'BackgroundConfig',
      description: 'Optional background configuration',
    },
  ]

  const sceneSizes = [
    {
      name: 'SCENE_SIZES.compact',
      type: '150',
      description: 'Single element showcase',
    },
    {
      name: 'SCENE_SIZES.small',
      type: '200',
      description: '2-3 elements',
    },
    {
      name: 'SCENE_SIZES.medium',
      type: '300',
      description: 'Default, most examples',
    },
    {
      name: 'SCENE_SIZES.large',
      type: '400',
      description: 'Complex layouts',
    },
    {
      name: 'SCENE_SIZES.xl',
      type: '600',
      description: 'Full feature demos',
    },
  ]

  return (
    <DocLayout>
      <h1>Testing & Development</h1>
      <DocDescription>
        Guide for creating and testing PhaserJSX component examples in the documentation system.
      </DocDescription>

      <Section title="Example Structure">
        <SectionDescription>
          Examples are organized in a structured format for consistency and maintainability.
        </SectionDescription>

        <h3>1. Create Example Component</h3>
        <CodeBlock language="tsx">
          {`/**
 * Button Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

export function QuickStartButtonExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <Button onClick={() => console.log('Clicked!')}>
        <Text text="Click Me" />
      </Button>
    </View>
  )
}`}
        </CodeBlock>

        <h3>2. Create Content Definition</h3>
        <CodeBlock language="tsx">
          {`import { SCENE_SIZES } from '@/constants/scene-sizes'
import { QuickStartButtonExample } from '@/examples/button'
import type { ComponentDocs } from '@/types/docs'

export const buttonContent: ComponentDocs = {
  title: 'Button',
  description: 'Interactive button component...',
  
  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic button with click handler',
    component: QuickStartButtonExample,
    height: SCENE_SIZES.compact,
    code: \`...\`,
  },
  
  examples: [
    // Additional examples...
  ],
  
  propsEssential: [
    // Essential props only
  ],
  
  propsComplete: [
    // All component-specific props
  ],
  
  inherits: [
    // Parent components
  ],
}`}
        </CodeBlock>

        <h3>3. Create Documentation Page</h3>
        <CodeBlock language="tsx">
          {`/** @jsxImportSource react */
import {
  DocDescription,
  ExampleSection,
  InheritedProps,
  PropsTable,
  Section,
  ToggleButton,
} from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { buttonContent } from '@/content/button.content'

export function ButtonPage() {
  return (
    <DocLayout>
      <h1>{buttonContent.title}</h1>
      <DocDescription>{buttonContent.description}</DocDescription>
      
      <Section title="Quick Start">
        <LiveExample
          sceneFactory={() => createPhaserScene(buttonContent.quickStart.component)}
          height={buttonContent.quickStart.height}
        />
      </Section>
      
      {/* More sections... */}
    </DocLayout>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Example Definition">
        <SectionDescription>
          Each example follows the ExampleDefinition interface:
        </SectionDescription>
        <PropsTable props={exampleProps} />
      </Section>

      <Section title="Scene Sizes">
        <SectionDescription>
          Use predefined scene sizes for consistency across documentation:
        </SectionDescription>
        <PropsTable props={sceneSizes} />
      </Section>

      <Section title="Best Practices">
        <h3>Component Organization</h3>
        <ul className="feature-list">
          <li>
            📁 One folder per component in <code>examples/</code>
          </li>
          <li>📄 Separate file for each example type</li>
          <li>📋 Export all examples from index.ts</li>
          <li>
            📝 Content definitions in <code>content/</code>
          </li>
        </ul>

        <h3>Example Progression</h3>
        <ul className="feature-list">
          <li>🎯 Start simple - Quick Start should be minimal</li>
          <li>📈 Progress gradually - Each example adds one concept</li>
          <li>🎨 Visual variety - Use different variants/states</li>
          <li>💡 Practical examples - Show real-world usage</li>
        </ul>

        <h3>Props Documentation</h3>
        <ul className="feature-list">
          <li>✂️ Component-specific props only in propsEssential/propsComplete</li>
          <li>
            🔗 Document inherited props via <code>inherits</code> array
          </li>
          <li>📊 Top 4-6 props in Essential, all in Complete</li>
          <li>📖 Clear, concise descriptions with examples</li>
        </ul>

        <h3>Code Quality</h3>
        <ul className="feature-list">
          <li>✅ Always include JSDoc comments</li>
          <li>🏷️ Use TypeScript types explicitly</li>
          <li>🎨 Follow existing naming conventions</li>
          <li>🧪 Test examples in isolation before integration</li>
        </ul>
      </Section>

      <Section title="Testing Workflow">
        <h3>1. Dev Server</h3>
        <CodeBlock language="bash">
          {`cd apps/docs-site
pnpm dev`}
        </CodeBlock>

        <h3>2. Create Example</h3>
        <p className="section-description">
          Create component file in <code>examples/your-component/</code>
        </p>

        <h3>3. Add to Content</h3>
        <p className="section-description">
          Import and add to content definition in <code>content/your-component.content.ts</code>
        </p>

        <h3>4. Hot Reload</h3>
        <p className="section-description">
          Changes automatically reload in browser. Check console for errors.
        </p>

        <h3>5. Debug</h3>
        <ul className="feature-list">
          <li>🔍 Use browser DevTools for React debugging</li>
          <li>🎮 Check Phaser console logs for scene issues</li>
          <li>🖼️ Inspect canvas element for rendering problems</li>
          <li>⚠️ Watch for TypeScript errors in terminal</li>
        </ul>
      </Section>
    </DocLayout>
  )
}
