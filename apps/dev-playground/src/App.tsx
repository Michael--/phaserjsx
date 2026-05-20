/**
 * Main app component for dev playground
 */
import {
  Button,
  createDefaultTheme,
  Dropdown,
  type DropdownOption,
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

const PERF_DROPDOWN_OPTIONS: DropdownOption<string>[] = Array.from({ length: 80 }, (_, i) => ({
  value: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}))

const PERF_LIST_ITEMS = Array.from({ length: 50 }, (_, i) => `Row ${i + 1}`)

type PerfScenario = 'baseline' | 'mask' | 'scroll' | 'dropdown'
type PerfDensity = '1' | '4' | '9' | '16'
type PerfRunConfig = {
  scenario: PerfScenario
  density: PerfDensity
  scrollOffset: number
}

function PerfLab() {
  const tokens = useThemeTokens()
  const [scenario, setScenario] = useState<PerfScenario>('mask')
  const [density, setDensity] = useState<PerfDensity>('4')
  const [selectedDropdownValues, setSelectedDropdownValues] = useState<Record<string, string>>({})
  const [scrollOffset, setScrollOffset] = useState(0)
  const [runConfig, setRunConfig] = useState<PerfRunConfig | null>(null)

  const isRunning = runConfig !== null
  const activeScenario = runConfig?.scenario ?? 'baseline'
  const activeDensity = runConfig?.density ?? '1'
  const activeScrollOffset = runConfig?.scrollOffset ?? 0

  const cellCount = Number(activeDensity)
  const cells = Array.from({ length: cellCount }, (_, i) => i)

  const scenarioOptions = [
    { value: 'baseline', label: 'Baseline' },
    { value: 'mask', label: 'Mask Only' },
    { value: 'scroll', label: 'ScrollView' },
    { value: 'dropdown', label: 'Dropdown' },
  ]
  const densityOptions = [
    { value: '1', label: '1' },
    { value: '4', label: '4' },
    { value: '9', label: '9' },
    { value: '16', label: '16' },
  ]

  const startRun = () => {
    setSelectedDropdownValues({})
    setRunConfig({
      scenario,
      density,
      scrollOffset,
    })
  }

  const stopRun = () => {
    setRunConfig(null)
    setSelectedDropdownValues({})
  }

  const cellContent = (index: number) => {
    if (activeScenario === 'baseline') {
      return (
        <View
          width={'fill'}
          height={'fill'}
          cornerRadius={8}
          backgroundColor={tokens?.colors.background.lightest.toNumber()}
          borderColor={tokens?.colors.border.DEFAULT.toNumber()}
          borderWidth={1}
          alignItems="center"
          justifyContent="center"
        >
          <Text text={`Cell ${index + 1}`} style={tokens?.textStyles.small} />
        </View>
      )
    }

    if (activeScenario === 'mask') {
      const offset = ((index % 4) - 1.5) * 22 + activeScrollOffset
      return (
        <View width={'fill'} height={'fill'} overflow="hidden" cornerRadius={10}>
          <View
            width={260}
            height={180}
            x={offset}
            y={-offset * 0.6}
            backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
            alpha={0.75}
            cornerRadius={12}
            alignItems="center"
            justifyContent="center"
          >
            <Text text={`Masked ${index + 1}`} style={tokens?.textStyles.small} />
          </View>
          <View
            width={180}
            height={90}
            x={20 - offset * 0.4}
            y={24 + offset * 0.3}
            overflow="hidden"
            cornerRadius={8}
            backgroundColor={tokens?.colors.background.lightest.toNumber()}
          >
            <View
              width={220}
              height={120}
              x={-40}
              y={-12}
              backgroundColor={tokens?.colors.warning.DEFAULT.toNumber()}
              alpha={0.7}
            />
          </View>
        </View>
      )
    }

    if (activeScenario === 'scroll') {
      return (
        <View
          width={'fill'}
          height={'fill'}
          backgroundColor={tokens?.colors.background.lightest.toNumber()}
        >
          <ScrollView showVerticalSlider="auto" sliderSize="small">
            <View gap={4} padding={8}>
              {PERF_LIST_ITEMS.map((label) => (
                <View
                  key={`${index}-${label}`}
                  padding={6}
                  cornerRadius={4}
                  backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
                >
                  <Text text={`${label} • Cell ${index + 1}`} style={tokens?.textStyles.small} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )
    }

    return (
      <View
        width={'fill'}
        height={'fill'}
        padding={8}
        gap={8}
        backgroundColor={tokens?.colors.background.lightest.toNumber()}
      >
        <Dropdown
          options={PERF_DROPDOWN_OPTIONS}
          value={selectedDropdownValues[index] ?? ''}
          onChange={(value) =>
            setSelectedDropdownValues((prev) => ({ ...prev, [index]: String(value) }))
          }
          placeholder={`Pick #${index + 1}`}
          isFilterable={true}
          maxHeight={180}
          width="fill"
        />
        <Text
          text={`Selected: ${selectedDropdownValues[index] ?? 'none'}`}
          style={tokens?.textStyles.small}
          alpha={0.8}
        />
      </View>
    )
  }

  return (
    <View gap={14} width={'fill'} alignItems="center">
      <View
        width={920}
        gap={10}
        padding={12}
        cornerRadius={10}
        borderColor={tokens?.colors.border.DEFAULT.toNumber()}
        backgroundColor={tokens?.colors.background.lightest.toNumber()}
      >
        <Text text="Performance Lab" style={tokens?.textStyles.large} />
        <View direction="row" gap={10} alignItems="center">
          <Text text="Scenario:" style={tokens?.textStyles.small} />
          <RadioGroup
            direction="row"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => setScenario(value as PerfScenario)}
          />
        </View>
        <View direction="row" gap={10} alignItems="center">
          <Text text="Cells:" style={tokens?.textStyles.small} />
          <RadioGroup
            direction="row"
            options={densityOptions}
            value={density}
            onChange={(value) => setDensity(value as PerfDensity)}
          />
        </View>
        <View direction="row" gap={10} alignItems="center">
          <Text text="Mask Offset:" style={tokens?.textStyles.small} />
          <RadioGroup
            direction="row"
            options={[
              { value: '-20', label: '-20' },
              { value: '0', label: '0' },
              { value: '20', label: '+20' },
              { value: '40', label: '+40' },
            ]}
            value={String(scrollOffset)}
            onChange={(value) => setScrollOffset(Number(value))}
          />
        </View>
        <View direction="row" gap={10} alignItems="center">
          <Button variant="primary" onClick={startRun}>
            <Text text="Start" />
          </Button>
          <Button variant="secondary" onClick={stopRun}>
            <Text text="Stop" />
          </Button>
          <Text
            text={
              isRunning
                ? `Running: ${runConfig.scenario} / cells=${runConfig.density} / offset=${runConfig.scrollOffset}`
                : 'Idle: no active test. Settings apply on next Start.'
            }
            style={tokens?.textStyles.small}
            alpha={0.85}
          />
        </View>
      </View>

      {isRunning ? (
        <View
          width={920}
          direction="row"
          gap={12}
          flexWrap="wrap"
          alignItems="start"
          justifyContent="start"
        >
          {cells.map((index) => (
            <View
              key={`perf-cell-${index}`}
              width={220}
              height={170}
              cornerRadius={10}
              borderColor={tokens?.colors.border.DEFAULT.toNumber()}
              borderWidth={1}
            >
              {cellContent(index)}
            </View>
          ))}
        </View>
      ) : (
        <View
          width={920}
          height={160}
          cornerRadius={10}
          borderColor={tokens?.colors.border.DEFAULT.toNumber()}
          borderWidth={1}
          alignItems="center"
          justifyContent="center"
          backgroundColor={tokens?.colors.background.lightest.toNumber()}
        >
          <Text
            text="Idle. Press Start to mount the selected scenario."
            style={tokens?.textStyles.DEFAULT}
          />
        </View>
      )}
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
  const [mode, setMode] = useState<'perf' | 'showcase'>('perf')

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
            <RadioGroup
              direction="row"
              options={[
                { value: 'perf', label: 'Perf Lab' },
                { value: 'showcase', label: 'Showcase' },
              ]}
              value={mode}
              onChange={(value) => setMode(value as 'perf' | 'showcase')}
            />
          </View>

          {/* Main Content */}
          {mode === 'perf' ? <PerfLab /> : <TestUI />}
        </View>
      </ScrollView>
    </View>
  )
}
