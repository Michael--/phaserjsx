/**
 * Dropdown Multi-Select Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Dropdown, Text, useState, View, type DropdownOption } from '@phaserjsx/ui'

const options: DropdownOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
]

export function MultiSelectDropdownExample() {
  const [singleSelect, setSingleSelect] = useState<string>('')
  const [multiSelect, setMultiSelect] = useState<string[]>([])

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={32}
      justifyContent="center"
      alignItems="start"
      direction="row"
    >
      <View direction="column" gap={12} alignItems="center">
        <Text text="Single Select" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Dropdown
          options={options}
          value={singleSelect}
          onChange={(value) => setSingleSelect(value as string)}
          placeholder="Select one..."
          width={250}
          maxHeight={200}
        />
        <Text
          text={`Selected: ${options.find((o) => o.value === singleSelect)?.label || 'None'}`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Multi Select" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Dropdown
          options={options}
          value={multiSelect}
          onChange={(value) => setMultiSelect(value as string[])}
          placeholder="Select multiple..."
          multiple={true}
          width={250}
          maxHeight={200}
        />
        <Text
          text={`Selected: ${multiSelect.length > 0 ? multiSelect.join(', ') : 'None'}`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>
    </View>
  )
}
