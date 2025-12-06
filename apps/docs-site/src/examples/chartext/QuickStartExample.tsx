/**
 * CharText Quick Start Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { CharText, View } from '@phaserjsx/ui'

export function QuickStartCharTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <CharText text="Hello World" />
      <CharText text="Spaced Characters" charSpacing={8} />
    </View>
  )
}
