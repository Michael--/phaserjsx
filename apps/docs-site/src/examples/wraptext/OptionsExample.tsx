/**
 * WrapText Options Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View, WrapText } from '@number10/phaserjsx'

export function OptionsWrapTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={32}>
      <View direction="column" gap={12} alignItems="center">
        <Text text="Wrapping Enabled (default)" style={{ fontSize: '14px', color: '#666' }} />
        <View width={300} backgroundColor={0xe8f5e9} padding={16} cornerRadius={8}>
          <WrapText text="This text wraps automatically when it reaches the container edge." />
        </View>
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Wrapping Disabled (wrap={false})" style={{ fontSize: '14px', color: '#666' }} />
        <View width={300} backgroundColor={0xfce4ec} padding={16} cornerRadius={8}>
          <WrapText text="This text has wrapping disabled and will overflow." wrap={false} />
        </View>
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Multiple Paragraphs" style={{ fontSize: '14px', color: '#666' }} />
        <View
          width={400}
          backgroundColor={0xf3e5f5}
          padding={16}
          cornerRadius={8}
          direction="column"
          gap={12}
        >
          <WrapText text="First paragraph with automatic wrapping." />
          <WrapText text="Second paragraph. Multiple WrapText components can be used together with proper spacing between them." />
          <WrapText text="Third paragraph to demonstrate layout." />
        </View>
      </View>
    </View>
  )
}
