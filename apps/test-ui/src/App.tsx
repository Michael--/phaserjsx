/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import { Text, View, useState } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { AdvancedLayoutDemo } from './LayoutDemo'

/**
 * Props for the root App component
 */
export interface AppProps {
  /** Screen width in pixels */
  width?: number
  /** Screen height in pixels */
  height?: number
  /** Phaser scene instance for advanced usage */
  scene?: Phaser.Scene
}

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
      margin={{ top: 10, bottom: 10 }}
      backgroundColor={0x008800}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      direction="row"
      gap={20}
      alignItems="center"
    >
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
      <View backgroundColor={0x444444}>
        <Text text={`${props.label ?? 'Count'}: ${n}`} />
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
      x={20}
      y={20}
      backgroundColor={0x2a2a2a}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
      gap={10}
      justifyContent="start"
    >
      <Text text="Layout System Demo (gap: 10)" color={'yellow'} />
      <Text text="Automatic vertical stacking:" />
      <Counter step={1} label="Counter A" />
      <Counter step={5} label="Counter B" />
      <Counter step={10} label="Counter C" />
      <View
        margin={{ top: 20 }}
        backgroundColor={0x444444}
        padding={{ left: 15, top: 15, right: 15, bottom: 15 }}
        direction="row"
        gap={15}
        alignItems="center"
      >
        <Text style={{ fontSize: 20 }} text="Row" color={'cyan'} />
        <Text style={{ fontSize: 30 }} text="Layout" color={'lime'} />
        <Text style={{ fontSize: 15 }} text="Demo" color={'orange'} />
      </View>
    </View>
  )
}

/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
export function App(props: AppProps) {
  const width = props.width ?? 800
  const height = props.height ?? 600

  return (
    <View
      width={width}
      height={height}
      backgroundColor={0x123456}
      justifyContent="space-between"
      alignItems="center"
    >
      <View direction="row" alignItems="center" gap={10}>
        <LayoutExample />
        <AdvancedLayoutDemo />
      </View>
      <View direction="row" justifyContent="end" width={width}>
        <Text
          text={`Screen: ${width} x ${height}`}
          color={'white'}
          style={{ fontSize: 14 }}
          x={10}
          y={10}
        />
      </View>
    </View>
  )
}
