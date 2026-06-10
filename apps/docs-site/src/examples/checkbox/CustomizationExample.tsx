/**
 * Checkbox Customization Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Checkbox, createTheme, Text, View } from '@number10/phaserjsx'

export function CustomizationCheckboxExample() {
  return (
    <View
      width="fill"
      height="fill"
      padding={20}
      gap={16}
      justifyContent="center"
      theme={createTheme({
        Checkbox: {
          size: 30,
          gap: 14,
          checkedColor: 0x8bd450,
          indeterminateColor: 0xffc857,
          labelStyle: {
            color: '#ffffff',
            fontSize: '16px',
          },
        },
      })}
    >
      <Text text="Themed Checkboxes" style={{ color: '#ffffff', fontSize: '18px' }} />
      <Checkbox label="Large checked" checked={true} />
      <Checkbox label="Large indeterminate" checked="indeterminate" tristate />
      <Checkbox label="Label on the left" checked={true} labelPosition="left" />
    </View>
  )
}
