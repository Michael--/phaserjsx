/**
 * SegmentedControl Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { SegmentedControl, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartSegmentedControlExample() {
  const [mode, setMode] = useState('inspect')

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: 'inspect', label: 'Inspect' },
          { value: 'move', label: 'Move' },
          { value: 'paint', label: 'Paint' },
        ]}
      />

      <Text text={`Active mode: ${mode}`} style={{ color: '#9fb3c8' }} />
    </View>
  )
}
