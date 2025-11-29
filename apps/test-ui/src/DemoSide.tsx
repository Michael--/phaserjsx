import { DevPresets, RadioGroup, Text, type RadioGroupOption } from '@phaserjsx/ui'
import { ViewLevel2 } from './examples/Helper'

const debugPresets = {
  production: { label: 'Production', preset: DevPresets.production },
  debugLayout: { label: 'Debug Layout', preset: DevPresets.debugLayout },
  debugOverflow: { label: 'Debug Overflow', preset: DevPresets.debugOverflow },
  profilePerformance: { label: 'Profile Performance', preset: DevPresets.profilePerformance },
  debugVDOM: { label: 'Debug VDOM', preset: DevPresets.debugVDOM },
  debugTheme: { label: 'Debug Theme', preset: DevPresets.debugTheme },
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
    <ViewLevel2 width={'100%'}>
      <Text text="Debug Options" />
      <RadioGroup
        options={presetOptions}
        value={props.selectedDebug}
        onChange={(value: string) => {
          const key = value as DebugPresetKey
          debugPresets[key].preset()
          props.onChange(key)
        }}
      />
    </ViewLevel2>
  )
}
