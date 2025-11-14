/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
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
    <View margin={{ top: 10, bottom: 10 }} height={60}>
      <Text text={`${props.label ?? 'Count'}: ${n}`} height={20} />
      <View
        width={150}
        height={30}
        margin={{ top: 5 }}
        backgroundColor={0x555555}
        onPointerDown={() => {
          setN((v) => v + step)
        }}
      >
        <Text text={`Add +${step}`} margin={{ left: 10, top: 5 }} height={20} />
      </View>
    </View>
  )
}

/**
 * Example: Layout system demonstration
 * Shows automatic vertical stacking with margins and padding
 * @returns Layout demo JSX
 */
export function LayoutExample() {
  return (
    <View
      x={50}
      y={50}
      width={400}
      height={500}
      backgroundColor={0x2a2a2a}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
    >
      <Text text="Layout System Demo" color={'yellow'} margin={{ bottom: 10 }} height={20} />
      <Text text="Automatic vertical stacking:" margin={{ bottom: 15 }} height={20} />
      <Counter step={1} label="Counter A" />
      <Counter step={5} label="Counter B" />
      <Counter step={10} label="Counter C" />
      <View
        margin={{ top: 20 }}
        width={300}
        height={100}
        backgroundColor={0x444444}
        padding={{ left: 15, top: 15 }}
      >
        <Text text="Nested container" color={'cyan'} height={20} margin={{ bottom: 5 }} />
        <Text text="With padding and margins" height={20} />
      </View>
    </View>
  )
}

/**
 * Main app component with example selector
 * @returns App component JSX
 */
export function App() {
  return <LayoutExample />
}
