/**
 * Demo: two independent counters using custom hooks + native Phaser primitives.
 */
import { Text, View, useState } from '@phaserjsx/ui'

/**
 * Counter component with configurable step
 * @param props - Counter properties
 * @returns Counter component JSX
 */
export function Counter(props: { step?: number; label?: string }) {
  const [n, setN] = useState(0)
  const step = props.step ?? 1
  return (
    <View y={0}>
      <Text text={`${props.label ?? 'Count'}: ${n}`} y={0} />
      <View
        width={150}
        height={30}
        y={30}
        onPointerDown={() => {
          setN((v) => v + step)
        }}
      >
        <Text text={`Add +${step}`} />
      </View>
    </View>
  )
}

/**
 * Example: Two independent counters
 * @returns Counters example JSX
 */
export function CountersExample() {
  return (
    <View x={100} y={100}>
      <Text text="Two independent counters" y={0} />
      <View y={40}>
        <Counter step={1} label="A" />
      </View>
      <View y={120}>
        <Counter step={5} label="B" />
      </View>
    </View>
  )
}

/**
 * Main app component with example selector
 * @returns App component JSX
 */
export function App() {
  return <CountersExample />
}
