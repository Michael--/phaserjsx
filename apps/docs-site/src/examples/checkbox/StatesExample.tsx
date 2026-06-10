/**
 * Checkbox States Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Checkbox, Text, View } from '@number10/phaserjsx'

export function StatesCheckboxExample() {
  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <Text text="States" style={{ color: '#ffffff', fontSize: '18px' }} />
      <Checkbox label="Unchecked" checked={false} />
      <Checkbox label="Checked" checked={true} />
      <Checkbox label="Indeterminate" checked="indeterminate" tristate />
      <Checkbox label="Disabled checked" checked={true} disabled />
    </View>
  )
}
