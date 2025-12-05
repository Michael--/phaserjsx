/**
 * RadioButton Direction Example - Row and Column layouts
 */
/** @jsxImportSource @phaserjsx/ui */
import { RadioGroup, Text, useState, View } from '@phaserjsx/ui'

export function DirectionRadioButtonExample() {
  const [column, setColumn] = useState('option2')
  const [row, setRow] = useState('b')

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={32}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <View direction="column" gap={12} alignItems="start">
        <Text text="Column Layout (Default)" style={{ color: '#ffffff', fontSize: '14px' }} />
        <RadioGroup
          direction="column"
          value={column}
          onChange={setColumn}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </View>

      <View direction="column" gap={12} alignItems="start">
        <Text text="Row Layout" style={{ color: '#ffffff', fontSize: '14px' }} />
        <RadioGroup
          direction="row"
          value={row}
          onChange={setRow}
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
            { value: 'c', label: 'C' },
          ]}
        />
      </View>
    </View>
  )
}
