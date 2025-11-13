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
    <RexSizer x={props.x ?? 0} y={props.y ?? 0} orientation="y" space={{ item: 10 }} align="center">
      <RexLabel text={`${props.label ?? 'Count'}: ${n}`} textStyle={{ fontSize: 24 }} />
      <RexLabel
        text={`Add +${step}`}
        background={{ radius: 6, color: 0x555555 }}
        onPointerdown={() => setN((v) => v + step)}
      />
    </RexSizer>
  )
}

/**
 * Main app component with two independent counters
 * @returns App component JSX
 */
export function App() {
  return (
    <RexSizer x={400} y={250} orientation="y" space={{ item: 16 }} align="center">
      <RexLabel text="Two independent counters:" textStyle={{ fontSize: 28 }} />
      <Counter step={1} label="A" />
      <Counter step={5} label="B" />
    </RexSizer>
  )
}
