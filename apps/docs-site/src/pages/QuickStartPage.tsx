/**
 * Quick Start Guide
 */
/** @jsxImportSource react */
import { DocDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Quick Start guide for PhaserJSX
 */
export function QuickStartPage() {
  return (
    <DocLayout>
      <h1>Quick Start</h1>
      <DocDescription>
        Get up and running with PhaserJSX in minutes. This guide walks you through creating your
        first PhaserJSX component and rendering it in a Phaser game.
      </DocDescription>

      {/* Step 1: Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">1. Installation</h2>
        <p className="mb-4">Install PhaserJSX and Phaser 3 via your package manager:</p>
        <CodeBlock language="bash">{`npm install @phaserjsx/ui phaser`}</CodeBlock>
        <p className="mt-4 text-sm text-gray-600">
          Or use <code>yarn add</code> or <code>pnpm add</code>
        </p>
      </section>

      {/* Step 2: Configure TypeScript */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">2. Configure TypeScript</h2>
        <p className="mb-4">
          Update your <code>tsconfig.json</code> to enable JSX support:
        </p>
        <CodeBlock language="json">
          {`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@phaserjsx/ui",
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler"
  }
}`}
        </CodeBlock>
      </section>

      {/* Step 3: Create Your First Component */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">3. Create Your First Component</h2>
        <p className="mb-4">
          Create a simple counter component using PhaserJSX hooks and components:
        </p>
        <CodeBlock language="tsx">
          {`/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View, useState } from '@phaserjsx/ui'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <View
      width={'fill'}
      height={'fill'}
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={20}
    >
      <Text
        text={\`Count: \${count}\`}
        style={{ fontSize: '32px', color: '#333' }}
      />

      <View direction="row" gap={12}>
        <Button onClick={() => setCount(count - 1)}>
          <Text text="−" style={{ fontSize: '24px' }} />
        </Button>

        <Button onClick={() => setCount(count + 1)}>
          <Text text="+" style={{ fontSize: '24px' }} />
        </Button>
      </View>
    </View>
  )
}`}
        </CodeBlock>
      </section>

      {/* Step 4: Create Phaser Scene */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">4. Create a Phaser Scene</h2>
        <p className="mb-4">Create a scene that mounts your PhaserJSX component:</p>
        <CodeBlock language="typescript">
          {`import Phaser from 'phaser'
import { mount } from '@phaserjsx/ui'
import { Counter } from './Counter'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Mount the Counter component
    mount(<Counter />, this)
  }
}`}
        </CodeBlock>
      </section>

      {/* Step 5: Initialize Phaser Game */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">5. Initialize Phaser Game</h2>
        <p className="mb-4">Set up your Phaser game config and start the game:</p>
        <CodeBlock language="typescript">
          {`import Phaser from 'phaser'
import { GameScene } from './GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#f0f0f0',
  scene: [GameScene],
}

new Phaser.Game(config)`}
        </CodeBlock>
      </section>

      {/* Step 6: HTML Setup */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">6. HTML Setup</h2>
        <p className="mb-4">Create a container for your game:</p>
        <CodeBlock language="html">
          {`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhaserJSX Quick Start</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`}
        </CodeBlock>
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
        <p className="mb-4">Here's a complete working example with all pieces together:</p>

        <h3 className="text-xl font-semibold mb-3">src/main.ts</h3>
        <CodeBlock language="typescript">
          {`/** @jsxImportSource @phaserjsx/ui */
import Phaser from 'phaser'
import { mount, Button, Text, View, useState } from '@phaserjsx/ui'

// Component
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <View
      width={'fill'}
      height={'fill'}
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={20}
      backgroundColor={0xf0f0f0}
    >
      <Text
        text={\`Count: \${count}\`}
        style={{ fontSize: '32px', color: '#333', fontWeight: 'bold' }}
      />

      <View direction="row" gap={12}>
        <Button
          variant="secondary"
          onClick={() => setCount(count - 1)}
        >
          <Text text="Decrement" />
        </Button>

        <Button
          variant="primary"
          onClick={() => setCount(count + 1)}
        >
          <Text text="Increment" />
        </Button>
      </View>

      <Button
        variant="ghost"
        onClick={() => setCount(0)}
      >
        <Text text="Reset" />
      </Button>
    </View>
  )
}

// Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    mount(<Counter />, this)
  }
}

// Game Config
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#ffffff',
  scene: [GameScene],
}

// Start Game
new Phaser.Game(config)`}
        </CodeBlock>
      </section>

      {/* Key Concepts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Key Concepts</h2>

        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-semibold mb-2">JSX Import Source</h3>
            <p>
              Always add <code>/** @jsxImportSource @phaserjsx/ui */</code> at the top of files
              using JSX. This tells TypeScript to use PhaserJSX's JSX runtime instead of React's.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-semibold mb-2">Hooks</h3>
            <p>
              PhaserJSX provides React-like hooks: <code>useState</code>, <code>useEffect</code>,{' '}
              <code>useMemo</code>, <code>useCallback</code>, and more. Use them just like in React.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-semibold mb-2">View Component</h3>
            <p>
              <code>View</code> is the fundamental layout container. Use it like a div in HTML - it
              supports flexbox-like layouts, backgrounds, borders, and gestures. An empty View
              without a background is invisible!
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-semibold mb-2">Size Values</h3>
            <p>
              Size props accept multiple formats: pixels (<code>200</code>), percentages (
              <code>"50%"</code>), viewport units (<code>"100vw"</code>), keywords (
              <code>"fill"</code>, <code>"auto"</code>), and calc expressions (
              <code>"calc(100% - 20px)"</code>).
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-semibold mb-2">Mount Function</h3>
            <p>
              Use <code>mount(component, scene)</code> to render your component tree into a Phaser
              scene. Call this in the scene's <code>create()</code> method.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="mb-4">Now that you have a working PhaserJSX app, explore more:</p>

        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/guides/layout-patterns" className="text-blue-600 hover:text-blue-800">
                Layout Patterns →
              </a>
            </h3>
            <p className="text-gray-700">
              Learn flexbox-like layouts with <code>direction</code>, <code>justifyContent</code>,{' '}
              <code>alignItems</code>, and <code>flex</code> properties.
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/guides/responsive-design" className="text-blue-600 hover:text-blue-800">
                Responsive Design →
              </a>
            </h3>
            <p className="text-gray-700">
              Build responsive UIs with viewport units, size constraints, and adaptive layouts.
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/guides/theme-system" className="text-blue-600 hover:text-blue-800">
                Theme System →
              </a>
            </h3>
            <p className="text-gray-700">
              Centralize styling with themes, design tokens, and runtime theme switching.
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/components/button" className="text-blue-600 hover:text-blue-800">
                Components →
              </a>
            </h3>
            <p className="text-gray-700">
              Explore built-in components: Button, Toggle, Slider, ScrollView, Modal, Dialog, and
              more.
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/api/hooks" className="text-blue-600 hover:text-blue-800">
                Hooks API →
              </a>
            </h3>
            <p className="text-gray-700">
              Complete reference for useState, useEffect, useMemo, useTheme, useSVGTexture, and all
              other hooks.
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/guides/effects-animations" className="text-blue-600 hover:text-blue-800">
                Effects & Animations →
              </a>
            </h3>
            <p className="text-gray-700">
              Add visual polish with 23 built-in effects: pulse, shake, bounce, fade, slide, and
              more.
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Nothing renders / Blank screen</h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>
                Check that you added{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  /** @jsxImportSource @phaserjsx/ui */
                </code>{' '}
                at the top of your component file
              </li>
              <li>
                Ensure your View has a <code>backgroundColor</code> or content - empty Views are
                invisible
              </li>
              <li>
                Verify you called <code>mount(component, scene)</code> in the scene's{' '}
                <code>create()</code> method
              </li>
              <li>Check browser console for TypeScript or runtime errors</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">TypeScript errors with JSX</h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>
                Verify <code>tsconfig.json</code> has{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">"jsx": "react-jsx"</code>
              </li>
              <li>
                Ensure{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  "jsxImportSource": "@phaserjsx/ui"
                </code>{' '}
                is set
              </li>
              <li>Restart your TypeScript server (VS Code: Reload Window)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              State doesn't update / UI doesn't re-render
            </h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>
                Use <code>useState</code> for reactive state, not regular variables
              </li>
              <li>
                For state based on previous value, use functional updates:{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">setCount(prev =&gt; prev + 1)</code>
              </li>
              <li>Check that you're calling the setter function, not mutating state directly</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Component doesn't respond to clicks/touches
            </h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>
                Add <code className="bg-gray-100 px-2 py-1 rounded">enableGestures={'{true}'}</code>{' '}
                to the View
              </li>
              <li>
                For clickable elements, use <code>Button</code> component instead of raw View
              </li>
              <li>Ensure the element has a visible background or is large enough to click</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Common Patterns */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Common Patterns</h2>

        <div className="space-y-8">
          {/* Form State */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Form State Management</h3>
            <CodeBlock language="tsx">
              {`function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    console.log('Login:', username, password)
  }

  return (
    <View direction="column" gap={16} padding={20}>
      <CharTextInput
        value={username}
        onChange={setUsername}
        placeholder="Username"
      />
      <CharTextInput
        value={password}
        onChange={setPassword}
        placeholder="Password"
        password={true}
      />
      <Button onClick={handleSubmit}>
        <Text text="Login" />
      </Button>
    </View>
  )
}`}
            </CodeBlock>
          </div>

          {/* List Rendering */}
          <div>
            <h3 className="text-xl font-semibold mb-3">List Rendering</h3>
            <CodeBlock language="tsx">
              {`function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn PhaserJSX', done: false },
    { id: 2, text: 'Build a game', done: false },
  ])

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  return (
    <View direction="column" gap={8} padding={20}>
      {todos.map(todo => (
        <View
          key={todo.id}
          direction="row"
          gap={12}
          padding={12}
          backgroundColor={todo.done ? 0xe0e0e0 : 0xffffff}
          cornerRadius={8}
        >
          <Toggle
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <Text
            text={todo.text}
            style={{
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#999' : '#333',
            }}
          />
        </View>
      ))}
    </View>
  )
}`}
            </CodeBlock>
          </div>

          {/* Conditional Rendering */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Conditional Rendering</h3>
            <CodeBlock language="tsx">
              {`function Notification() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')

  const showNotification = (msg: string) => {
    setMessage(msg)
    setShow(true)
    setTimeout(() => setShow(false), 3000)
  }

  return (
    <View>
      <Button onClick={() => showNotification('Hello!')}>
        <Text text="Show Notification" />
      </Button>

      {show && (
        <View
          x={20}
          y={20}
          padding={16}
          backgroundColor={0x4caf50}
          cornerRadius={8}
        >
          <Text text={message} style={{ color: '#fff' }} />
        </View>
      )}
    </View>
  )
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <ul className="space-y-2">
          <li>
            <a href="/introduction" className="text-blue-600 hover:text-blue-800">
              Introduction - Why PhaserJSX?
            </a>
          </li>
          <li>
            <a href="/installation" className="text-blue-600 hover:text-blue-800">
              Installation - Detailed setup guide
            </a>
          </li>
          <li>
            <a href="/guides/best-practices" className="text-blue-600 hover:text-blue-800">
              Best Practices - Code patterns and conventions
            </a>
          </li>
          <li>
            <a href="/api/core-props" className="text-blue-600 hover:text-blue-800">
              Core Props - LayoutProps, TransformProps, GestureProps reference
            </a>
          </li>
          <li>
            <a href="/guides/performance" className="text-blue-600 hover:text-blue-800">
              Performance - Optimization techniques
            </a>
          </li>
        </ul>
      </section>
    </DocLayout>
  )
}
