/**
 * Best Practices Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, ExampleSection, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { visibilityExample } from '@/content/best-practices.content'
import '@/styles/docs.css'

/**
 * Best Practices guide page showing tips, patterns, and recommended approaches
 */
export function BestPracticesPage() {
  return (
    <DocLayout>
      <h1>Best Practices</h1>
      <DocDescription>
        Tips, patterns, and best practices for building robust and performant PhaserJSX
        applications.
      </DocDescription>

      <Section title="Controlling Visibility">
        <SectionDescription>
          Understanding the different approaches to show/hide components and when to use each one.
        </SectionDescription>

        <h3>Three Approaches</h3>
        <p>
          PhaserJSX provides three distinct ways to control component visibility, each with
          different behavior and use cases:
        </p>

        <h4>1. visible={'{boolean}'} - Toggle Visibility (preserves layout space)</h4>
        <p>
          When you set <code>visible={'{false}'}</code>, the component becomes invisible but still
          occupies space in the layout. This is ideal when you want to hide something temporarily
          without causing layout shifts.
        </p>
        <CodeBlock language="tsx">
          {`<View visible={false}>
  <Text text="I'm hidden but take up space" />
</View>`}
        </CodeBlock>

        <h4>2. visible="none" - Remove from Layout</h4>
        <p>
          Using <code>visible="none"</code> not only hides the component but also removes it from
          the layout calculation. The parent container will reflow as if the component doesn't
          exist. Use this when you want the layout to adapt dynamically.
        </p>
        <CodeBlock language="tsx">
          {`<View visible="none">
  <Text text="I'm hidden and removed from layout" />
</View>`}
        </CodeBlock>

        <h4>
          3. Conditional Rendering - {'{'}condition && {'<Component />>'}
          {'}'}
        </h4>
        <p>
          With conditional rendering, the component is completely added/removed from the VDOM. This
          is the most performant option for components that won't be shown again soon, as it fully
          unmounts and cleans up resources.
        </p>
        <CodeBlock language="tsx">
          {`{showComponent && (
  <View>
    <Text text="I'm fully mounted/unmounted" />
  </View>
)}`}
        </CodeBlock>

        <h3>Interactive Example</h3>
        <ExampleSection example={visibilityExample} />

        <h3>When to Use Each Approach</h3>

        <h4>Use visible={'{false}'} when:</h4>
        <ul>
          <li>You want to toggle visibility frequently</li>
          <li>Layout stability is important (avoid shifts)</li>
          <li>The component will be shown again soon</li>
          <li>Performance impact of keeping it in the scene is minimal</li>
        </ul>

        <h4>Use visible="none" when:</h4>
        <ul>
          <li>You need the layout to reflow dynamically</li>
          <li>Space should be reclaimed when hidden</li>
          <li>Similar to CSS display: none</li>
        </ul>

        <h4>Use conditional rendering when:</h4>
        <ul>
          <li>Component won't be shown again for a while</li>
          <li>You want to free up resources completely</li>
          <li>Component has expensive initialization</li>
          <li>You need to reset component state on re-mount</li>
        </ul>

        <div className="callout callout-tip">
          <strong>Performance Tip:</strong> For frequently toggled components, prefer{' '}
          <code>visible={'{false}'}</code> over conditional rendering to avoid the overhead of
          mounting/unmounting. For rarely shown components, use conditional rendering to free up
          memory and resources.
        </div>
      </Section>
    </DocLayout>
  )
}
