/**
 * Dropdown Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Dropdown, Text, useState, View, type DropdownOption } from '@number10/phaserjsx'

const fruits: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'orange', label: 'Orange' },
]

export function QuickStartDropdownExample() {
  const [selected, setSelected] = useState<string>('')

  return (
    <View width={'fill'} height={'fill'} gap={16} direction="stack">
      <View
        width={'fill'}
        height={'fill'}
        alignItems="center"
        justifyContent="center"
        padding={16}
        gap={10}
      >
        <Text text="Select Fruit" style={{ color: '#ffffff', fontSize: '16px' }} />
        <Text
          text={`Selected: ${fruits.find((f) => f.value === selected)?.label || 'None'}`}
          style={{ color: '#aaaaaa', fontSize: '14px' }}
        />
        <Text
          text="Note: This Dropdown uses a stack layout to overlay the menu above other content."
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>

      <View width={'fill'} alignItems="center" padding={16}>
        <Dropdown
          options={fruits}
          value={selected}
          onChange={(value) => setSelected(value as string)}
          placeholder="Choose a fruit..."
          width={250}
          maxHeight={200}
        />
      </View>
    </View>
  )
}
