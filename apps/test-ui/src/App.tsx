/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import { Text, View, themeRegistry, useState } from '@phaserjsx/ui'
import { DebugSide, type DebugPresetKey } from './DemoSide'
import { ExampleContainer, ExampleSide, type ExampleKey } from './ExampleSide'
import { globalTheme } from './Theme'
import { Sidebar } from './components'
import { Spacer } from './components/Spacer'

// Set global theme ONCE (safe in function body for SPA)
themeRegistry.updateGlobalTheme(globalTheme)

// Activate desired debug preset by default:
// import { DevPresets } from '@phaserjsx/ui'
// DevPresets.debugVDOM()

/**
 * Props for the root App component
 */
export interface AppProps {
  /** Screen width in pixels */
  width: number
  /** Screen height in pixels */
  height: number
}

/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
export function App(props: AppProps) {
  const width = props.width
  const height = props.height

  const [selectedDemo, setSelectedDemo] = useState<ExampleKey>('scroll')
  const [selectedExample, setSelectedExample] = useState<DebugPresetKey>('production')

  return (
    <View width={width} height={height} direction="row" justifyContent="start">
      <Sidebar height={'100%'}>
        <ExampleSide selectedExample={selectedDemo} onChange={setSelectedDemo} />
        <Spacer />
        <DebugSide selectedDebug={selectedExample} onChange={setSelectedExample} />
      </Sidebar>

      <View
        height={'100%'}
        flex={1}
        padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
        justifyContent="space-between"
      >
        <ExampleContainer selectedExample={selectedDemo} />

        <View direction="row" justifyContent="space-between" key="footer" width={'fill'}>
          <Text text={`Demo: ${selectedDemo}`} style={{ fontSize: 14, color: 'white' }} />
          <Spacer />
          <Text text={`Screen: ${width} x ${height}`} style={{ fontSize: 14, color: 'white' }} />
        </View>
      </View>
    </View>
  )
}
