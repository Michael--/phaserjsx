/**
 * RadioButton Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { RadioGroup, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartRadioButtonExample() {
  const [selected, setSelected] = useState('medium')

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={20}>
      <Text text="Select Size" style={{ color: '#ffffff', fontSize: '16px' }} />

      <RadioGroup
        value={selected}
        onChange={setSelected}
        options={[
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ]}
      />

      <Text text={`Selected: ${selected}`} style={{ color: '#aaaaaa', fontSize: '14px' }} />
    </View>
  )
}
