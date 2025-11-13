/**
 * Demo: two independent counters using the custom hooks + rexUI widgets.
 * Assumes the Scene has rexUI plugin installed as "rexUI".
 */
import { RexLabel, RexSizer, useState, type VNode } from '@phaserjsx/ui'

/**
 * Counter component with configurable step
 * @param props - Counter properties
 * @returns Counter component JSX
 */
export function Counter(props: { step?: number; label?: string; x?: number; y?: number }) {
  const [n, setN] = useState(0)
  const step = props.step ?? 1
  return (
    <RexSizer x={props.x ?? 0} y={props.y ?? 0} orientation="y" space={{ item: 10 }} align="center">
      <RexLabel text={`${props.label ?? 'Count'}: ${n}`} textStyle={{ fontSize: 24 }} />
      <RexLabel
        text={`Add +${step}`}
        background={{ radius: 6, color: 0x555555 }}
        onPointerdown={() => {
          setN((v) => v + step)
        }}
      />
    </RexSizer>
  )
}

/**
 * Button component using RexSizer as interactive container
 * @param props - Button properties
 * @returns Button component JSX
 */
export function Button(props: {
  children?: VNode | VNode[] | null | undefined
  onClick?: () => void
  x?: number
  y?: number
  background?: { radius?: number; color?: number }
}) {
  return (
    <RexSizer
      x={props.x ?? 0}
      y={props.y ?? 0}
      width={100}
      height={50}
      orientation="y"
      background={props.background ?? { radius: 6, color: 0x555555 }}
      onPointerdown={props.onClick}
      space={{ left: 10, right: 10, top: 10, bottom: 10 }}
      align="center"
    >
      {props.children}
    </RexSizer>
  )
}

/**
 * Example: Two independent counters
 * @returns Counters example JSX
 */
export function CountersExample() {
  const [count, setCount] = useState(0)

  return (
    <RexSizer orientation="y" space={{ item: 16 }} align="center">
      <RexLabel text="Two independent counters:" textStyle={{ fontSize: 28 }} />
      <Counter step={1} label="A" />
      <Counter step={5} label="B" />
      <Button
        onClick={() => {
          console.log('Button clicked')
          setCount(count + 1)
        }}
      >
        <RexLabel text="Click me" />
        <RexLabel text={`Clicked: ${count}`} textStyle={{ fontSize: 16 }} />
      </Button>
    </RexSizer>
  )
}

/**
 * Example: Various RexLabel styles
 * @returns RexLabel examples JSX
 */
export function RexLabelExamples() {
  return (
    <RexSizer orientation="y" space={{ item: 10 }} align="left">
      <RexLabel text="RexLabel Examples:" textStyle={{ fontSize: 28 }} />
      <RexLabel text="Default text" />
      <RexLabel text="Small text" size="small" />
      <RexLabel text="Large bold text" size="large" weight="bold" />
      <RexLabel text="Shadow text" shadow={true} />
      <RexLabel text="Colored text" textColor="#ff0000" />
      <RexLabel text="Background text" backgroundColor="#ffff00" />
      <RexLabel
        text="Word wrapped text with longer content to demonstrate wrapping"
        wordWrap={{ width: 300 }}
      />
    </RexSizer>
  )
}

/**
 * Main app component with example selector
 * @returns App component JSX
 */
export function App() {
  const [currentExample, setCurrentExample] = useState(0)

  const examples = [
    { name: 'Counters', render: () => <CountersExample /> },
    { name: 'RexLabel', render: () => <RexLabelExamples /> },
  ]

  return (
    <RexSizer x={400} y={300} orientation="y" space={{ item: 20 }} align="center">
      {/* Navigation */}
      <RexSizer orientation="x" space={{ item: 10 }} align="center">
        {examples.map((example, index) => (
          <Button
            onClick={() => setCurrentExample(index)}
            background={{ radius: 6, color: currentExample === index ? 0x00ff00 : 0x555555 }}
          >
            <RexLabel text={example.name} textStyle={{ fontSize: 18 }} />
          </Button>
        ))}
      </RexSizer>

      {/* Current example - conditional rendering to force unmount on change */}
      {currentExample === 0 && <CountersExample />}
      {currentExample === 1 && <RexLabelExamples />}
    </RexSizer>
  )
}
