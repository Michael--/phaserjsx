/**
 * Theme Preview - comprehensive visualization of all theme values
 * Shows colors, typography, spacing, shadows, and component examples
 */
import type { ColorShade } from '@phaserjsx/ui'
import { Text, useState, useThemeTokens, View } from '@phaserjsx/ui'
import { ScrollSlider } from '../components'
import { Button } from '../components/Button'
import { ScrollView } from '../components/ScrollView'
import { ViewLevel1, ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Section header component
 */
function SectionHeader({ title }: { title: string }) {
  const tokens = useThemeTokens()

  if (!tokens) return null

  return <Text text={title} style={tokens.textStyles.title} />
}

/**
 * Display a single color shade with hex value
 */
function ColorBox({ color, shade }: { color: string; shade: string }) {
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
    <View
      width={120}
      height={80}
      backgroundColor={parseInt(color.replace('#', ''), 16)}
      borderColor={tokens.colors.border.medium.toNumber()}
      borderWidth={1}
      cornerRadius={tokens.radius.sm}
      padding={tokens.spacing.sm}
      direction="column"
      justifyContent="space-between"
    >
      <Text
        text={shade}
        style={{
          ...tokens.textStyles.small,
          color: shade === 'lightest' || shade === 'light' ? '#000000' : '#ffffff',
        }}
      />
      <Text
        text={color}
        style={{
          ...tokens.textStyles.caption,
          color: shade === 'lightest' || shade === 'light' ? '#333333' : '#eeeeee',
        }}
      />
    </View>
  )
}

/**
 * Display all shades of a color category
 */
function ColorCategory({ name, shades }: { name: string; shades: ColorShade }) {
  const tokens = useThemeTokens()

  if (!tokens) return null

  const shadeOrder: Array<'lightest' | 'light' | 'medium' | 'dark' | 'darkest'> = [
    'lightest',
    'light',
    'medium',
    'dark',
    'darkest',
  ]

  return (
    <ViewLevel3 cornerRadius={tokens.radius.md} direction="row" alignItems="center">
      <View
        gap={tokens.spacing.sm}
        width={250}
        direction="column"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Text text={name} style={tokens.textStyles.large} />
        <Text
          text="(DEFAULT → medium)"
          style={{ ...tokens.textStyles.small, color: tokens.colors.text.light.toString() }}
        />
      </View>
      <View gap={8} direction="row">
        {shadeOrder.map((shade) => (
          <ColorBox
            color={shades[shade].toString()}
            shade={shade === 'medium' ? 'medium ★' : shade}
          />
        ))}
      </View>
    </ViewLevel3>
  )
}

/**
 * Display all color categories
 */
function ColorSection() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  if (!colors) {
    return <Text text="No colors available" />
  }

  const categories: Array<{ name: string; shades: ColorShade }> = [
    { name: 'Primary', shades: colors.primary },
    { name: 'Secondary', shades: colors.secondary },
    { name: 'Success', shades: colors.success },
    { name: 'Error', shades: colors.error },
    { name: 'Warning', shades: colors.warning },
    { name: 'Info', shades: colors.info },
    { name: 'Background', shades: colors.background },
    { name: 'Surface', shades: colors.surface },
    { name: 'Border', shades: colors.border },
    { name: 'Text', shades: colors.text },
    { name: 'Accent', shades: colors.accent },
  ]

  return (
    <ViewLevel2 gap={16} direction="column" width={1000}>
      <SectionHeader title="Colors" />
      {...categories.map((cat) => <ColorCategory name={cat.name} shades={cat.shades} />)}
    </ViewLevel2>
  )
}

/**
 * Display typography examples
 */
function TypographySection() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']

  return (
    <ViewLevel2 gap={16} direction="column" width={1000} overflow="hidden" margin={{ bottom: 30 }}>
      <SectionHeader title="Typography" />
      <ViewLevel2 cornerRadius={8} padding={16} gap={12} direction="column">
        {...fontSizes.map((size) => (
          <Text
            key={size}
            text={`Font Size ${size} - The quick brown fox jumps over the lazy dog`}
            style={{
              fontSize: size,
              color: colors?.text.DEFAULT.toString() || '#ffffff',
            }}
          />
        ))}
      </ViewLevel2>
    </ViewLevel2>
  )
}

