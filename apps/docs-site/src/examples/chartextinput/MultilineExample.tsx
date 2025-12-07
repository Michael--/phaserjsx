/**
 * CharTextInput Multi-line Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { CharTextInput, Text, useState, View } from '@phaserjsx/ui'

export function MultilineCharTextInputExample() {
  const [value, setValue] = useState('Multi-line text input.\nTry typing and using Enter key!')

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <View direction="column" gap={12} alignItems="center">
        <Text text="Multi-line Input" style={{ fontSize: '14px', color: '#666' }} />
        <CharTextInput
          value={value}
          onChange={setValue}
          multiline={true}
          maxLines={5}
          lineHeight={1.4}
          width={400}
          minHeight={120}
          padding={12}
          backgroundColor={0xffffff}
          cornerRadius={4}
        />
        <Text
          text={`Lines: ${value.split('\n').length} | Characters: ${value.length}`}
          style={{ fontSize: '12px', color: '#999' }}
        />
      </View>
    </View>
  )
}
