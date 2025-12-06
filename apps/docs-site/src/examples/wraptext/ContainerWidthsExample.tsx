/**
 * WrapText Container Widths Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View, WrapText } from '@phaserjsx/ui'

export function ContainerWidthsWrapTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={24}>
      <View direction="column" gap={16} alignItems="center">
        <Text text="Narrow (200px)" style={{ fontSize: '14px', color: '#666' }} />
        <View width={200} backgroundColor={0xfff3e0} padding={12} cornerRadius={8}>
          <WrapText text="Text wraps gracefully even in narrow containers." />
        </View>
      </View>

      <View direction="column" gap={16} alignItems="center">
        <Text text="Medium (400px)" style={{ fontSize: '14px', color: '#666' }} />
        <View width={400} backgroundColor={0xe3f2fd} padding={16} cornerRadius={8}>
          <WrapText text="With more space, the text flows naturally across multiple lines when needed." />
        </View>
      </View>

      <View direction="column" gap={16} alignItems="center">
        <Text text="Wide (600px)" style={{ fontSize: '14px', color: '#666' }} />
        <View width={600} backgroundColor={0xe8f5e9} padding={20} cornerRadius={8}>
          <WrapText text="In wider containers, text can span comfortably. This is ideal for descriptions, explanations, or any content requiring more breathing room. Wrapping happens automatically based on available width." />
        </View>
      </View>
    </View>
  )
}
