/**
 * CharTextInput Quick Start Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { CharTextInput, Text, useState, View } from '@phaserjsx/ui'

export function QuickStartCharTextInputExample() {
  const [value, setValue] = useState('Hello World')

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <CharTextInput
        value={value}
        onChange={setValue}
        width={300}
        height={40}
        padding={10}
        backgroundColor={0xffffff}
        cornerRadius={4}
      />
      <Text text={`Input: "${value}"`} style={{ fontSize: '14px', color: '#666' }} />
    </View>
  )
}
