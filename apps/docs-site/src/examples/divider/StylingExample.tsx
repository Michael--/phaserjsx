/**
 * Divider Styling Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Divider, Text, View } from '@number10/phaserjsx'

export function StylingExample() {
  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={24} width={'fill'}>
        {/* Default Divider */}
        <View direction="column" gap={8}>
          <Text text="Default (1px, gray)" style={{ fontSize: '14px', color: '#666' }} />
          <Divider />
        </View>

        {/* Thick Divider */}
        <View direction="column" gap={8}>
          <Text text="Thick (4px)" style={{ fontSize: '14px', color: '#666' }} />
          <Divider thickness={4} />
        </View>

        {/* Colored Dividers */}
        <View direction="column" gap={8}>
          <Text text="Blue" style={{ fontSize: '14px', color: '#666' }} />
          <Divider color={0x3b82f6} thickness={2} />
        </View>

        <View direction="column" gap={8}>
          <Text text="Red" style={{ fontSize: '14px', color: '#666' }} />
          <Divider color={0xef4444} thickness={2} />
        </View>

        <View direction="column" gap={8}>
          <Text text="Green" style={{ fontSize: '14px', color: '#666' }} />
          <Divider color={0x10b981} thickness={2} />
        </View>
      </View>
    </View>
  )
}
