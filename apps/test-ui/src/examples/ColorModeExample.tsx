/**
 * Color Mode Example - demonstrates dynamic theme switching
 */
import { setColorPreset, Text, useColorMode, useThemeTokens, View } from '@phaserjsx/ui'
import { Button } from '../components/Button'
import { ViewLevel1, ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Component demonstrating useThemeTokens hook
 */
function ColoredBox() {
  const tokens = useThemeTokens()

  if (!tokens) {
    return <Text text="No tokens available" />
  }

  return (
    <ViewLevel3
      width={300}
      height={150}
      backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
      borderColor={tokens.colors.primary.dark.toNumber()}
      borderWidth={2}
      cornerRadius={tokens.radius.md}
      alignItems="center"
      justifyContent="center"
    >
      <Text text="Primary Color Box" style={tokens.textStyles.large} />
      <Text
        text={`Background: ${tokens.colors.primary.DEFAULT.toString()}`}
        style={{
          ...tokens.textStyles.small,
          color: tokens.colors.primary.lightest.toString(),
        }}
      />
    </ViewLevel3>
  )
}

/**
 * Color mode toggle button
 */
function ModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
    <Button width={200} height={50} onClick={toggleColorMode}>
      <Text
        text={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
        style={tokens.textStyles.medium}
      />
    </Button>
  )
}

/**
 * Preset selector buttons
 */
function PresetSelector() {
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
    <View direction="row" gap={tokens.spacing.sm}>
      <Button width={120} height={50} onClick={() => setColorPreset('oceanBlue')} variant="primary">
        <Text text="Ocean Blue" style={tokens.textStyles.small} />
      </Button>
      <Button
        width={120}
        height={50}
        onClick={() => setColorPreset('forestGreen')}
        variant="secondary"
      >
        <Text text="Forest Green" style={tokens.textStyles.small} />
      </Button>
      <Button width={120} height={50} onClick={() => setColorPreset('midnight')} variant="outline">
        <Text text="Midnight" style={tokens.textStyles.small} />
      </Button>
    </View>
  )
}

/**
 * Color palette display
 */
function ColorPalette() {
  const tokens = useThemeTokens()

  if (!tokens) return null
  const colors = tokens.colors

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

  const colorMap = colorSets.map(({ name, shade }) => {
    return (
      <View key={name} direction="row" gap={5} alignItems="center">
        <View
          width={80}
          height={30}
          backgroundColor={colors[shade].DEFAULT.toNumber()}
          cornerRadius={4}
          borderWidth={1}
          borderColor={colors.border.DEFAULT.toNumber()}
        />
        <Text text={name} style={{ fontSize: '14px' }} />
        <Text
          text={colors[shade].DEFAULT.toString()}
          style={{ fontSize: '12px', fontFamily: 'monospace' }}
        />
      </View>
    )
  })

  return (
    <View direction="column" gap={5}>
      <Text text="Color Palette" style={{ fontSize: '16px' }} />
      {...colorMap}
    </View>
  )
}

/**
 * Full color mode example - demonstrates useThemeTokens with text styles
 */
export function ColorModeExample() {
  const { colorMode } = useColorMode()
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
    <ViewLevel1>
      <ViewLevel2>
        <Text text="Color Mode & Preset Demo" style={tokens.textStyles.title} />

        <Text
          text={`Current Mode: ${colorMode}`}
          style={{
            ...tokens.textStyles.medium,
            color: tokens.colors.text.medium.toString(),
          }}
        />

        <ModeToggle />

        <Text text="Choose Preset:" style={tokens.textStyles.large} />

        <PresetSelector />

        <ColoredBox />

        <ColorPalette />
      </ViewLevel2>
    </ViewLevel1>
  )
}
