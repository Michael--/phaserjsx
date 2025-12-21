/** @jsxImportSource react */
import {
  CodeBlock,
  DocParagraph,
  DocSection,
  DocTitle,
  SectionTitle,
} from '../components/Doc/Typography'
import { DocLayout } from '../components/Layout/DocLayout'
import basicSceneCode from '../examples-docs/installation/basic-scene.tsx?raw'
import devConfigCode from '../examples-docs/installation/dev-config.ts?raw'
import gameConfigCode from '../examples-docs/installation/game-config.ts?raw'
import inputConfigCode from '../examples-docs/installation/input-config.ts?raw'
import propsCode from '../examples-docs/installation/mount-with-props.tsx?raw'
import multiMountCode from '../examples-docs/installation/multi-mount.tsx?raw'
import lifecycleCode from '../examples-docs/installation/scene-lifecycle.tsx?raw'
import testCode from '../examples-docs/installation/test-component.tsx?raw'
import '../styles/docs.css'

/**
 * Installation guide for PhaserJSX
 */
export function InstallationPage() {
  return (
    <DocLayout>
      <DocTitle>Installation</DocTitle>

      <DocParagraph>
        Get started with PhaserJSX in your Phaser 3 project. This guide covers package installation
        and basic setup to integrate PhaserJSX into your game or application.
      </DocParagraph>

      <DocSection>
        <SectionTitle>Prerequisites</SectionTitle>
        <DocParagraph>Before installing PhaserJSX, ensure you have the following:</DocParagraph>
        <div className="doc-list">
          <div className="doc-list-item">
            <strong>Node.js:</strong> Version 18.0.0 or higher
          </div>
          <div className="doc-list-item">
            <strong>Package Manager:</strong> npm, yarn, or pnpm
          </div>
          <div className="doc-list-item">
            <strong>TypeScript:</strong> Version 5.0+ recommended (for best type safety)
          </div>
          <div className="doc-list-item">
            <strong>Phaser 3:</strong> Version 3.80.0 or higher
          </div>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>1. Install the Package</SectionTitle>

        <div className="installation-notice">
          <strong>⚠️ Pre-Release Notice</strong>
          <p>
            PhaserJSX is currently in pre-release development and not yet published to npm. Once
            published, you'll be able to install it via:
          </p>
        </div>

        <CodeBlock language="bash" title="npm">
          {`npm install @number10/phaserjsx`}
        </CodeBlock>

        <CodeBlock language="bash" title="yarn">
          {`yarn add @number10/phaserjsx`}
        </CodeBlock>

        <CodeBlock language="bash" title="pnpm">
          {`pnpm add @number10/phaserjsx`}
        </CodeBlock>

        <DocParagraph>
          PhaserJSX will automatically install Phaser 3 as a peer dependency if it's not already in
          your project.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <SectionTitle>2. TypeScript Configuration</SectionTitle>
        <DocParagraph>
          PhaserJSX uses JSX syntax, so you need to configure TypeScript to recognize it. Add the
          following to your <code>tsconfig.json</code>:
        </DocParagraph>

        <CodeBlock language="json" title="tsconfig.json">
          {`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@number10/phaserjsx",
    "moduleResolution": "bundler",
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "strict": true
  }
}`}
        </CodeBlock>

        <DocParagraph>The key settings are:</DocParagraph>
        <div className="doc-list">
          <div className="doc-list-item">
            <code>"jsx": "react-jsx"</code> - Enables modern JSX transform
          </div>
          <div className="doc-list-item">
            <code>"jsxImportSource": "@number10/phaserjsx"</code> - Uses PhaserJSX's JSX runtime
            instead of React's
          </div>
          <div className="doc-list-item">
            <code>"moduleResolution": "bundler"</code> - Required for modern build tools like Vite
            to resolve package exports correctly
          </div>
        </div>

        <div className="doc-subsection">
          <h3>JSX Type Definitions</h3>
          <DocParagraph>
            To enable IntelliSense and type checking for PhaserJSX JSX elements, create a{' '}
            <code>types.d.ts</code> file in your project root (or <code>src/</code> directory):
          </DocParagraph>

          <CodeBlock language="typescript" title="types.d.ts">
            {`// Import PhaserJSX JSX type definitions
import "@number10/phaserjsx/dist/jsx-types"`}
          </CodeBlock>

          <DocParagraph>
            This file imports the global JSX namespace declarations, allowing TypeScript to
            understand which JSX elements and props are available. Without this import:
          </DocParagraph>
          <div className="doc-list">
            <div className="doc-list-item">
              TypeScript won't recognize <code>&lt;View&gt;</code>, <code>&lt;Text&gt;</code>, etc.
              as valid JSX elements
            </div>
            <div className="doc-list-item">
              You won't get autocomplete for component props in your IDE
            </div>
            <div className="doc-list-item">Type errors won't be caught at compile time</div>
          </div>

          <div className="info-box">
            <strong>💡 Why is this needed?</strong>
            <p>
              TypeScript's JSX type system relies on global namespace augmentation. The{' '}
              <code>jsxImportSource</code> tells TypeScript which runtime to use, but the type
              definitions for available elements must be explicitly imported. This is similar to how{' '}
              <code>@types/react</code> works for React projects.
            </p>
          </div>
        </div>

        <div className="info-box">
          <strong>💡 Per-File JSX Source</strong>
          <p>
            If you're mixing React and PhaserJSX in the same project (like in a documentation site),
            you can override the JSX source per file using a pragma comment:
          </p>
          <CodeBlock language="typescript">
            {`/** @jsxImportSource @number10/phaserjsx */
import { View, Text } from '@number10/phaserjsx'

// This file uses PhaserJSX JSX runtime`}
          </CodeBlock>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>3. Integrating with Phaser</SectionTitle>
        <DocParagraph>
          PhaserJSX components are rendered within Phaser scenes using the <code>mountJSX</code>{' '}
          function. This is the bridge between Phaser's Scene lifecycle and your JSX components.
        </DocParagraph>

        <div className="doc-subsection">
          <h3>Basic Scene Setup</h3>
          <DocParagraph>
            Here's a complete example of integrating PhaserJSX into a Phaser scene:
          </DocParagraph>

          <CodeBlock language="typescript" title="GameScene.tsx">
            {basicSceneCode}
          </CodeBlock>
        </div>

        <div className="doc-subsection">
          <h3>Understanding mountJSX</h3>
          <DocParagraph>
            The <code>mountJSX</code> function is your entry point for rendering PhaserJSX
            components:
          </DocParagraph>

          <CodeBlock language="typescript">
            {`mountJSX(
  container: Phaser.Scene | Phaser.GameObjects.Container,
  component: VNode,
  props?: Record<string, any>
): () => void`}
          </CodeBlock>

          <div className="doc-list">
            <div className="doc-list-item">
              <strong>container:</strong> The Phaser Scene or Container to render into. Components
              will be added as children to this container.
            </div>
            <div className="doc-list-item">
              <strong>component:</strong> Your root JSX component (a VNode).
            </div>
            <div className="doc-list-item">
              <strong>props:</strong> Optional props to pass to the root component.
            </div>
            <div className="doc-list-item">
              <strong>Returns:</strong> An unmount function you can call to destroy the component
              tree.
            </div>
          </div>
        </div>

        <div className="doc-subsection">
          <h3>Complete Phaser Game Config</h3>
          <CodeBlock language="typescript" title="main.ts">
            {gameConfigCode}
          </CodeBlock>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>4. Important Considerations</SectionTitle>

        <div className="doc-subsection">
          <h3>Scene Lifecycle</h3>
          <DocParagraph>
            PhaserJSX automatically integrates with Phaser's scene lifecycle:
          </DocParagraph>
          <div className="doc-list">
            <div className="doc-list-item">
              <strong>create():</strong> Call <code>mountJSX()</code> here to render your UI
            </div>
            <div className="doc-list-item">
              <strong>update():</strong> PhaserJSX components update automatically when state
              changes
            </div>
            <div className="doc-list-item">
              <strong>shutdown():</strong> Components are automatically cleaned up when scene shuts
              down
            </div>
          </div>

          <CodeBlock language="typescript">{lifecycleCode}</CodeBlock>
        </div>

        <div className="doc-subsection">
          <h3>Multiple Mount Points</h3>
          <DocParagraph>
            You can mount multiple component trees in different containers:
          </DocParagraph>

          <CodeBlock language="typescript">{multiMountCode}</CodeBlock>
        </div>

        <div className="doc-subsection">
          <h3>Passing Props</h3>
          <DocParagraph>Pass data from your scene to mounted components:</DocParagraph>

          <CodeBlock language="typescript">{propsCode}</CodeBlock>
        </div>

        <div className="doc-subsection">
          <h3>Development Mode</h3>
          <DocParagraph>Enable development warnings and debugging features:</DocParagraph>

          <CodeBlock language="typescript">{devConfigCode}</CodeBlock>
        </div>

        <div className="doc-subsection">
          <h3>Input Configuration</h3>
          <DocParagraph>
            For interactive components (Button, Checkbox, etc.) to work properly, ensure your Phaser
            config includes input settings:
          </DocParagraph>

          <CodeBlock language="typescript">{inputConfigCode}</CodeBlock>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>5. Verify Installation</SectionTitle>
        <DocParagraph>Create a simple test component to verify everything is working:</DocParagraph>

        <CodeBlock language="typescript" title="TestScene.ts">
          {testCode}
        </CodeBlock>

        <DocParagraph>
          If you see the text and can click the button to increment the counter, you're all set! 🎉
        </DocParagraph>
      </DocSection>

      <DocSection>
        <SectionTitle>Troubleshooting</SectionTitle>

        <div className="doc-subsection">
          <h3>JSX Not Recognized</h3>
          <DocParagraph>
            <strong>Problem:</strong> TypeScript errors about JSX syntax
          </DocParagraph>
          <DocParagraph>
            <strong>Solution:</strong> Ensure <code>tsconfig.json</code> has{' '}
            <code>"jsx": "react-jsx"</code>
            and <code>"jsxImportSource": "@number10/phaserjsx"</code>
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>Components Not Rendering</h3>
          <DocParagraph>
            <strong>Problem:</strong> Components mount but nothing appears on screen
          </DocParagraph>
          <DocParagraph>
            <strong>Solution:</strong> Check that your scene's camera is properly configured and
            components have valid dimensions (width/height or layout properties)
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>Input Events Not Working</h3>
          <DocParagraph>
            <strong>Problem:</strong> Buttons and interactive components don't respond
          </DocParagraph>
          <DocParagraph>
            <strong>Solution:</strong> Verify Phaser config includes <code>input</code> settings and
            components have <code>interactive: true</code> (default for Button, etc.)
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>Type Errors with Props</h3>
          <DocParagraph>
            <strong>Problem:</strong> TypeScript complains about component props
          </DocParagraph>
          <DocParagraph>
            <strong>Solution:</strong> Ensure you're using TypeScript 5.0+ and your IDE has the
            latest TypeScript language server
          </DocParagraph>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>Next Steps</SectionTitle>
        <DocParagraph>Now that PhaserJSX is installed, explore the documentation:</DocParagraph>
        <div className="doc-list">
          <div className="doc-list-item">
            <a href="/components/button">Button Component</a> - Learn about interactive buttons
          </div>
          <div className="doc-list-item">
            <a href="/guides/testing">Testing Guide</a> - Creating and testing examples
          </div>
          <div className="doc-list-item">
            <a href="/guides/scene-backgrounds">Scene Backgrounds</a> - Customizing scene visuals
          </div>
        </div>
      </DocSection>
    </DocLayout>
  )
}
