/**
 * Text Quick Start Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function QuickStartTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <Text text="Hello World" />
      <Text text="Styled text" style={{ fontSize: '24px', color: '#4caf50' }} />
    </View>
  )
}
