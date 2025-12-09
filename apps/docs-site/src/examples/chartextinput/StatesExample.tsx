/**
 * CharTextInput States Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { CharTextInput, Text, useState, View } from '@number10/phaserjsx'

export function StatesCharTextInputExample() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={24}>
      <View direction="column" gap={12} alignItems="center">
        <Text text="With Placeholder" style={{ fontSize: '14px', color: '#666' }} />
        <CharTextInput
          value={value1}
          onChange={setValue1}
          placeholder="Type something..."
          width={300}
          height={40}
          padding={10}
          backgroundColor={0xffffff}
          cornerRadius={4}
        />
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="With Max Length (20 chars)" style={{ fontSize: '14px', color: '#666' }} />
        <CharTextInput
          value={value2}
          onChange={setValue2}
          maxLength={20}
          width={300}
          height={40}
          padding={10}
          backgroundColor={0xffffff}
          cornerRadius={4}
        />
        <Text text={`${value2.length}/20 characters`} style={{ fontSize: '12px', color: '#999' }} />
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Disabled" style={{ fontSize: '14px', color: '#666' }} />
        <CharTextInput
          value="Cannot edit this text"
          disabled={true}
          width={300}
          height={40}
          padding={10}
          backgroundColor={0xf0f0f0}
          cornerRadius={4}
          alpha={0.6}
        />
      </View>
    </View>
  )
}
