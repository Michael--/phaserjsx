/**
 * Divider Orientation Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Divider, Text, View } from '@phaserjsx/ui'

export function OrientationExample() {
  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={24} width={'fill'}>
        {/* Horizontal Dividers */}
        <View direction="column" gap={12}>
          <Text text="Horizontal Dividers" style={{ fontSize: '14px', color: '#666' }} />
          <Divider orientation="horizontal" />
        </View>

        {/* Vertical Divider in Row */}
        <View direction="column" gap={12}>
          <Text text="Vertical Divider" style={{ fontSize: '14px', color: '#666' }} />
          <View direction="row" gap={16} alignItems="center">
            <Text text="Left" style={{ fontSize: '16px' }} />
            <Divider orientation="vertical" length={30} />
            <Text text="Center" style={{ fontSize: '16px' }} />
            <Divider orientation="vertical" length={30} />
            <Text text="Right" style={{ fontSize: '16px' }} />
          </View>
        </View>
      </View>
    </View>
  )
}
