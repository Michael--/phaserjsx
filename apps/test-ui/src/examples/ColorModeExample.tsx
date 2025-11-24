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
    <Button
      size="small"
      onClick={toggleColorMode}
      text={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
    />
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
      <Button
        size="small"
        text="Ocean Blue"
        onClick={() => setColorPreset('oceanBlue')}
        variant="primary"
      />
      <Button
        size="small"
        text="Forest Green"
        onClick={() => setColorPreset('forestGreen')}
        variant="secondary"
      />
      <Button
        size="small"
        text="Midnight"
        onClick={() => setColorPreset('midnight')}
        variant="outline"
      />
    </View>
  )
}

/**
 * Color palette display - shows all semantic colors with their shades
 */
function ColorPalette() {
  const tokens = useThemeTokens()

  if (!tokens) return null
  const colors = tokens.colors

  const semanticColors = [
    { name: 'Primary', key: 'primary' as const },
    { name: 'Secondary', key: 'secondary' as const },
    { name: 'Accent', key: 'accent' as const },
    { name: 'Success', key: 'success' as const },
    { name: 'Warning', key: 'warning' as const },
    { name: 'Error', key: 'error' as const },
    { name: 'Info', key: 'info' as const },
    { name: 'Background', key: 'background' as const },
    { name: 'Surface', key: 'surface' as const },
    { name: 'Text', key: 'text' as const },
    { name: 'Border', key: 'border' as const },
  ]

  const shades = ['lightest', 'light', 'medium', 'dark', 'darkest'] as const

  const colorMap = semanticColors.map(({ name, key }) => {
    const shadeViews = shades.map((shade) => (
      <View key={shade} direction="column" gap={2} alignItems="center">
        <View
          width={20}
          height={20}
          backgroundColor={colors[key][shade].toNumber()}
          cornerRadius={2}
          borderWidth={1}
          borderColor={colors.border.DEFAULT.toNumber()}
        />
        <Text text={shade} style={tokens.textStyles.caption} />
        <Text text={colors[key][shade].toString()} style={tokens.textStyles.caption} />
      </View>
    ))

    return (
      <View key={key} direction="column" gap={5}>
        <Text text={name} style={tokens.textStyles.medium} />
        <View direction="row" gap={5}>
          {...shadeViews}
        </View>
      </View>
    )
  })

  return (
    <View direction="column" gap={10}>
      <Text text="Complete Color Palette" style={tokens.textStyles.large} />
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
        <ViewLevel2>
          <Text text={`Current Mode: ${colorMode}`} style={tokens.textStyles.large} />
          <ModeToggle />
          <PresetSelector />
        </ViewLevel2>
        <ViewLevel2>
          <ColorPalette />
        </ViewLevel2>
      </ViewLevel2>
    </ViewLevel1>
  )
}
