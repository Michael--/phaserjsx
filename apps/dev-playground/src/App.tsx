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
import { ShowCase5 } from './Showcase5'
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
applyColorPreset('oceanBlue', 'dark')

type ShowCase = 'clip' | 'showcase' | 'Stackblitz 5'

function ShowcaseWrapper(props: { mode: ShowCase }) {
  switch (props.mode) {
    case 'clip':
      return <StencilClipLab />
    case 'showcase':
      return <TestUI />
    case 'Stackblitz 5':
      return <ShowCase5 title="nix" />
    default:
      return null
  }
}

/**
 * Main App component
 */
export function App(props: AppProps & MountProps) {
  const tokens = useThemeTokens()
  const [mode, setMode] = useState<ShowCase>('Stackblitz 5')

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
      <ScrollView sliderSize="small" width={'fill'} height={'fill'} gap={20}>
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
                  { value: 'Stackblitz 5', label: 'Stackblitz 5' },
                ]}
                value={mode}
                onChange={(value) => setMode(value as ShowCase)}
              />
            </View>
            <Divider length={600} />
          </View>
          {/* Main Content */}
          <ShowcaseWrapper mode={mode} />
        </View>
      </ScrollView>
    </View>
  )
}
