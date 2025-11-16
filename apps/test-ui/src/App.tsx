/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import { DevPresets, Text, View, useState } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { AdvancedLayoutDemo } from './LayoutDemo'
import { RadioGroup, Sidebar, type RadioGroupOption } from './components'
import { BorderDemo } from './examples/BorderDemo'
import { FlexDemo } from './examples/FlexDemo'
import { LayoutExample } from './examples/LayoutExample'
import { RefExample } from './examples/RefExample'
import { StackDemo } from './examples/StackDemo'
import { ToggleButtonDemo } from './examples/ToggleButtonDemo'

// Enable overflow debugging preset
DevPresets.debugOverflow()

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

export function DemoSide(props: { selectedDemo: string; onChange: (value: string) => void }) {
  const demoOptions: RadioGroupOption[] = [
    { value: 'layout', label: 'Layout System' },
    { value: 'advanced', label: 'Advanced Layouts' },
    { value: 'toggle', label: 'Toggle Buttons' },
    { value: 'stack', label: 'Stack Demo' },
    { value: 'flex', label: 'Flex vs Spacer' },
    { value: 'border', label: 'Border & Corners' },
    { value: 'ref', label: 'Ref Example' },
  ]

  return (
    <>
      <Text text="Demos" color={'cyan'} style={{ fontSize: 18 }} />
      <RadioGroup
        options={demoOptions}
        value={props.selectedDemo}
        onChange={props.onChange}
        gap={8}
        selectedColor={0x4ecdc4}
        unselectedColor={0x555555}
      />
    </>
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

  const [selectedDemo, setSelectedDemo] = useState('border')

  return (
    <View
      width={width}
      height={height}
      backgroundColor={0x123456}
      direction="row"
      justifyContent="start"
    >
      <Sidebar width={200} height={'100%'} backgroundColor={0x2e1e1e} padding={15} gap={12}>
        <DemoSide selectedDemo={selectedDemo} onChange={setSelectedDemo} />
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
          {selectedDemo === 'border' && <BorderDemo key="border" />}
          {selectedDemo === 'ref' && <RefExample key="ref" />}
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
