/**
 * View Flex Direction Example - Row vs Column layout
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function FlexDirectionViewExample() {
  return (
    <View padding={20} gap={24} justifyContent="center" alignItems="center">
      {/* Column (default) */}
      <View direction="column" gap={8}>
        <Text text="Column Layout (default):" style={{ fontSize: '14px', color: '#888888' }} />
        <View backgroundColor={0x3498db} padding={10}>
          <Text text="First" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0xe74c3c} padding={10}>
          <Text text="Second" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0x2ecc71} padding={10}>
          <Text text="Third" style={{ color: '#ffffff' }} />
        </View>
      </View>

      {/* Row */}
      <View direction="row" gap={8}>
        <Text text="Row Layout:" style={{ fontSize: '14px', color: '#888888' }} />
        <View backgroundColor={0x3498db} padding={10}>
          <Text text="First" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0xe74c3c} padding={10}>
          <Text text="Second" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0x2ecc71} padding={10}>
          <Text text="Third" style={{ color: '#ffffff' }} />
        </View>
      </View>
    </View>
  )
}
