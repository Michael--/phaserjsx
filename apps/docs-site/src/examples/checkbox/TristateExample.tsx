/**
 * Checkbox Tristate Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Checkbox, Text, useState, View } from '@number10/phaserjsx'
import type { CheckboxState } from '@number10/phaserjsx'

export function TristateCheckboxExample() {
  const [state, setState] = useState<CheckboxState>('indeterminate')

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <Text
        text="Tristate cycles false -> true -> indeterminate"
        style={{ color: '#ffffff', fontSize: '15px' }}
      />
      <Checkbox label="Select all inventory items" tristate checked={state} onChange={setState} />
      <Text text={`Current: ${String(state)}`} style={{ color: '#9aa0a6', fontSize: '13px' }} />
    </View>
  )
}
