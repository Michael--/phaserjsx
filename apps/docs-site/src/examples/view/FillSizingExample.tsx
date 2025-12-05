/**
 * View Fill Sizing Example - Using "fill" to take full available space
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function FillSizingViewExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Container with fixed width */}
      <View width={300} backgroundColor={0x95a5a6} padding={8} gap={8}>
        <Text text="Container: 300px wide" style={{ color: '#ffffff', fontSize: '12px' }} />

        {/* Child fills full width */}
        <View backgroundColor={0x3498db} width="fill" height={50} padding={8}>
          <Text text='width="fill"' style={{ color: '#ffffff' }} />
        </View>

        {/* Child with fixed width */}
        <View backgroundColor={0xe74c3c} width={150} height={50} padding={8}>
          <Text text="width={150}" style={{ color: '#ffffff' }} />
        </View>
      </View>

      {/* Container with fixed height */}
      <View direction="row" height={150} backgroundColor={0x95a5a6} padding={8} gap={8}>
        <View backgroundColor={0x2ecc71} width={120} height="fill" padding={8}>
          <Text text='height="fill"' style={{ color: '#ffffff', fontSize: '12px' }} />
        </View>

        <View backgroundColor={0x9b59b6} width={120} height={80} padding={8}>
          <Text text="height={80}" style={{ color: '#ffffff', fontSize: '12px' }} />
        </View>
      </View>

      {/* Both dimensions fill */}
      <View width={300} height={120} backgroundColor={0x95a5a6} padding={8}>
        <View backgroundColor={0xf39c12} width="fill" height="fill" padding={8}>
          <Text text='width="fill" height="fill"' style={{ color: '#ffffff' }} />
        </View>
      </View>
    </View>
  )
}
