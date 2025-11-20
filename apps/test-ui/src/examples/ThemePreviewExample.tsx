/**
 * Theme Preview - comprehensive visualization of all theme values
 * Shows colors, typography, spacing, shadows, and component examples
 */
import type { ColorShade } from '@phaserjsx/ui'
import { Text, useColors, View } from '@phaserjsx/ui'
import { Button } from '../components/Button'
import { ScrollView } from '../components/ScrollView'

/**
 * Section header component
 */
function SectionHeader({ title }: { title: string }) {
  const colors = useColors()

  return (
    <Text
      text={title}
      style={{
        fontSize: '28px',
        color: colors?.text.DEFAULT.toString() || '#ffffff',
      }}
    />
  )
}

/**
 * Display a single color shade with hex value
 */
function ColorBox({ color, shade }: { color: string; shade: string }) {
  const colors = useColors()

  return (
    <View
      width={120}
      height={80}
      backgroundColor={parseInt(color.replace('#', ''), 16)}
      borderColor={colors?.border.medium.toNumber() || 0x666666}
      borderWidth={1}
      cornerRadius={4}
      padding={8}
      direction="column"
      justifyContent="space-between"
    >
      <Text
        text={shade}
        style={{
          fontSize: '12px',
          color: shade === 'lightest' || shade === 'light' ? '#000000' : '#ffffff',
        }}
      />
      <Text
        text={color}
        style={{
          fontSize: '10px',
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
  const colors = useColors()

  const shadeOrder: Array<'lightest' | 'light' | 'medium' | 'dark' | 'darkest'> = [
    'lightest',
    'light',
    'medium',
    'dark',
    'darkest',
  ]

  return (
    <View
      width={780}
      backgroundColor={colors?.surface.lightest.toNumber() || 0x1a1a1a}
      cornerRadius={8}
      padding={12}
      gap={8}
      direction="column"
    >
      <View gap={8} direction="row" alignItems="center">
        <Text
          text={name}
          style={{
            fontSize: '18px',
            color: colors?.text.DEFAULT.toString() || '#ffffff',
          }}
        />
        <Text
          text="(DEFAULT → medium)"
          style={{
            fontSize: '12px',
            color: colors?.text.light.toString() || '#999999',
          }}
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
    </View>
  )
}

/**
 * Display all color categories
 */
function ColorSection() {
  const colors = useColors()

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
    <View gap={16} direction="column" width={800}>
      <SectionHeader title="Colors" />
      {...categories.map((cat) => <ColorCategory name={cat.name} shades={cat.shades} />)}
    </View>
  )
}

/**
 * Display typography examples
 */
function TypographySection() {
  const colors = useColors()

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']

  return (
    <View gap={16} direction="column" width={800}>
      <SectionHeader title="Typography" />
      <View
        backgroundColor={colors?.surface.lightest.toNumber() || 0x1a1a1a}
        cornerRadius={8}
        padding={16}
        gap={12}
        direction="column"
      >
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
      </View>
    </View>
  )
}

/**
 * Display spacing scale
 */
function SpacingSection() {
  const colors = useColors()

  const spacings = [
    { name: 'xs', value: 4 },
    { name: 'sm', value: 8 },
    { name: 'md', value: 16 },
    { name: 'lg', value: 24 },
    { name: 'xl', value: 32 },
    { name: '2xl', value: 48 },
  ]

  return (
    <View gap={16} direction="column" width={800}>
      <SectionHeader title="Spacing" />
      <View
        backgroundColor={colors?.surface.lightest.toNumber() || 0x1a1a1a}
        cornerRadius={8}
        padding={16}
        gap={16}
        direction="column"
      >
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
      </View>
    </View>
  )
}

/**
 * Display border radius examples
 */
function BorderRadiusSection() {
  const colors = useColors()

  const radii = [
    { name: 'none', value: 0 },
    { name: 'sm', value: 4 },
    { name: 'md', value: 8 },
    { name: 'lg', value: 12 },
    { name: 'xl', value: 16 },
    { name: 'xxl', value: 32 },
  ]

  return (
    <View gap={16} direction="column" width={800}>
      <SectionHeader title="Border Radius" />
      <View
        backgroundColor={colors?.surface.lightest.toNumber() || 0x1a1a1a}
        cornerRadius={8}
        padding={16}
        gap={16}
        direction="row"
      >
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
      </View>
    </View>
  )
}

/**
 * Display component showcase with real buttons
 */
function ComponentShowcase() {
  const colors = useColors()

  if (!colors) {
    return <Text text="No colors available" />
  }

  return (
    <View gap={16} direction="column" width={800}>
      <SectionHeader title="Components" />
      <View
        backgroundColor={colors.surface.lightest.toNumber()}
        cornerRadius={8}
        padding={16}
        gap={16}
        direction="column"
      >
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
      </View>
    </View>
  )
}

/**
 * Main theme preview component
 */
export function ThemePreviewExample() {
  const colors = useColors()

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <View gap={32} direction="column" padding={20}>
          <View
            gap={16}
            direction="column"
            alignItems="start"
            backgroundColor={colors?.background.DEFAULT.toNumber() || 0x0a0a0a}
            backgroundAlpha={1.0}
          >
            <Text
              text="Theme Preview"
              style={{
                fontSize: '36px',
                color: colors?.text.DEFAULT.toString() || '#ffffff',
              }}
            />
          </View>

          <ColorSection />
          <TypographySection />
          <ComponentShowcase />
          <SpacingSection />
          <BorderRadiusSection />
        </View>
      </ScrollView>
    </View>
  )
}
