/**
 * SegmentedControl vertical, disabled, and theming example
 */
/** @jsxImportSource @number10/phaserjsx */
import { SegmentedControl, Text, useState, View } from '@number10/phaserjsx'

export function VerticalThemingSegmentedControlExample() {
  const [alignment, setAlignment] = useState('center')

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={28}>
      <SegmentedControl
        label="Align"
        labelPosition="left"
        value={alignment}
        onChange={setAlignment}
        orientation="vertical"
        variant="outline"
        segmentWidth={112}
        options={[
          { value: 'start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'End' },
          { value: 'stretch', label: 'Stretch', disabled: true },
        ]}
        theme={{
          SegmentedControl: {
            backgroundColor: 0x111827,
            borderColor: 0x2563eb,
            segmentSelectedStyle: {
              backgroundColor: 0x2563eb,
              backgroundAlpha: 0.28,
              borderColor: 0x93c5fd,
            },
            textStyle: {
              color: '#bfdbfe',
            },
            selectedTextStyle: {
              color: '#ffffff',
            },
          },
        }}
      />

      <Text text={`Alignment: ${alignment}`} style={{ color: '#9fb3c8' }} />
    </View>
  )
}
