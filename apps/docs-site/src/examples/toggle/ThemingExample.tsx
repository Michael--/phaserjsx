/**
 * Toggle Theming Example - Custom colors and sizes
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, Toggle, useState, View } from '@phaserjsx/ui'

export function ThemingToggleExample() {
  const [custom1, setCustom1] = useState(true)
  const [custom2, setCustom2] = useState(false)
  const [custom3, setCustom3] = useState(true)

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
        <Text text="Custom Colors" style={{ color: '#ffffff', fontSize: '14px' }} />

        <Toggle
          checked={custom1}
          onChange={setCustom1}
          label="Purple theme"
          theme={{
            Toggle: {
              trackColorOff: 0x7f8c8d,
              trackColorOn: 0x9b59b6,
              thumbColor: 0xffffff,
            },
          }}
        />

        <Toggle
          checked={custom2}
          onChange={setCustom2}
          label="Orange theme"
          theme={{
            Toggle: {
              trackColorOff: 0x95a5a6,
              trackColorOn: 0xe67e22,
              thumbColor: 0xffffff,
            },
          }}
        />
      </View>

      <View direction="column" gap={8}>
        <Text text="Custom Sizes" style={{ color: '#ffffff', fontSize: '14px' }} />

        <Toggle
          checked={custom3}
          onChange={setCustom3}
          label="Large toggle"
          theme={{
            Toggle: {
              width: 70,
              height: 38,
              thumbSize: 34,
              padding: 2,
            },
          }}
        />
      </View>

      <View direction="column" gap={4}>
        <Text
          text="Customize via theme prop or global theme"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>
    </View>
  )
}
