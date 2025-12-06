/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import {
  Divider,
  getAvailablePresets,
  RadioGroup,
  ScrollView,
  setColorPreset,
  Text,
  themeRegistry,
  useColorMode,
  useEffect,
  useState,
  useThemeTokens,
  View,
  type MountProps,
  type RadioGroupOption,
} from '@phaserjsx/ui'
import { DebugSide, type DebugPresetKey } from './DemoSide'
import { ExampleContainer, ExampleSide, type ExampleKey } from './ExampleSide'
import { createAppTheme, globalTheme } from './Theme'
import { Button, Sidebar } from './components'
import { registerCustomEffects } from './custom-effects'
import './custom-effects/types' // Enable custom effect types
import { ViewLevel2 } from './examples/Helper'

// Set global theme ONCE (safe in function body for SPA)
themeRegistry.updateGlobalTheme(globalTheme)

// Initialize preset
setColorPreset('oceanBlue')

// Activate desired debug preset by default:
// import { DevPresets } from '@phaserjsx/ui'
// DevPresets.debugVDOM()

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
    return (
      <Button key={p} size="small" variant="secondary" text={p} onClick={() => setColorPreset(p)} />
    )
  })

  return (
    <View direction="row" gap={10}>
      {btn}
    </View>
  )
}

function PresetUpdater() {
  const { colorMode } = useColorMode()
  const [currentPreset, setCurrentPreset] = useState(
    themeRegistry.getCurrentPresetName() || 'oceanBlue'
  )

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
  }, [colorMode, currentPreset])

  // Register custom effects once
  useEffect(() => {
    // Register custom effects once
    registerCustomEffects()
  }, [])

  return <View />
}

/**
 * JSX Static Debug Box - Captures and outputs VDOM snapshots
 */
function JsxStaticBox(props: { keys: string[] }) {
  const run = async () => {
    // Dynamically import debug utilities (not bundled in production)
    const { captureSnapshot, outputToConsole } = await import('./debug/snapshot')
    const { getRootVNodeFromGame } = await import('./debug/root-registry')

    // Get root VNode from current game instance
    const game = (window as { game?: Phaser.Game }).game
    if (!game) {
      console.warn('No Phaser game instance found')
      return
    }

    const rootVNode = getRootVNodeFromGame(game)
    if (!rootVNode) {
      console.warn('No root VNode found in scene')
      return
    }

    // For function components, the actual rendered VNode is in __ctx.vnode
    // The root VNode is just the component wrapper
    const actualVNode = rootVNode.__ctx?.vnode || rootVNode

    // Capture snapshot with key filtering
    // Use empty array or ['*'] to show all nodes
    const keyPatterns = props.keys.length === 0 ? ['*'] : props.keys
    console.log('🔍 Capturing snapshot with key patterns:', keyPatterns)
    const snapshot = captureSnapshot([actualVNode], keyPatterns)
    outputToConsole(snapshot)
  }

  return <Button size="small" variant="outline" text="JSX Static" onClick={run} />
}

const visibilityDebug = false

/**
 * Test component for VDOM behavior with visibility and conditional rendering
 * Tests:
 * 1. visible="none" vs conditional rendering behavior
 * 2. Parent layout recalculation when child visibility changes
 * 3. VDOM cleanup verification
 */
