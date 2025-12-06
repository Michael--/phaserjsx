/**
 * Text Transform Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function TransformTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={20}>
      <Text text="Normal Text" style={{ fontSize: '18px' }} />
      <Text text="Alpha 50%" alpha={0.5} style={{ fontSize: '18px', backgroundColor: '#ff9800' }} />
    </View>
  )
}
