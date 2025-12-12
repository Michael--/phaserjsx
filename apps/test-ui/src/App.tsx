/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import {
  Divider,
  getAvailablePresets,
  Modal,
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
  WrapText,
  type MountProps,
  type RadioGroupOption,
} from '@number10/phaserjsx'
import { DebugSide, type DebugPresetKey } from './DemoSide'
import { ExampleContainer, ExampleSide, type ExampleKey } from './ExampleSide'
import { createAppTheme } from './Theme'
import { Button, Sidebar } from './components'
import { registerCustomEffects } from './custom-effects'
import './custom-effects/types' // Enable custom effect types
import { ViewLevel2 } from './examples/Helper'

// Initialize preset and mode in one go
setColorPreset('forestGreen', 'dark')

// Activate desired debug preset by default:
// import { DevPresets } from '@number10/phaserjsx'
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

const testMe = false

export function QuickStartExample() {
  const [show, setShow] = useState(false)
  console.log('QuickStartExample render, show=', show)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Modal Component" style={{ fontSize: '18px', fontStyle: 'bold' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setShow(!show)}
        >
          <Text text="Open Modal" style={{ fontSize: '16px', color: '#fff' }} />
        </View>

        <Text
          text="Click to open a modal with backdrop and animations"
          style={{ fontSize: '14px', color: '#666' }}
        />
      </View>

      <Modal show={show} onClosed={() => setShow(false)}>
        <View
          width={400}
          height={250}
          backgroundColor={0xffffff}
          cornerRadius={16}
          padding={24}
          direction="column"
          gap={16}
        >
          <Text text="Modal Title" style={{ fontSize: '20px', color: '#111' }} />
          <WrapText
            text="This is a basic modal with a backdrop. Click outside or press Escape to close."
            style={{ fontSize: '14px', color: '#666' }}
          />
          <View flex={1} />

          <Button onClick={() => setShow(false)}>
            <Text text="Close" style={{ fontSize: '14px', color: '#fff' }} />
          </Button>
        </View>
      </Modal>
    </View>
  )
}

export function App(props: MountProps) {
  if (testMe) {
    return <QuickStartExample />
  }

  const [selectedDemo, setSelectedDemo] = useState<ExampleKey>('slider')
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