export function VisibilityExample() {
  const [test, setTest] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTest((t) => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const isOdd = test % 2 === 1

  return (
    <View padding={20} gap={20}>
      <Text text={`Test cycle: ${test} (${isOdd ? 'ODD' : 'EVEN'})`} />
      <View gap={20} direction="row">
        {/* Test 1: visible=false - Child should toggle visibility, but stay took place */}
        <View borderColor={0xff0000} padding={10} gap={10} direction="column">
          <Text text={`Test 1: visible=${isOdd}`} style={{ fontSize: '12px' }} />
          <Text
            text={`Parent should unchanged: ${isOdd ? 'VISIBLE' : 'HIDDEN'}`}
            style={{ fontSize: '10px', color: '#888888' }}
          />
          <View width={100} height={20} backgroundColor={0xff00ff} visible={isOdd} />
        </View>

        {/* Test 2: visible="none" - Child should toggle visibility, parent should re-layout */}
        <View borderColor={0xff0000} padding={10} gap={10} direction="column">
          <Text
            text={`Test 1: visible=${isOdd ? 'true' : "'none'"}`}
            style={{ fontSize: '12px' }}
          />
          <Text
            text={`Parent should shrink/grow: ${isOdd ? 'VISIBLE' : 'HIDDEN'}`}
            style={{ fontSize: '10px', color: '#888888' }}
          />
          <View
            width={100}
            height={20}
            backgroundColor={0x00ffff}
            visible={isOdd ? true : 'none'}
          />
        </View>

        {/* Test 3: Conditional rendering - Child should be added/removed from VDOM */}
        <View borderColor={0x00ff00} padding={10} gap={10} direction="column">
          <Text
            text={`Test 2: Conditional {${isOdd ? 'true' : 'false'} && <View>}`}
            style={{ fontSize: '12px' }}
          />
          {isOdd && <View width={100} height={20} backgroundColor={0xffff00} />}
          <Text
            text={`VDOM should add/remove: ${isOdd ? 'MOUNTED' : 'UNMOUNTED'}`}
            style={{ fontSize: '10px', color: '#888888' }}
          />
        </View>
      </View>
    </View>
  )
}

export function App(props: MountProps) {
  if (visibilityDebug) {
    return <VisibilityExample />
  }

  const [selectedDemo, setSelectedDemo] = useState<ExampleKey>('fx')
  const [selectedExample, setSelectedExample] = useState<DebugPresetKey>('production')
  const token = useThemeTokens()

  return (
    <View direction="row" justifyContent="start" height={'100%'} width={'100%'}>
      <PresetUpdater />
      <Sidebar height={'100%'} width={400}>
        <View direction="row" gap={10}>
          <LightDarkModeToggle />
          <JsxStaticBox keys={['*']} />
        </View>
        <PresetSelector />
        <View flex={1} width={'fill'}>
          <ScrollView
            flex={1}
            width={'fill'}
            showVerticalSlider={'auto'}
            showHorizontalSlider={false}
            sliderSize={'tiny'}
          >
            <ExampleSide selectedExample={selectedDemo} onChange={setSelectedDemo} />
          </ScrollView>
        </View>
        <DebugSide selectedDebug={selectedExample} onChange={setSelectedExample} />
      </Sidebar>
      <View
        height={'100%'}
        padding={0}
        width={2}
        backgroundColor={token?.colors.border.DEFAULT.toNumber()}
      ></View>

      <View
        height={'100%'}
        flex={1}
        padding={0}
        backgroundColor={token?.colors.background.DEFAULT.toNumber()}
        backgroundAlpha={0.5}
      >
        <View flex={1} width={'100%'}>
          <ExampleContainer selectedExample={selectedDemo} />
        </View>
        <View
          width={'100%'}
          padding={0}
          height={2}
          backgroundColor={token?.colors.border.DEFAULT.toNumber()}
        ></View>
        <View
          height={25}
          direction="row"
          justifyContent="space-between"
          backgroundColor={token?.colors.background.DEFAULT.toNumber()}
          key="footer"
          width={'fill'}
          padding={{ left: 12, right: 12, top: 5, bottom: 5 }}
        >
          <Text text={`Demo: ${selectedDemo}`} style={token?.textStyles.small} />
          <Text text={`Screen: ${props.width} x ${props.height}`} style={token?.textStyles.small} />
        </View>
      </View>
    </View>
  )
}

const demoMode = {
  Default: { label: 'Default' },
  Separated: { label: 'Separated' },
  Effects: { label: 'Effects' },
  Moving: { label: 'Moving' },
} as const

export type DemoMode = keyof typeof demoMode

export interface SwitcherProps extends MountProps {
  /** Initial demo mode */
  demoMode: DemoMode
  /** Callback when demo mode switched */
  onSwitch?: (mode: DemoMode) => void
}

export function Switcher(props: SwitcherProps) {
  const options: RadioGroupOption[] = Object.entries(demoMode).map(([value, config]) => ({
    value: value as DemoMode,
    label: config.label,
  }))

  return (
    <View direction="stack">
      <View width={'fill'} height={'fill'} justifyContent="center" alignItems="end" padding={10}>
        <ViewLevel2 alignItems="center">
          <Text text="Select" />
          <Divider orientation="horizontal" length={100} />
          <RadioGroup
            options={options}
            value={props.demoMode}
            onChange={(value: string) => {
              const key = value as DemoMode
              props.onSwitch?.(key)
            }}
          />
        </ViewLevel2>
      </View>
    </View>
  )
}
