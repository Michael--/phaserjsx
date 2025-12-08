/**
 * RadioButton Standalone Example - Using RadioButton component directly
 */
/** @jsxImportSource @phaserjsx/ui */
import { RadioButton, Text, useState, View } from '@phaserjsx/ui'

export function StandaloneRadioButtonExample() {
  const [selected, setSelected] = useState('option1')

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={16}
      direction="column"
      justifyContent="center"
      alignItems="start"
    >
      <Text text="Manual RadioButton Control" style={{ color: '#ffffff', fontSize: '14px' }} />

      <RadioButton
        label="Option 1"
        selected={selected === 'option1'}
        onClick={() => setSelected('option1')}
      />

      <RadioButton
        label="Option 2"
        selected={selected === 'option2'}
        onClick={() => setSelected('option2')}
      />

      <RadioButton
        label="Option 3"
        selected={selected === 'option3'}
        onClick={() => setSelected('option3')}
      />

      <Text text={`Selected: ${selected}`} style={{ color: '#95a5a6', fontSize: '12px' }} />

      <View direction="column" gap={4}>
        <Text
          text="Note: RadioButton provides the individual control."
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
        <Text
          text="Use RadioGroup for automatic selection management."
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>
    </View>
  )
}
