/**
 * Color Mode Example - demonstrates dynamic theme switching
 */
import { setColorPreset, Text, useColorMode, useColors, View } from '@phaserjsx/ui'
import { Button } from '../components/Button'

/**
 * Component demonstrating useColors hook
 */
function ColoredBox() {
  const colors = useColors()

  if (!colors) {
    return <Text text="No colors available" />
  }

  return (
    <View
      width={300}
      height={150}
      backgroundColor={colors.primary.DEFAULT}
      borderColor={colors.primary.dark}
      borderWidth={2}
      cornerRadius={8}
      padding={20}
      gap={10}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        text="Primary Color Box"
        style={{
          color: '#ffffff',
          fontSize: '20px',
        }}
      />
      <Text
        text={`Background: #${colors.primary.DEFAULT.toString(16).padStart(6, '0')}`}
        style={{
          color: `#${colors.primary.lightest.toString(16).padStart(6, '0')}`,
          fontSize: '14px',
        }}
      />
    </View>
  )
}

/**
 * Color mode toggle button
 */
function ModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button width={200} height={50} onClick={toggleColorMode}>
      <Text
        text={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
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
  return (
    <View direction="row" gap={10}>
      <Button width={120} height={50} onClick={() => setColorPreset('oceanBlue')} variant="primary">
        <Text text="Ocean Blue" style={{ fontSize: '14px' }} />
      </Button>
      <Button
        width={120}
        height={50}
        onClick={() => setColorPreset('forestGreen')}
        variant="secondary"
      >
        <Text text="Forest Green" style={{ fontSize: '14px' }} />
      </Button>
      <Button width={120} height={50} onClick={() => setColorPreset('midnight')} variant="outline">
        <Text text="Midnight" style={{ fontSize: '14px' }} />
      </Button>
    </View>
  )
}

/**
 * Color palette display
 */
function ColorPalette() {
  const colors = useColors()

  if (!colors) return null

  const colorSets: Array<{
    name: string
    shade: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  }> = [
    { name: 'Primary', shade: 'primary' },
    { name: 'Secondary', shade: 'secondary' },
    { name: 'Accent', shade: 'accent' },
    { name: 'Success', shade: 'success' },
    { name: 'Warning', shade: 'warning' },
    { name: 'Error', shade: 'error' },
  ]

  return (
    <View direction="column" gap={5}>
      <Text text="Color Palette" style={{ fontSize: '16px' }} />
      {colorSets.map(({ name, shade }) => (
        <View key={name} direction="row" gap={5} alignItems="center">
          <View
            width={80}
            height={30}
            backgroundColor={colors[shade].DEFAULT}
            cornerRadius={4}
            borderWidth={1}
            borderColor={colors.border.DEFAULT}
          />
          <Text text={name} style={{ fontSize: '14px' }} />
          <Text
            text={`#${colors[shade].DEFAULT.toString(16).padStart(6, '0')}`}
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
        </View>
      ))}
    </View>
  )
}

/**
 * Full color mode example
 */
export function ColorModeExample() {
  const { colorMode } = useColorMode()
  const colors = useColors()

  return (
    <View
      width="100%"
      height="100%"
      backgroundColor={colors?.background.DEFAULT ?? 0x1a1a1a}
      padding={20}
      gap={20}
      direction="column"
    >
      <Text
        text="Color Mode & Preset Demo"
        style={{
          fontSize: '24px',
          color: colors ? `#${colors.text.DEFAULT.toString(16).padStart(6, '0')}` : '#ffffff',
        }}
      />

      <Text
        text={`Current Mode: ${colorMode}`}
        style={{
          fontSize: '16px',
          color: colors ? `#${colors.text.medium.toString(16).padStart(6, '0')}` : '#cccccc',
        }}
      />

      <ModeToggle />

      <Text
        text="Choose Preset:"
        style={{
          fontSize: '18px',
          color: colors ? `#${colors.text.DEFAULT.toString(16).padStart(6, '0')}` : '#ffffff',
        }}
      />

      <PresetSelector />

      <ColoredBox />

      <ColorPalette />
    </View>
  )
}