/**
 * Display spacing scale
 */
function SpacingSection() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  const spacings = [
    { name: 'xs', value: 4 },
    { name: 'sm', value: 8 },
    { name: 'md', value: 16 },
    { name: 'lg', value: 24 },
    { name: 'xl', value: 32 },
    { name: '2xl', value: 48 },
  ]

  return (
    <ViewLevel2 gap={16} direction="column" width={1000}>
      <SectionHeader title="Spacing" />
      <ViewLevel2 padding={16} gap={16} direction="row">
        {...spacings.map((spacing) => (
          <View key={spacing.name} gap={8} direction="row" alignItems="center">
            <View width={80}>
              <Text
                text={`${spacing.name} (${spacing.value}px)`}
                style={{
                  fontSize: '14px',
                  color: colors?.text.DEFAULT.toString() || '#ffffff',
                }}
              />
            </View>
            <View
              width={spacing.value}
              height={40}
              backgroundColor={colors?.primary.DEFAULT.toNumber() || 0x2196f3}
              cornerRadius={4}
            />
          </View>
        ))}
      </ViewLevel2>
    </ViewLevel2>
  )
}

/**
 * Display border radius examples
 */
function BorderRadiusSection() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  const radii = [
    { name: 'none', value: 0 },
    { name: 'sm', value: 4 },
    { name: 'md', value: 8 },
    { name: 'lg', value: 12 },
    { name: 'xl', value: 16 },
    { name: 'xxl', value: 32 },
  ]

  return (
    <ViewLevel2 gap={16} direction="column" width={1000}>
      <SectionHeader title="Border Radius" />
      <ViewLevel2 cornerRadius={8} padding={16} gap={16} direction="row">
        {...radii.map((radius) => (
          <View key={radius.name} gap={8} direction="column" alignItems="center">
            <View
              width={80}
              height={80}
              backgroundColor={colors?.primary.DEFAULT.toNumber() || 0x2196f3}
              cornerRadius={radius.value}
            />
            <Text
              text={`${radius.name} (${radius.value}px)`}
              style={{
                fontSize: '12px',
                color: colors?.text.DEFAULT.toString() || '#ffffff',
              }}
            />
          </View>
        ))}
      </ViewLevel2>
    </ViewLevel2>
  )
}

/**
 * Display component showcase with real buttons
 */
