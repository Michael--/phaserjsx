/**
 * Demo: Layout system showcase with automatic positioning, margins, and padding
 */
import {
  getAvailablePresets,
  setColorPreset,
  Text,
  useColorMode,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import { Button } from './components'

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

export function ThemeCheck() {
  // Subscribe to theme changes to re-render entire tree
  //useThemeSubscription()

  const token = useThemeTokens()

  return (
    <View
      justifyContent="start"
      height={'100%'}
      width={'100%'}
      backgroundColor={0xff0000}
      backgroundAlpha={0.2}
      padding={20}
    >
      <View backgroundColor={token?.colors.surface.light.toNumber()} padding={20} gap={10}>
        <LightDarkModeToggle />
        <PresetSelector />
      </View>
    </View>
  )
}
