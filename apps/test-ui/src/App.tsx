/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import { Text, View, useState } from '@phaserjsx/ui'
import { DebugSide, type DebugPresetKey } from './DemoSide'
import { ExampleContainer, ExampleSide, type ExampleKey } from './ExampleSide'
import { Sidebar } from './components'
import { Spacer } from './components/Spacer'

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
import { createTheme, themeRegistry } from '@phaserjsx/ui'

const globalTheme = createTheme({
  // the default Text theme
  Text: {
    style: {
      color: '#ffffff',
      fontSize: '20px',
      fontFamily: 'Arial',
    },
  },
  // the default View theme is transparent
  View: {
    backgroundColor: 0x000000,
    cornerRadius: 0,
    backgroundAlpha: 0,
  },

  // custom component theme for Sidebar
  Sidebar: {
    backgroundColor: 0x2e1e1e,
    backgroundAlpha: 1.0,
    padding: 10,
    gap: 10,
    Text: {
      style: {
        color: '#ffffaa',
        fontSize: '30px',
      },
    },
  },

  RadioGroup: {
    labelColor: 0xffffff,
    selectedColor: 0x4ecdc4,
    unselectedColor: 0x666666,
    gap: 10,
    View: {
      cornerRadius: 8, // rounded radio buttons
    },
  },

  ScrollSlider: {
    borderColor: 0x222222,
    trackColor: 0x444444,
    thumbColor: 0xeeeedd,
    borderWidth: 2,
    minThumbSize: 30,
    size: 30,
  },

  ExampleContainer: {
    View: {
      backgroundColor: 0x2e2e2e,
      backgroundAlpha: 1.0,
      padding: 10,
      gap: 10,
    },
  },
})

// Set global theme ONCE (safe in function body for SPA)
themeRegistry.updateGlobalTheme(globalTheme)

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
