/**
 * View Basic Layout Example - Dimensions and padding
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function BasicLayoutViewExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* With explicit dimensions */}
      <View backgroundColor={0xe74c3c} width={150} height={80} padding={10}>
        <Text text="150x80" style={{ color: '#ffffff' }} />
      </View>

      {/* With padding */}
      <View backgroundColor={0x2ecc71} padding={20}>
        <Text text="Auto-sized with padding" style={{ color: '#ffffff' }} />
      </View>

      {/* Nested Views */}
      <View backgroundColor={0x9b59b6} padding={15} cornerRadius={12}>
        <View backgroundColor={0xecf0f1} padding={10} cornerRadius={8}>
          <Text text="Nested Views" style={{ color: '#2c3e50' }} />
        </View>
      </View>
    </View>
  )
}
