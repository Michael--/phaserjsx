/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import {
  getAvailablePresets,
  setColorPreset,
  Text,
  themeRegistry,
  useColorMode,
  useEffect,
  useState,
  View,
} from '@phaserjsx/ui'
import { DebugSide, type DebugPresetKey } from './DemoSide'
import { ExampleContainer, ExampleSide, type ExampleKey } from './ExampleSide'
import { createAppTheme, globalTheme } from './Theme'
import { Button, Sidebar } from './components'
import { Spacer } from './components/Spacer'

// Set global theme ONCE (safe in function body for SPA)
themeRegistry.updateGlobalTheme(globalTheme)

// Initialize preset
setColorPreset('oceanBlue')

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
 * Color mode toggle button
 */
function LightDarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button size="small" onClick={toggleColorMode}>
      <Text
        text={`${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
        style={{
          fontSize: '16px',
        }}
      />
    </Button>
  )
}

/**
 * Preset selector buttons
 */
function PresetSelector() {
  const pre = getAvailablePresets()
  const btn = pre.map((p) => {
    return <Button size="small" variant="secondary" text={p} onClick={() => setColorPreset(p)} />
  })

  return (
    <View direction="row" gap={10}>
      {...btn}
    </View>
  )
}

function PresetUpdater() {
  const { colorMode } = useColorMode()
  const [currentPreset, setCurrentPreset] = useState(
    themeRegistry.getCurrentPresetName() || 'oceanBlue'
  )
  const [_, setForceUpdate] = useState(0)

  // Subscribe to preset changes
  useEffect(() => {
    const unsubscribe = themeRegistry.subscribe(() => {
      const newPreset = themeRegistry.getCurrentPresetName()
      if (newPreset && newPreset !== currentPreset) {
        setCurrentPreset(newPreset)
      }
    })
    return unsubscribe
  }, [currentPreset])

  // Reload theme when color mode or preset changes
  useEffect(() => {
    console.log('App: updating theme for', currentPreset, 'in', colorMode, 'mode')
    const newTheme = createAppTheme(
      currentPreset as 'oceanBlue' | 'forestGreen' | 'midnight',
      colorMode
    )
    themeRegistry.updateGlobalTheme(newTheme)
    // Force re-render to apply new theme
    setForceUpdate((c) => c + 1)
  }, [colorMode, currentPreset])

  return <View />
}

/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
export function App(props: AppProps) {
  const width = props.width
  const height = props.height

  const [selectedDemo, setSelectedDemo] = useState<ExampleKey>('colorMode')
  const [selectedExample, setSelectedExample] = useState<DebugPresetKey>('production')

  return (
    <View width={width} height={height} direction="row" justifyContent="start">
      <PresetUpdater />
      <Sidebar height={'100%'}>
        <LightDarkModeToggle />
        <PresetSelector />
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
