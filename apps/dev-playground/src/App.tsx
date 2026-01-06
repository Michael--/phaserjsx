/**
 * Main app component for dev playground
 */
import {
  Button,
  createDefaultTheme,
  type MountProps,
  RadioGroup,
  setColorPreset,
  Text,
  themeRegistry,
  useEffect,
  useForceRedraw,
  useRef,
  useSpring,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'
import { ColorMixerToggleButton } from './ColorMixerToggleButton'
import { ColorSlider } from './ColorSlider'
import type { AppProps } from './types'

// Helper to apply color preset and update global theme
function applyColorPreset(preset: Parameters<typeof setColorPreset>[0], mode?: 'light' | 'dark') {
  const targetMode = mode ?? themeRegistry.getColorMode()
  setColorPreset(preset, mode)
  themeRegistry.setGlobalTheme(createDefaultTheme(preset, targetMode))
}

// Initialize preset and mode in one go
applyColorPreset('forestGreen', 'dark')

function ColorPresetButtons() {
  const currentPreset = themeRegistry.getCurrentPresetName() ?? 'oceanBlue'
  const options = [
    { value: 'oceanBlue', label: 'Ocean Blue' },
    { value: 'midnight', label: 'Midnight' },
    { value: 'forestGreen', label: 'Forest Green' },
  ]
  const tokens = useThemeTokens()

  return (
    <View
      gap={10}
      justifyContent="center"
      alignItems="center"
      backgroundColor={tokens?.colors.background.lightest.toNumber()}
      borderColor={tokens?.colors.border.light.toNumber()}
      padding={10}
    >
      <Text text="Color Preset" />
      <RadioGroup
        direction="row"
        options={options}
        value={currentPreset}
        onChange={(value) =>
          applyColorPreset(value as Parameters<typeof setColorPreset>[0], 'dark')
        }
      />
    </View>
  )
}

const colors = [
  { name: 'White', value: 0xffffff },
  { name: 'Red', value: 0xff0000 },
  { name: 'Green', value: 0x00ff00 },
  { name: 'Blue', value: 0x0000ff },
]

function ColorButtons(props: AppProps) {
  return (
    <View direction="row" gap={10}>
      {colors.map((color) => (
        <Button key={color.name} onClick={() => props.tint$.next(color.value)} variant="outline">
          <Text text={color.name} />
        </Button>
      ))}
    </View>
  )
}

function ColorSidebar(props: AppProps) {
  const ref1 = useRef<Phaser.GameObjects.Container | null>(null)
  const ref2 = useRef<Phaser.GameObjects.Container | null>(null)
  const [position, setPosition] = useSpring(60, 'wobbly')
  const [width, setWidth] = useState(0)

  // Force redraw when signals change (throttled to 20ms ~50fps)
  useForceRedraw(20, position)

  // determine width based on button sizes
  useEffect(() => {
    if (!ref1.current || !ref2.current) return
    setWidth(ref1.current.width - ref2.current.width)
    setPosition(ref1.current.width - ref2.current.width)
  }, [ref1.current, ref2.current])

  const slideInOut = () => {
    const cmp = Math.abs(position.value - width)
    setPosition(cmp > 42 ? width : 0)
  }

  const setColor = (color: number) => {
    props.tint$.next(color)
    slideInOut()
  }

  const tokens = useThemeTokens()

  return (
    <View direction="stack">
      <View ref={ref1} x={position.value}>
        <View direction="row" gap={20}>
          <View ref={ref2} onTouch={slideInOut}>
            <Text text="↔️" style={{ fontSize: 32 }} />
          </View>
          <View
            direction="column"
            gap={10}
            borderColor={tokens?.colors.accent.DEFAULT.toNumber()}
            borderWidth={2}
            padding={4}
            cornerRadius={4}
          >
            {colors.map((color) => (
              <View
                key={color.name}
                width={30}
                height={30}
                backgroundColor={color.value}
                onTouch={() => setColor(color.value)}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

type TestUIProps = AppProps & {
  isColorMixerOpen: boolean
  onColorMixerChange: (isOpen: boolean) => void
}

function TestUI(props: TestUIProps) {
  return (
    <View width={'fill'} flex={1} backgroundColor={0xffffff} backgroundAlpha={0.05}>
      <View width={'fill'} direction="row" justifyContent="space-between" padding={10}>
        <ColorButtons {...props} />
        <ColorPresetButtons />
        <ColorSidebar {...props} />
      </View>
      <View flex={1} />
      <View width={'fill'} direction="row" justifyContent="space-between" padding={10}>
        <ColorSlider
          {...props}
          isColorMixerOpen={props.isColorMixerOpen}
          onColorMixerChange={props.onColorMixerChange}
        />
      </View>
    </View>
  )
}

/**
 * Main App component
 */
export function App(props: AppProps & MountProps) {
  const tokens = useThemeTokens()
  const [isColorMixerOpen, setIsColorMixerOpen] = useState(true)

  return (
    <View width={'fill'} height={'fill'} padding={{ top: 40 }} direction="stack">
      <View gap={20} alignItems="center" justifyContent="start" width="100%" height="100%">
        <Text text={props.title} style={tokens?.textStyles.heading} />
        <Text
          text="Focused development environment for testing new features"
          style={tokens?.textStyles.DEFAULT}
        />
        <Text
          text="Show alternative communication methods between Phaser and PhaserJSX (RxJS instead of props/events)"
          style={tokens?.textStyles.small}
        />
        <TestUI
          {...props}
          isColorMixerOpen={isColorMixerOpen}
          onColorMixerChange={setIsColorMixerOpen}
        />
      </View>
      <View
        width="100%"
        height="100%"
        alignItems="end"
        justifyContent="end"
        padding={{ right: 20, bottom: 20 }}
      >
        <ColorMixerToggleButton isOpen={isColorMixerOpen} onToggle={setIsColorMixerOpen} />
      </View>
    </View>
  )
}
