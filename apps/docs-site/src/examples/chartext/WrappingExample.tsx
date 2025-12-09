/**
 * CharText Wrapping Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { CharText, Text, View } from '@number10/phaserjsx'

export function WrappingCharTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={32}>
      <View direction="column" gap={12} alignItems="center">
        <Text text="Multi-line with word wrapping" style={{ fontSize: '14px', color: '#666' }} />
        <View width={300} backgroundColor={0xf5f5f5} padding={16} cornerRadius={8}>
          <CharText
            text="This is a longer text that will automatically wrap into multiple lines when it reaches the container edge."
            width={268}
            multiline={true}
            wordWrap={true}
          />
        </View>
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Custom line height" style={{ fontSize: '14px', color: '#666' }} />
        <View width={300} backgroundColor={0xe3f2fd} padding={16} cornerRadius={8}>
          <CharText
            text="Text with increased line spacing for better readability."
            width={268}
            multiline={true}
            lineHeight={1.8}
          />
        </View>
      </View>
    </View>
  )
}
