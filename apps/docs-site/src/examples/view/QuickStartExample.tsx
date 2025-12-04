/**
 * View Quick Start Example - Basic visible container
 * Note: An empty View is invisible. Add background color or content to make it visible.
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function QuickStartViewExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <View backgroundColor={0x3498db} width={200} height={100} cornerRadius={8}>
        <Text text="I'm a View!" style={{ fontSize: '20px', color: '#ffffff' }} />
      </View>
    </View>
  )
}
