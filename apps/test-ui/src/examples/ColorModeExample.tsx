/**
 * Color Mode Example - demonstrates dynamic theme switching
 */
import {
  ScrollView,
  setColorPreset,
  Text,
  useColorMode,
  useEffect,
  useRedraw,
  useThemeTokens,
  View,
} from '@phaserjsx/ui'
import { Button } from '../components'
import { ViewLevel2 } from './Helper/ViewLevel'

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
function Example() {
  const { colorMode } = useColorMode()
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
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
  )
}

export function ColorModeExample() {
  const rd = useRedraw()
  useEffect(() => {
    // redraw workaround to ensure correct initial rendering after mount
    // this is done because of wrong hscrollbar size on initial render detected once
    // possible, that this can be fixed in the future in the ScrollView component itself
    rd()
  }, [])
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <Example />
      </ScrollView>
    </View>
  )
}
