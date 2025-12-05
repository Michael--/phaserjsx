/**
 * Toggle States Example - Checked and Disabled
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, Toggle, useState, View } from '@phaserjsx/ui'

export function StatesToggleExample() {
  const [enabled, setEnabled] = useState(true)
  const [disabled, setDisabled] = useState(false)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={16}
      direction="column"
      justifyContent="center"
      alignItems="start"
    >
      <View direction="column" gap={8}>
        <Text text="Interactive States" style={{ color: '#ffffff', fontSize: '14px' }} />

        <Toggle checked={enabled} onChange={setEnabled} label="Normal - Enabled" />

        <Toggle checked={disabled} onChange={setDisabled} label="Normal - Disabled" />

        <Toggle checked={true} onChange={() => {}} disabled label="Disabled - Checked ON" />

        <Toggle checked={false} onChange={() => {}} disabled label="Disabled - Checked OFF" />
      </View>

      <View direction="column" gap={4}>
        <Text
          text="Note: Disabled toggles have reduced opacity (0.5)"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
        <Text
          text="and show disabledColor from theme"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>
    </View>
  )
}
