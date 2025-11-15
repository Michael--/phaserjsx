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

export function Button(props: {
  text: string
  onClick?: () => void
  width?: number
  height?: number
  backgroundColor?: number
}) {
  return (
    <View
      width={props.width}
      height={props.height}
      backgroundColor={props.backgroundColor ?? 0x000088}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      alignItems="center"
      justifyContent="center"
      onPointerDown={() => {
        props.onClick?.()
      }}
    >
      <Text text={props.text} style={{ fontSize: 16 }} color={'white'} />
    </View>
  )
}

export function ToggleButton(props: {
  key?: number | string
  textOn: string
  textOff: string
  colorOn?: number
  colorOff?: number
  initialState?: boolean
  onToggle?: (state: boolean) => void
  width?: number
  height?: number
}) {
  const [toggled, setToggled] = useState(props.initialState ?? false)
  return (
    <View
      key={props.key}
      width={props.width}
      height={props.height}
      backgroundColor={toggled ? (props.colorOn ?? 0x008800) : (props.colorOff ?? 0x880000)}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      alignItems="center"
      justifyContent="center"
      onPointerDown={() => {
        const newState = !toggled
        setToggled(newState)
        props.onToggle?.(newState)
      }}
    >
      <Text
        text={toggled ? props.textOn : props.textOff}
        style={{ fontSize: 16 }}
        color={'white'}
      />
    </View>
  )
}

export function ToggleButtonDemo() {
  const testButton = (key: number) => {
    return (
      <ToggleButton
        key={key}
        textOn="ON"
        textOff="OFF"
        colorOn={0x004400}
        colorOff={0x440000}
        initialState={false}
        onToggle={(state) => {
          console.log('ToggleButton state:', state)
        }}
      />
    )
  }

  return (
    <View
      backgroundColor={0x2a2a2a}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      gap={10}
      alignItems="center"
    >
      <Text text="Toggle Button Demo" color={'yellow'} style={{ fontSize: 16 }} />
      {testButton(1)}
      {testButton(2)}
      {testButton(3)}
    </View>
  )
}

export function StackDemo() {
  return (
    <View
      backgroundColor={0x222222}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      gap={10}
      alignItems="center"
    >
      <Text text="Stack Demo" color={'orange'} style={{ fontSize: 16 }} />
      <View
        direction="stack"
        width={220}
        height={120}
        backgroundColor={0x444444}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      >
        <View width={200} height={100} backgroundColor={0x880000} />
        <View width={150} height={80} backgroundColor={0x008800} />
        <View width={100} height={60} backgroundColor={0x000088} />
      </View>
    </View>
  )
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
        <View direction="column" alignItems="center" gap={10}>
          <ToggleButtonDemo />
          <StackDemo />
        </View>
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
