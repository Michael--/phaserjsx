/**
 * View Borders & Styling Example - Borders, corner radius, and opacity
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function BordersStylingViewExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Basic border */}
      <View
        backgroundColor={0xecf0f1}
        borderWidth={2}
        borderColor={0x3498db}
        width={200}
        height={60}
        padding={10}
      >
        <Text text="Border: 2px blue" style={{ color: '#2c3e50' }} />
      </View>

      {/* Rounded corners */}
      <View backgroundColor={0x3498db} cornerRadius={12} width={200} height={60} padding={10}>
        <Text text="Rounded corners" style={{ color: '#ffffff' }} />
      </View>

      {/* Border + Rounded */}
      <View
        backgroundColor={0xffffff}
        borderWidth={3}
        borderColor={0xe74c3c}
        cornerRadius={20}
        width={200}
        height={60}
        padding={10}
      >
        <Text text="Border + Rounded" style={{ color: '#e74c3c' }} />
      </View>

      {/* Alpha transparency */}
      <View backgroundColor={0x9b59b6} backgroundAlpha={0.5} width={200} height={60} padding={10}>
        <Text text="50% transparent bg" style={{ color: '#ffffff' }} />
      </View>

      {/* Border with alpha */}
      <View
        backgroundColor={0xecf0f1}
        borderWidth={4}
        borderColor={0x2ecc71}
        borderAlpha={0.3}
        cornerRadius={8}
        width={200}
        height={60}
        padding={10}
      >
        <Text text="30% transparent border" style={{ color: '#2c3e50' }} />
      </View>
    </View>
  )
}
