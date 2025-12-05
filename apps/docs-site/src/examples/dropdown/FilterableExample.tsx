/**
 * Dropdown Filterable Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Dropdown, Text, useState, View, type DropdownOption } from '@phaserjsx/ui'

const largeList: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'cranberry', label: 'Cranberry' },
  { value: 'date', label: 'Date' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'lime', label: 'Lime' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'peach', label: 'Peach' },
  { value: 'pear', label: 'Pear' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'plum', label: 'Plum' },
  { value: 'raspberry', label: 'Raspberry' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
]

export function FilterableDropdownExample() {
  const [selected, setSelected] = useState<string>('')

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      direction="stack"
      justifyContent="center"
      alignItems="center"
    >
      <View direction="column" gap={12} alignItems="center">
        <Text text="Filterable Dropdown" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Text text="Type to filter options" style={{ color: '#95a5a6', fontSize: '11px' }} />

        <Dropdown
          options={largeList}
          value={selected}
          onChange={(value) => setSelected(value as string)}
          placeholder="Filter fruits..."
          isFilterable={true}
          maxHeight={200}
          width={300}
        />

        <Text
          text={`Selected: ${largeList.find((o) => o.value === selected)?.label || 'None'}`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>
    </View>
  )
}
