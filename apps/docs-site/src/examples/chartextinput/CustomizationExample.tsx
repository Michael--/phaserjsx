/**
 * CharTextInput Customization Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { CharTextInput, Text, useState, View } from '@phaserjsx/ui'

export function CustomizationCharTextInputExample() {
  const [value1, setValue1] = useState('Custom cursor')
  const [value2, setValue2] = useState('Custom selection')
  const [submitValue, setSubmitValue] = useState('')
  const [submitted, setSubmitted] = useState('')

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={24}>
      <View direction="column" gap={12} alignItems="center">
        <Text text="Custom Cursor Style" style={{ fontSize: '14px', color: '#666' }} />
        <CharTextInput
          value={value1}
          onChange={setValue1}
          cursorColor={0xff00ff}
          cursorWidth={3}
          cursorBlinkSpeed={300}
          width={300}
          height={40}
          padding={10}
          backgroundColor={0xffffff}
          cornerRadius={4}
        />
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Custom Selection Color" style={{ fontSize: '14px', color: '#666' }} />
        <CharTextInput
          value={value2}
          onChange={setValue2}
          selectionColor={0xff6600}
          selectionAlpha={0.4}
          width={300}
          height={40}
          padding={10}
          backgroundColor={0xffffff}
          cornerRadius={4}
        />
        <Text text="Select text to see custom color" style={{ fontSize: '12px', color: '#999' }} />
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text
          text="With Submit Handler (Press Enter)"
          style={{ fontSize: '14px', color: '#666' }}
        />
        <CharTextInput
          value={submitValue}
          onChange={setSubmitValue}
          onSubmit={(val) => {
            setSubmitted(val)
            setSubmitValue('')
          }}
          placeholder="Type and press Enter..."
          width={300}
          height={40}
          padding={10}
          backgroundColor={0xffffff}
          cornerRadius={4}
        />
        {submitted && (
          <Text text={`Submitted: "${submitted}"`} style={{ fontSize: '12px', color: '#4caf50' }} />
        )}
      </View>
    </View>
  )
}
