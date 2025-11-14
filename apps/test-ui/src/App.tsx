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
    <View
      margin={{ top: 10, bottom: 20 }}
      backgroundColor={0x008800}
      padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
    >
      <Text text={`${props.label ?? 'Count'}: ${n}`} />
      <View
        backgroundColor={0x880000}
        onPointerDown={() => {
          setN((v) => v + step)
        }}
      >
        <Text
          text={`Add +${step}`}
          style={{ fontSize: 20 }}
          margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
        />
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
      backgroundColor={0x2a2a2a}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
    >
      <Text text="Layout System Demo" color={'yellow'} />
      <Text text="Automatic vertical stacking:" />
      <Counter step={1} label="Counter A" />
      <Counter step={5} label="Counter B" />
      <Counter step={10} label="Counter C" />
      <View
        margin={{ top: 20, left: 20 }}
        backgroundColor={0x444444}
        padding={{ left: 15, top: 15 }}
      >
        <Text
          style={{ fontSize: 30 }}
          text="Nested container"
          color={'cyan'}
          // margin={{ bottom: 10 }}
        />
        <Text style={{ fontSize: 10 }} text="With padding and margins" />
        <Text style={{ fontSize: 30 }} text="FAT at least" />
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
