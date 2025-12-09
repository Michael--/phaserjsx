/**
 * CharText Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { CharText, View } from '@number10/phaserjsx'

export function QuickStartCharTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <CharText text="Hello World" />
      <CharText text="Spaced Characters" charSpacing={8} />
    </View>
  )
}
