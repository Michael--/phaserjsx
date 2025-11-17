/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import { Text, View, useState } from '@phaserjsx/ui'
import { DebugSide, type DebugPresetKey } from './DemoSide'
import { DemoContainer, ExampleSide, type ExampleKey } from './ExampleSide'
import { Sidebar } from './components'
import { Spacer } from './components/Spacer'

/**
 * Props for the root App component
 */
export interface AppProps {
  /** Screen width in pixels */
  width: number
  /** Screen height in pixels */
  height: number
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
      <Text text={props.text} style={{ fontSize: 16, color: 'white' }} />
    </View>
  )
}

/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
export function App(props: AppProps) {
  const width = props.width
  const height = props.height

  const [selectedDemo, setSelectedDemo] = useState<ExampleKey>('nineslice')
  const [selectedExample, setSelectedExample] = useState<DebugPresetKey>('production')

  return (
    <View
      width={width}
      height={height}
      backgroundColor={0x123456}
      direction="row"
      justifyContent="start"
    >
      <Sidebar height={'100%'} backgroundColor={0x2e1e1e} padding={15} gap={12}>
        <ExampleSide selectedExample={selectedDemo} onChange={setSelectedDemo} />
        <Spacer />
        <DebugSide selectedDebug={selectedExample} onChange={setSelectedExample} />
      </Sidebar>

      <View
        height={'100%'}
        flex={1}
        padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
        justifyContent="space-between"
        backgroundColor={0x764522}
      >
        <DemoContainer selectedDemo={selectedDemo} />

        <View direction="row" justifyContent="space-between" key="footer" width={'fill'}>
          <Text text={`Demo: ${selectedDemo}`} style={{ fontSize: 14, color: 'white' }} />
          <Spacer />
          <Text text={`Screen: ${width} x ${height}`} style={{ fontSize: 14, color: 'white' }} />
        </View>
      </View>
    </View>
  )
}
