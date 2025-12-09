/**
 * Divider Length Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Divider, Text, View } from '@number10/phaserjsx'

export function LengthExample() {
  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={24} width={'fill'}>
        {/* Full Width (default) */}
        <View direction="column" gap={8}>
          <Text text="Full Width (default)" style={{ fontSize: '14px', color: '#666' }} />
          <Divider />
        </View>

        {/* Custom Length */}
        <View direction="column" gap={8}>
          <Text text="Custom Length (200px)" style={{ fontSize: '14px', color: '#666' }} />
          <Divider length={200} thickness={2} color={0x3b82f6} />
        </View>

        <View direction="column" gap={8}>
          <Text text="Short (100px)" style={{ fontSize: '14px', color: '#666' }} />
          <Divider length={100} thickness={2} color={0xef4444} />
        </View>

        {/* Vertical with Length */}
        <View direction="column" gap={12}>
          <Text text="Vertical with Custom Lengths" style={{ fontSize: '14px', color: '#666' }} />
          <View direction="row" gap={16} alignItems="center">
            <Text text="Item 1" style={{ fontSize: '16px' }} />
            <Divider orientation="vertical" length={20} thickness={2} color={0x10b981} />
            <Text text="Item 2" style={{ fontSize: '16px' }} />
            <Divider orientation="vertical" length={40} thickness={2} color={0xf59e0b} />
            <Text text="Item 3" style={{ fontSize: '16px' }} />
          </View>
        </View>
      </View>
    </View>
  )
}
