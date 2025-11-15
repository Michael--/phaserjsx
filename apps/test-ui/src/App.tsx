/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import { Text, View, useState } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { AdvancedLayoutDemo } from './LayoutDemo'
import { RadioGroup, Sidebar, type RadioGroupOption } from './components'

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

function BasicFlexDemo() {
  return (
    <View direction="row" gap={10} height={80} backgroundColor={0x005588} width={400}>
      <View
        width={100}
        backgroundColor={0xcc3333}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        alignItems="center"
        justifyContent="center"
      >
        <Text text="Fixed" color={'white'} style={{ fontSize: 14 }} />
        <Text text="150px" color={'white'} style={{ fontSize: 12 }} />
      </View>
      <View
        flex={1}
        backgroundColor={0x33cc33}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        alignItems="center"
        justifyContent="center"
      >
        <Text text="flex={1}" color={'white'} style={{ fontSize: 14 }} />
        <Text text="fills remaining" color={'white'} style={{ fontSize: 12 }} />
      </View>
    </View>
  )
}

/**
 * Flex vs Spacer Demo
 * Shows two different approaches to fill remaining space
 * @returns Flex demo JSX
 */
export function FlexDemo() {
  return (
    <View
      backgroundColor={0x2a2a2a}
      padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
      gap={25}
    >
      <Text text="Flex Layout Examples" color={'yellow'} style={{ fontSize: 20 }} />

      {/* Example 1: Basic flex */}
      <View gap={8}>
        <Text text="1. Basic Flex - Fixed + Flexible" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="row" gap={10} height={80} backgroundColor={0x005588} width={400}>
          <View
            width={100}
            backgroundColor={0xcc3333}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Fixed" color={'white'} style={{ fontSize: 14 }} />
            <Text text="150px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View
            flex={1}
            backgroundColor={0x33cc33}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="fills remaining" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 2: Spacer pattern */}
      <View gap={8}>
        <Text text="2. Spacer Pattern - Push to edges" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="row" gap={10} height={80}>
          <View
            width={120}
            backgroundColor={0xcc3333}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Left" color={'white'} style={{ fontSize: 14 }} />
            <Text text="120px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View flex={1} backgroundColor={0x444444} alignItems="center" justifyContent="center">
            <Text text="Spacer" color={'gray'} style={{ fontSize: 12 }} />
            <Text text="flex={1}" color={'gray'} style={{ fontSize: 10 }} />
          </View>
          <View
            width={120}
            backgroundColor={0x3333cc}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Right" color={'white'} style={{ fontSize: 14 }} />
            <Text text="120px" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 3: Proportional flex */}
      <View gap={8}>
        <Text text="3. Proportional Flex Ratios - 1:2:3" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="row" gap={10} height={80}>
          <View
            flex={1}
            backgroundColor={0xcc6633}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="1 part" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View
            flex={2}
            backgroundColor={0xcccc33}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={2}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="2 parts (2x wider)" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View
            flex={3}
            backgroundColor={0x33cccc}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={3}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="3 parts (3x wider)" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 4: Mixed fixed + flex */}
      <View gap={8}>
        <Text
          text="4. Mixed Layout - Multiple Fixed + Flex"
          color={'cyan'}
          style={{ fontSize: 16 }}
        />
        <View direction="row" gap={10} height={80}>
          <View width={80} backgroundColor={0xcc3333} alignItems="center" justifyContent="center">
            <Text text="80px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View flex={1} backgroundColor={0x33cc33} alignItems="center" justifyContent="center">
            <Text text="flex={1}" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View width={100} backgroundColor={0x3333cc} alignItems="center" justifyContent="center">
            <Text text="100px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View flex={2} backgroundColor={0xcc33cc} alignItems="center" justifyContent="center">
            <Text text="flex={2}" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View width={80} backgroundColor={0x33cccc} alignItems="center" justifyContent="center">
            <Text text="80px" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 5: Column layout */}
      <View gap={8}>
        <Text
          text="5. Column Layout with Flex (Vertical)"
          color={'cyan'}
          style={{ fontSize: 16 }}
        />
        <View direction="column" gap={10} height={250}>
          <View
            flex={1}
            backgroundColor={0xcc3333}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1} - Header" color={'white'} style={{ fontSize: 14 }} />
          </View>
          <View
            flex={3}
            backgroundColor={0x33cc33}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              text="flex={3} - Main Content (3x taller)"
              color={'white'}
              style={{ fontSize: 14 }}
            />
          </View>
          <View
            flex={1}
            backgroundColor={0x3333cc}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1} - Footer" color={'white'} style={{ fontSize: 14 }} />
          </View>
        </View>
      </View>

      {/* Example 6: Nested flex */}
      <View gap={8}>
        <Text text="6. Nested Flex Layouts" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="column" gap={10} height={200}>
          <View direction="row" gap={10} flex={1}>
            <View flex={1} backgroundColor={0xcc3333} alignItems="center" justifyContent="center">
              <Text text="Top Left" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={1}" color={'white'} style={{ fontSize: 10 }} />
            </View>
            <View flex={2} backgroundColor={0xcc6633} alignItems="center" justifyContent="center">
              <Text text="Top Center" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={2}" color={'white'} style={{ fontSize: 10 }} />
            </View>
            <View flex={1} backgroundColor={0xcccc33} alignItems="center" justifyContent="center">
              <Text text="Top Right" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={1}" color={'white'} style={{ fontSize: 10 }} />
            </View>
          </View>
          <View direction="row" gap={10} flex={2}>
            <View flex={2} backgroundColor={0x33cc33} alignItems="center" justifyContent="center">
              <Text text="Bottom Left" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={2}" color={'white'} style={{ fontSize: 10 }} />
            </View>
            <View flex={1} backgroundColor={0x3333cc} alignItems="center" justifyContent="center">
              <Text text="Bottom Right" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={1}" color={'white'} style={{ fontSize: 10 }} />
            </View>
          </View>
        </View>
      </View>

      <View
        backgroundColor={0x333333}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        gap={5}
      >
        <Text text="💡 Key Concepts:" color={'yellow'} style={{ fontSize: 14 }} />
        <Text
          text="• flex={1} takes available space equally"
          color={'white'}
          style={{ fontSize: 12 }}
        />
        <Text
          text="• flex={2} takes 2x space of flex={1}"
          color={'white'}
          style={{ fontSize: 12 }}
        />
        <Text
          text="• Fixed sizes are respected, flex fills the rest"
          color={'white'}
          style={{ fontSize: 12 }}
        />
        <Text
          text="• Works in both row and column directions"
          color={'white'}
          style={{ fontSize: 12 }}
        />
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

  const demoOptions: RadioGroupOption[] = [
    { value: 'layout', label: 'Layout System' },
    { value: 'advanced', label: 'Advanced Layouts' },
    { value: 'toggle', label: 'Toggle Buttons' },
    { value: 'stack', label: 'Stack Demo' },
    { value: 'flex', label: 'Flex vs Spacer' },
  ]

  const [selectedDemo, setSelectedDemo] = useState('layout')

  return (
    <View
      width={width}
      height={height}
      backgroundColor={0x123456}
      direction="row"
      justifyContent="start"
    >
      <Sidebar width={200} height={'100%'} backgroundColor={0x2e1e1e} padding={15} gap={12}>
        <Text text="Demos" color={'cyan'} style={{ fontSize: 18 }} />
        <RadioGroup
          options={demoOptions}
          value={selectedDemo}
          onChange={(value) => setSelectedDemo(value)}
          gap={8}
          selectedColor={0x4ecdc4}
          unselectedColor={0x555555}
        />
      </Sidebar>

      <View
        height={'100%'}
        flex={1}
        padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
        justifyContent="space-between"
        backgroundColor={0x764522}
      >
        <View key="demo-container">
          {selectedDemo === 'layout' && <LayoutExample key="layout" />}
          {selectedDemo === 'advanced' && <AdvancedLayoutDemo key="advanced" />}
          {selectedDemo === 'toggle' && <ToggleButtonDemo key="toggle" />}
          {selectedDemo === 'stack' && <StackDemo key="stack" />}
          {selectedDemo === 'flex' && <FlexDemo key="flex" />}
        </View>

        <View
          direction="row"
          justifyContent="space-between"
          key="footer"
          backgroundColor={0x883388}
        >
          <View></View>

          <Text
            text={`Screen: ${width} x ${height} | Demo: ${selectedDemo}`}
            color={'white'}
            style={{ fontSize: 14 }}
          />
        </View>
      </View>
    </View>
  )
}
