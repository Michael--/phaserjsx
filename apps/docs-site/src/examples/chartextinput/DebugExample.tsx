/**
 * CharTextInput Debug Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { CharTextInput, Text, useState, View } from '@phaserjsx/ui'

export function DebugCharTextInputExample() {
  const [value, setValue] = useState('Test input')

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <Text
        text="Debug Mode: HTML input overlay visible"
        style={{ fontSize: '12px', color: '#ff0000' }}
      />
      <CharTextInput
        value={value}
        onChange={setValue}
        debugHtmlInput={true}
        width={300}
        height={40}
        padding={10}
        backgroundColor={0xffffff}
        cornerRadius={4}
      />
      <Text text={`Value: "${value}"`} style={{ fontSize: '14px', color: '#666' }} />
      <View direction="column" gap={8} padding={16} backgroundColor={0xf0f0f0} cornerRadius={4}>
        <Text text="Expected behavior:" style={{ fontSize: '12px', fontWeight: 'bold' }} />
        <Text text="• Red dashed border should overlay input" style={{ fontSize: '11px' }} />
        <Text text="• HTML input should match position/size" style={{ fontSize: '11px' }} />
        <Text text="• Click HTML overlay to focus" style={{ fontSize: '11px' }} />
      </View>
    </View>
  )
}