function ComponentShowcase() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  if (!colors) {
    return <Text text="No colors available" />
  }

  return (
    <ViewLevel2 gap={16} direction="column" width={1000}>
      <SectionHeader title="Components" />
      <ViewLevel2 padding={16} gap={16} direction="column">
        <View gap={8} direction="column">
          <Text
            text="Buttons"
            style={{
              fontSize: '18px',
              color: colors.text.DEFAULT.toString(),
            }}
          />
          <View gap={8} direction="row">
            <Button variant="primary" onClick={() => {}}>
              <Text text="Primary" style={{ color: '#ffffff' }} />
            </Button>
            <Button variant="secondary" onClick={() => {}}>
              <Text text="Secondary" style={{ color: '#ffffff' }} />
            </Button>
            <View
              width={100}
              height={40}
              backgroundColor={colors.success.DEFAULT.toNumber()}
              cornerRadius={6}
              justifyContent="center"
              alignItems="center"
            >
              <Text text="Success" style={{ color: '#ffffff' }} />
            </View>
            <View
              width={100}
              height={40}
              backgroundColor={colors.error.DEFAULT.toNumber()}
              cornerRadius={6}
              justifyContent="center"
              alignItems="center"
            >
              <Text text="Error" style={{ color: '#ffffff' }} />
            </View>
            <View
              width={100}
              height={40}
              backgroundColor={colors.warning.DEFAULT.toNumber()}
              cornerRadius={6}
              justifyContent="center"
              alignItems="center"
            >
              <Text text="Warning" style={{ color: '#000000' }} />
            </View>
            <View
              width={100}
              height={40}
              backgroundColor={colors.info.DEFAULT.toNumber()}
              cornerRadius={6}
              justifyContent="center"
              alignItems="center"
            >
              <Text text="Info" style={{ color: '#ffffff' }} />
            </View>
          </View>
        </View>

        <View gap={8} direction="column">
          <Text
            text="Alert Boxes"
            style={{
              fontSize: '18px',
              color: colors.text.DEFAULT.toString(),
            }}
          />
          <View gap={8} direction="column">
            <View
              width={760}
              backgroundColor={colors.success.lightest.toNumber()}
              borderColor={colors.success.DEFAULT.toNumber()}
              borderWidth={2}
              cornerRadius={8}
              padding={12}
            >
              <Text
                text="✓ Success: Operation completed successfully"
                style={{ color: colors.success.darkest.toString(), fontSize: '14px' }}
              />
            </View>
            <View
              width={760}
              backgroundColor={colors.error.lightest.toNumber()}
              borderColor={colors.error.DEFAULT.toNumber()}
              borderWidth={2}
              cornerRadius={8}
              padding={12}
            >
              <Text
                text="✗ Error: Something went wrong"
                style={{ color: colors.error.darkest.toString(), fontSize: '14px' }}
              />
            </View>
            <View
              width={760}
              backgroundColor={colors.warning.lightest.toNumber()}
              borderColor={colors.warning.DEFAULT.toNumber()}
              borderWidth={2}
              cornerRadius={8}
              padding={12}
            >
              <Text
                text="⚠ Warning: Please check your input"
                style={{ color: colors.warning.darkest.toString(), fontSize: '14px' }}
              />
            </View>
            <View
              width={760}
              backgroundColor={colors.info.lightest.toNumber()}
              borderColor={colors.info.DEFAULT.toNumber()}
              borderWidth={2}
              cornerRadius={8}
              padding={12}
            >
              <Text
                text="ℹ Info: Here's some helpful information"
                style={{ color: colors.info.darkest.toString(), fontSize: '14px' }}
              />
            </View>
          </View>
        </View>
      </ViewLevel2>
    </ViewLevel2>
  )
}

/**
 * Main theme preview component
 * TODO: worse idea to fiddle out size of content - find better way
 * TODO: may missing property fit-content for width/height on View
 */
export function ThemePreviewExample() {
  const [scroll, setScroll] = useState({
    dx: 0,
    dy: 0,
    scrollX: 0,
    scrollY: 0,
    width: 0,
    height: 0,
  })

  const handleScroll = (x: number, y: number, vw: number, vh: number, cw: number, ch: number) => {
    // Calculate absolute scroll positions from percentages
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (y / 100) * maxScrollY

    const maxScrollX = Math.max(0, cw - vw)
    const dx = (x / 100) * maxScrollX

    setScroll({
      dx,
      dy,
      scrollX: x,
      scrollY: y,
      width: (vw / cw) * 100,
      height: (vh / ch) * 100,
    })
  }

  const handleVScroll = (percent: number) => {
    const vh = scroll.height > 0 ? 100 / (scroll.height / 100) : 100
    const ch = vh / (scroll.height / 100)
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (percent / 100) * maxScrollY
    setScroll({ ...scroll, dy, scrollY: percent })
  }

  return (
    <View direction="stack" width="100vw" height="100vh">
      <ViewLevel1 width="100%" direction="row" gap={0}>
        <ScrollView scroll={scroll} onScroll={handleScroll}>
          <View gap={32}>
            <ColorSection />
            <ComponentShowcase />
            <SpacingSection />
            <BorderRadiusSection />
            <TypographySection />
          </View>
        </ScrollView>
      </ViewLevel1>
      <View
        width="100%"
        direction="row"
        gap={0}
        justifyContent="end"
        padding={{ right: 1 }}
        height="100vh"
      >
        <ScrollSlider
          direction="vertical"
          trackSize={800}
          scrollInfo={scroll}
          onScroll={handleVScroll}
        />
      </View>
    </View>
  )
}
