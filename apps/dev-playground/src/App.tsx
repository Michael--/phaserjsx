/**
 * Main app component for dev playground
 */
import {
  createDefaultTheme,
  type MountProps,
  RadioGroup,
  ScrollView,
  setColorPreset,
  Text,
  themeRegistry,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import { Icon, type IconType } from './components/Icon'
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
      <View direction="row" gap={5} alignItems="center">
        <Icon type="palette" tint={tokens?.colors.success.DEFAULT.toNumber()} />
        <Text text="Color Preset" />
      </View>
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

// Featured icons showcase
const featuredIcons: Array<{ icon: IconType; label: string }> = [
  { icon: 'zap', label: 'Performance' },
  { icon: 'palette', label: 'Theming' },
  { icon: 'code', label: 'Type Safe' },
  { icon: 'activity', label: 'Live Updates' },
]

function IconShowcase() {
  const tokens = useThemeTokens()
  const [selectedSize, setSelectedSize] = useState<32 | 48 | 64>(48)

  const sizeOptions = [
    { value: '32', label: '32px' },
    { value: '48', label: '48px' },
    { value: '64', label: '64px' },
  ]

  return (
    <View gap={20} width={'fill'} alignItems="center">
      {/* Size selector */}
      <View
        gap={10}
        padding={15}
        backgroundColor={tokens?.colors.background.lightest.toNumber()}
        borderColor={tokens?.colors.border.light.toNumber()}
        borderWidth={1}
        cornerRadius={8}
      >
        <View direction="row" gap={8} alignItems="center">
          <Icon type="maximize-2" size={20} tint={tokens?.colors.accent.DEFAULT.toNumber()} />
          <Text text="Icon Size" style={tokens?.textStyles.DEFAULT} />
        </View>
        <RadioGroup
          direction="row"
          options={sizeOptions}
          value={String(selectedSize)}
          onChange={(value) => setSelectedSize(Number(value) as 32 | 48 | 64)}
        />
      </View>

      {/* Icon Grid */}
      <View
        direction="row"
        gap={20}
        padding={20}
        backgroundColor={tokens?.colors.background.lightest.toNumber()}
        borderColor={tokens?.colors.border.light.toNumber()}
        borderWidth={1}
        cornerRadius={8}
        justifyContent="center"
        flexWrap="wrap"
      >
        {featuredIcons.map((item) => (
          <View key={item.icon} gap={8} alignItems="center" width={selectedSize + 40}>
            <Icon
              type={item.icon}
              size={selectedSize}
              tint={tokens?.colors.accent.DEFAULT.toNumber()}
            />
            <Text text={item.label} style={tokens?.textStyles.small} />
          </View>
        ))}
      </View>

      {/* Color variations */}
      <View gap={15} alignItems="center" width={'fill'}>
        <View direction="row" gap={8} alignItems="center">
          <Icon type="droplet" size={20} tint={tokens?.colors.info.DEFAULT.toNumber()} />
          <Text text="Color Variations" style={tokens?.textStyles.DEFAULT} />
        </View>

        <View
          direction="row"
          gap={20}
          padding={20}
          backgroundColor={tokens?.colors.background.lightest.toNumber()}
          borderColor={tokens?.colors.border.light.toNumber()}
          borderWidth={1}
          cornerRadius={8}
        >
          <Icon type="heart" size={48} tint={tokens?.colors.error.DEFAULT.toNumber()} />
          <Icon type="star" size={48} tint={tokens?.colors.warning.DEFAULT.toNumber()} />
          <Icon type="check-circle" size={48} tint={tokens?.colors.success.DEFAULT.toNumber()} />
          <Icon type="info" size={48} tint={tokens?.colors.info.DEFAULT.toNumber()} />
        </View>
      </View>
    </View>
  )
}

function InfoSection() {
  const tokens = useThemeTokens()

  return (
    <View
      gap={15}
      padding={20}
      width={600}
      backgroundColor={tokens?.colors.background.lightest.toNumber()}
      borderColor={tokens?.colors.border.DEFAULT.toNumber()}
      borderWidth={1}
      cornerRadius={8}
    >
      <View direction="row" gap={8} alignItems="center">
        <Icon type="book-open" size={24} tint={tokens?.colors.accent.DEFAULT.toNumber()} />
        <Text text="Icon System Features" style={tokens?.textStyles.large} />
      </View>

      <View gap={12}>
        <View direction="row" gap={8}>
          <Icon type="check" size={16} tint={tokens?.colors.success.DEFAULT.toNumber()} />
          <Text text="Type-safe with full IntelliSense" style={tokens?.textStyles.small} />
        </View>
        <View direction="row" gap={8}>
          <Icon type="check" size={16} tint={tokens?.colors.success.DEFAULT.toNumber()} />
          <Text text="Tree-shaking: Only used icons in bundle" style={tokens?.textStyles.small} />
        </View>
        <View direction="row" gap={8}>
          <Icon type="check" size={16} tint={tokens?.colors.success.DEFAULT.toNumber()} />
          <Text text="Works with any SVG library" style={tokens?.textStyles.small} />
        </View>
        <View direction="row" gap={8}>
          <Icon type="zap" size={16} tint={tokens?.colors.warning.DEFAULT.toNumber()} />
          <Text
            text="lucide-static, bootstrap-icons, tabler, etc."
            style={tokens?.textStyles.small}
          />
        </View>
        <View direction="row" gap={8}>
          <Icon type="check" size={16} tint={tokens?.colors.success.DEFAULT.toNumber()} />
          <Text text="Dynamic lazy loading with caching" style={tokens?.textStyles.small} />
        </View>
        <View direction="row" gap={8}>
          <Icon type="check" size={16} tint={tokens?.colors.success.DEFAULT.toNumber()} />
          <Text text="Customizable size & tint colors" style={tokens?.textStyles.small} />
        </View>
      </View>

      <View
        gap={10}
        padding={15}
        margin={{ top: 10 }}
        backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
        cornerRadius={6}
      >
        <View direction="row" gap={8} alignItems="center">
          <Icon type="settings" size={18} tint={tokens?.colors.info.DEFAULT.toNumber()} />
          <Text text="Two Generation Modes" style={tokens?.textStyles.DEFAULT} />
        </View>
        <View gap={8} padding={{ left: 26 }}>
          <Text text="1. Manual: pnpm run generate-icons" style={tokens?.textStyles.small} />
          <Text text="2. Auto: Vite plugin (watch mode)" style={tokens?.textStyles.small} />
        </View>
      </View>

      <View
        gap={10}
        padding={15}
        margin={{ top: 10 }}
        backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
        cornerRadius={6}
      >
        <View direction="row" gap={8} alignItems="center">
          <Icon type="sparkles" size={18} tint={tokens?.colors.accent.DEFAULT.toNumber()} />
          <Text text="Why not just Phaser Images?" style={tokens?.textStyles.DEFAULT} />
        </View>
        <View gap={8} padding={{ left: 26 }}>
          <Text
            text="Traditional Phaser: scene.load.image('icon-key', 'path/to/icon.svg')"
            style={tokens?.textStyles.small}
          />
          <Text
            text="Then: scene.add.image(x, y, 'icon-key') - not type-safe!"
            style={tokens?.textStyles.small}
          />
          <Text
            text="Icon Component: No preload needed, auto lazy-loading"
            style={tokens?.textStyles.small}
          />
          <Text
            text="For JSX users: Normal behavior. For Phaser devs: Game changer!"
            style={tokens?.textStyles.small}
          />
        </View>
      </View>
    </View>
  )
}

function TestUI() {
  return (
    <View width={'fill'} flex={1} gap={30} alignItems="center">
      <IconShowcase />
      <InfoSection />
      <ColorPresetButtons />
    </View>
  )
}

/**
 * Main App component
 */
export function App(props: AppProps & MountProps) {
  const tokens = useThemeTokens()

  return (
    <View width={'fill'} height={'fill'}>
      <ScrollView sliderSize="small">
        <View gap={30} alignItems="center" justifyContent="start">
          {/* Header */}
          <View gap={10} alignItems="center" padding={20}>
            <View direction="row" gap={10} alignItems="center">
              <Icon type="box" size={32} tint={tokens?.colors.accent.DEFAULT.toNumber()} />
              <Text text={props.title} style={tokens?.textStyles.heading} />
            </View>
            <Text
              text="Type-safe icon system with lucide-static"
              style={tokens?.textStyles.DEFAULT}
            />
          </View>

          {/* Main Content */}
          <TestUI />
        </View>
      </ScrollView>
    </View>
  )
}
