/**
 * WrapText Quick Start Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { View, WrapText } from '@phaserjsx/ui'

export function QuickStartWrapTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <View width={300} backgroundColor={0xf5f5f5} padding={16} cornerRadius={8}>
        <WrapText text="This text automatically wraps to fit the container width. No manual wordWrap configuration needed!" />
      </View>
    </View>
  )
}
