/**
 * Dropdown States Example - Disabled and Placement
 */
/** @jsxImportSource @phaserjsx/ui */
import { Dropdown, Text, useState, View, type DropdownOption } from '@phaserjsx/ui'

const options: DropdownOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
]

export function StatesDropdownExample() {
  const [topPlacement, setTopPlacement] = useState<string>('')
  const [bottomPlacement, setBottomPlacement] = useState<string>('')

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={32}
      justifyContent="space-between"
      alignItems="center"
    >
      {/* Top Placement */}
      <View direction="column" gap={12} alignItems="center">
        <Text text="Placement: Bottom (Default)" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Dropdown
          options={options}
          value={bottomPlacement}
          onChange={(value) => setBottomPlacement(value as string)}
          placeholder="Opens downward..."
          placement="bottom"
          width={250}
        />
      </View>

      {/* Disabled State */}
      <View direction="column" gap={12} alignItems="center">
        <Text text="Disabled State" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Dropdown
          options={options}
          value="opt1"
          placeholder="Disabled dropdown"
          disabled={true}
          width={250}
        />
        <Text
          text="Note: Disabled dropdowns are not interactive"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>

      {/* Bottom Placement */}
      <View direction="column" gap={12} alignItems="center">
        <Text text="Placement: Top" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Dropdown
          options={options}
          value={topPlacement}
          onChange={(value) => setTopPlacement(value as string)}
          placeholder="Opens upward..."
          placement="top"
          width={250}
        />
      </View>
    </View>
  )
}
