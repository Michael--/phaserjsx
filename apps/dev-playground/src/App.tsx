/**
 * Main app component for dev playground
 */
import {
  createDefaultTheme,
  DebugPanel,
  Divider,
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
import { Icon } from './components/Icon'
import { StencilClipLab } from './StencilClipLab'
import { TestUI } from './TestUI'
import type { AppProps } from './types'

// Helper to apply color preset and update global theme
function applyColorPreset(preset: Parameters<typeof setColorPreset>[0], mode?: 'light' | 'dark') {
  const targetMode = mode ?? themeRegistry.getColorMode()
  setColorPreset(preset, mode)
  themeRegistry.setGlobalTheme(createDefaultTheme(preset, targetMode))
}

// Initialize preset and mode in one go
applyColorPreset('forestGreen', 'dark')

/**
 * Main App component
 */
export function App(props: AppProps & MountProps) {
  const tokens = useThemeTokens()
  const [mode, setMode] = useState<'clip' | 'showcase'>('showcase')

  return (
    <View width={'fill'} height={'fill'} direction="stack">
      <DebugPanel
        metrics={['phaserVersion', 'viewport', 'fps', 'textureCount']}
        intervalMs={500}
        padding={6}
        backgroundColor={tokens?.colors.background.dark.toNumber()}
        width={140}
        innerProps={{ justifyContent: 'space-between', width: 'fill' }}
      />
      <ScrollView sliderSize="small">
        <View alignItems="center" justifyContent="start">
          {/* Header */}
          <View gap={10} alignItems="center" padding={20}>
            <View direction="row" gap={10} alignItems="center">
              <Icon type="box" size={32} tint={tokens?.colors.accent.DEFAULT.toNumber()} />
              <Text text={props.title} style={tokens?.textStyles.heading} />
            </View>
            <View
              direction="row"
              gap={10}
              alignItems="center"
              padding={12}
              cornerRadius={8}
              borderColor={tokens?.colors.border.DEFAULT.toNumber()}
              borderWidth={1}
              backgroundColor={tokens?.colors.background.lightest.toNumber()}
            >
              <Text text="Select:" style={tokens?.textStyles.small} />
              <RadioGroup
                direction="row"
                options={[
                  { value: 'showcase', label: 'Showcase' },
                  { value: 'clip', label: 'Stencil Lab' },
                ]}
                value={mode}
                onChange={(value) => setMode(value as 'clip' | 'showcase')}
              />
            </View>
            <Divider length={600} />
          </View>

          {/* Main Content */}
          {mode === 'clip' ? <StencilClipLab /> : <TestUI />}
        </View>
      </ScrollView>
    </View>
  )
}
