/**
 * Toggle Controlled vs Uncontrolled Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { useState } from '@number10/phaserjsx'
import { Text, Toggle, View } from '@number10/phaserjsx'

export function ControlledToggleExample() {
  const [controlled, setControlled] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={20}
      direction="column"
      justifyContent="center"
      alignItems="start"
    >
      <View direction="column" gap={8}>
        <Text text="Controlled Toggle" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Text
          text="State managed by parent component"
          style={{ color: '#aaaaaa', fontSize: '12px' }}
        />

        <Toggle
          checked={controlled}
          onChange={(checked) => {
            setControlled(checked)
            setClickCount((c) => c + 1)
          }}
          label={controlled ? 'Currently ON' : 'Currently OFF'}
        />

        <Text text={`Toggled ${clickCount} times`} style={{ color: '#95a5a6', fontSize: '12px' }} />
      </View>

      <View direction="column" gap={8}>
        <Text text="Uncontrolled Toggle" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Text
          text="Internal state, just notify on change"
          style={{ color: '#aaaaaa', fontSize: '12px' }}
        />

        <Toggle
          onChange={(checked) => {
            console.log('Toggle changed to:', checked)
          }}
          label="Notification only"
        />
      </View>
    </View>
  )
}
