/**
 * Theme and Effects Playground Example
 */
/** @jsxImportSource @number10/phaserjsx */
import type { EffectName, PresetName } from '@number10/phaserjsx'
import {
  Button,
  createTheme,
  Divider,
  getPresetWithMode,
  Text,
  useState,
  View,
} from '@number10/phaserjsx'

type Mode = 'light' | 'dark'

const PRESETS: PresetName[] = ['oceanBlue', 'forestGreen', 'midnight']
const EFFECTS: EffectName[] = ['pulse', 'bounce', 'shake', 'tada', 'fade']

function ChoiceButton({
  label,
  active,
  onClick,
  width = 92,
}: {
  key?: string
  label: string
  active: boolean
  onClick: () => void
  width?: number
}) {
  return (
    <Button
      width={width}
      height={30}
      size="small"
      variant={active ? 'primary' : 'outline'}
      onClick={onClick}
    >
      <Text text={label} style={{ color: '#ffffff', fontSize: '11px' }} />
    </Button>
  )
}

export function ThemeEffectsPlaygroundExample() {
  const [presetName, setPresetName] = useState<PresetName>('oceanBlue')
  const [mode, setMode] = useState<Mode>('dark')
  const [effect, setEffect] = useState<EffectName>('pulse')
  const preset = getPresetWithMode(presetName, mode)
  const { colors } = preset

  const theme = createTheme(
    {
      Button: {
        backgroundColor: colors.primary.DEFAULT.toNumber(),
        borderColor: colors.primary.dark.toNumber(),
        borderWidth: 2,
        cornerRadius: 6,
        padding: { left: 12, right: 12, top: 8, bottom: 8 },
      },
      Text: {
        style: {
          color: colors.text.DEFAULT.toString(),
          fontSize: '12px',
        },
      },
    },
    { ...preset, mode }
  )

  return (
    <View
      width="fill"
      height="fill"
      gap={16}
      padding={16}
      backgroundColor={colors.background.darkest.toNumber()}
      theme={theme}
    >
      <View direction="column" gap={12}>
        <Text text="Theme controls" style={{ color: '#f8fafc', fontSize: '16px' }} />
        <Text
          text="Preset, mode, and Button effect are all local theme input."
          style={{ color: '#94a3b8', fontSize: '11px' }}
        />
        <Divider color={colors.border.DEFAULT.toNumber()} />

        <View direction="column" gap={7}>
          <Text text="Preset" style={{ color: '#dbeafe', fontSize: '12px' }} />
          <View direction="row" gap={7} flexWrap="wrap">
            {PRESETS.map((entry) => (
              <ChoiceButton
                key={entry}
                label={entry}
                active={presetName === entry}
                onClick={() => setPresetName(entry)}
                width={98}
              />
            ))}
          </View>
        </View>

        <View direction="column" gap={7}>
          <Text text="Mode" style={{ color: '#dbeafe', fontSize: '12px' }} />
          <View direction="row" gap={7}>
            <ChoiceButton
              label="light"
              active={mode === 'light'}
              onClick={() => setMode('light')}
            />
            <ChoiceButton label="dark" active={mode === 'dark'} onClick={() => setMode('dark')} />
          </View>
        </View>

        <View direction="column" gap={7}>
          <Text text="Effect" style={{ color: '#dbeafe', fontSize: '12px' }} />
          <View direction="row" gap={7} flexWrap="wrap">
            {EFFECTS.map((entry) => (
              <ChoiceButton
                key={entry}
                label={entry}
                active={effect === entry}
                onClick={() => setEffect(entry)}
              />
            ))}
          </View>
        </View>
      </View>

      <View
        flex={1}
        height="fill"
        direction="column"
        gap={14}
        padding={18}
        backgroundColor={colors.surface.DEFAULT.toNumber()}
        borderColor={colors.border.DEFAULT.toNumber()}
        borderWidth={2}
        cornerRadius={8}
      >
        <View direction="row" justifyContent="space-between" alignItems="center">
          <Text
            text={`${presetName} / ${mode}`}
            style={{ color: colors.text.darkest.toString(), fontSize: '18px' }}
          />
          <Text
            text={`effect=${effect}`}
            style={{ color: colors.accent.DEFAULT.toString(), fontSize: '12px' }}
          />
        </View>

        <Divider color={colors.border.DEFAULT.toNumber()} />

        <View direction="row" gap={12} flexWrap="wrap">
          <View
            width={140}
            height={56}
            padding={12}
            backgroundColor={colors.primary.light.toNumber()}
            cornerRadius={6}
          >
            <Text
              text="Primary card"
              style={{ color: colors.text.darkest.toString(), fontSize: '13px' }}
            />
          </View>
          <View
            width={140}
            height={56}
            padding={12}
            backgroundColor={colors.secondary.light.toNumber()}
            cornerRadius={6}
          >
            <Text
              text="Secondary card"
              style={{ color: colors.text.darkest.toString(), fontSize: '13px' }}
            />
          </View>
          <View
            width={140}
            height={56}
            padding={12}
            backgroundColor={colors.accent.light.toNumber()}
            cornerRadius={6}
          >
            <Text
              text="Accent card"
              style={{ color: colors.text.darkest.toString(), fontSize: '13px' }}
            />
          </View>
        </View>

        <View flex={1} justifyContent="center" alignItems="center" gap={12}>
          <Button
            width={220}
            height={48}
            effect={effect}
            effectConfig={{
              time: 360,
              intensity: 1.14,
              magnitude: 8,
            }}
          >
            <Text text="Click themed effect" style={{ color: '#ffffff', fontSize: '14px' }} />
          </Button>
          <Text
            text="The Button receives colors from the local theme and the selected effect prop."
            style={{ color: colors.text.DEFAULT.toString(), fontSize: '12px' }}
          />
        </View>
      </View>
    </View>
  )
}
