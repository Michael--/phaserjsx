/**
 * Toggle Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, Toggle, useState, View } from '@number10/phaserjsx'

export function QuickStartToggleExample() {
  const [isEnabled, setIsEnabled] = useState(false)

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <Toggle checked={isEnabled} onChange={setIsEnabled} label="Enable feature" />

      <Text
        text={isEnabled ? 'Feature is ON' : 'Feature is OFF'}
        style={{ color: isEnabled ? '#4caf50' : '#999999', fontSize: '14px' }}
      />
    </View>
  )
}
