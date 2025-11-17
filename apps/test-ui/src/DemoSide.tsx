import { DevPresets, Text } from '@phaserjsx/ui'
import { RadioGroup, type RadioGroupOption } from './components'

const debugPresets = {
  production: { label: 'Production', preset: DevPresets.production },
  debugLayout: { label: 'Debug Layout', preset: DevPresets.debugLayout },
  debugOverflow: { label: 'Debug Overflow', preset: DevPresets.debugOverflow },
  profilePerformance: { label: 'Profile Performance', preset: DevPresets.profilePerformance },
  debugVDOM: { label: 'Debug VDOM', preset: DevPresets.debugVDOM },
  debugAll: { label: 'Debug All', preset: DevPresets.debugAll },
} as const

export type DebugPresetKey = keyof typeof debugPresets

export function DebugSide(props: {
  selectedDebug: DebugPresetKey
  onChange: (value: DebugPresetKey) => void
}) {
  const presetOptions: RadioGroupOption[] = Object.entries(debugPresets).map(([value, config]) => ({
    value: value as DebugPresetKey,
    label: config.label,
  }))

  return (
    <>
      <Text text="Debug Options" style={{ fontSize: 18, color: 'cyan' }} />
      <RadioGroup
        options={presetOptions}
        value={props.selectedDebug}
        onChange={(value: string) => {
          const key = value as DebugPresetKey
          debugPresets[key].preset()
          props.onChange(key)
        }}
        gap={8}
        selectedColor={0x4ecdc4}
        unselectedColor={0x555555}
      />
    </>
  )
}
