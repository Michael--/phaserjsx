/**
 * Demo: two independent counters using the custom hooks + rexUI widgets.
 * Assumes the Scene has rexUI plugin installed as "rexUI".
 */
import { RexLabel, RexSizer, useState } from '@phaserjsx/ui'

/**
 * Counter component with configurable step
 * @param props - Counter properties
 * @returns Counter component JSX
 */
export function Counter(props: { step?: number; label?: string; x?: number; y?: number }) {
  const [n, setN] = useState(0)
  const step = props.step ?? 1
  return (
    <RexSizer orientation="y">
      <RexLabel text={`${props.label ?? 'Count'}: ${n}`} />
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
 * Example: Two independent counters
 * @returns Counters example JSX
 */
export function CountersExample() {
  return (
    <RexSizer orientation="y">
      <RexLabel text="Two independent counters" />
      <Counter step={1} label="A" />
      <Counter step={5} label="B" />
    </RexSizer>
  )
}

/**
 * Main app component with example selector
 * @returns App component JSX
 */
export function App() {
  return <CountersExample />
}
