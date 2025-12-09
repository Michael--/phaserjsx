/**
 * Divider Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Divider, Text, View } from '@number10/phaserjsx'

export function QuickStartExample() {
  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16} width={'fill'}>
        <Text text="Section 1" style={{ fontSize: '16px', color: '#333' }} />
        <Divider />
        <Text text="Section 2" style={{ fontSize: '16px', color: '#333' }} />
        <Divider />
        <Text text="Section 3" style={{ fontSize: '16px', color: '#333' }} />
      </View>
    </View>
  )
}
