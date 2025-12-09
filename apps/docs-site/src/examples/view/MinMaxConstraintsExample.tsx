/**
 * View Min/Max Constraints Example - Size boundaries for responsive layouts
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View } from '@number10/phaserjsx'

export function MinMaxConstraintsViewExample() {
  return (
    <View
      padding={20}
      gap={16}
      justifyContent="center"
      alignItems="center"
      width="fill"
      height="fill"
      flexWrap="wrap"
    >
      {/* minWidth constraint */}
      <View backgroundColor={0x3498db} minWidth={200} padding={10}>
        <Text text="minWidth={200}" style={{ color: '#ffffff' }} />
        <Text text="Content is narrow" style={{ color: '#ffffff', fontSize: '12px' }} />
      </View>

      {/* maxWidth constraint */}
      <View backgroundColor={0xe74c3c} maxWidth={150} padding={10}>
        <Text
          text="maxWidth={150} - This text will drawn outside container if too long"
          style={{ color: '#ffffff', fontSize: '12px' }}
        />
      </View>

      {/* minWidth + maxWidth together */}
      <View backgroundColor={0x2ecc71} minWidth={180} maxWidth={220} padding={10}>
        <Text text="min={180} max={220}" style={{ color: '#ffffff' }} />
        <Text text="Flexible within range" style={{ color: '#ffffff', fontSize: '12px' }} />
      </View>

      {/* minHeight constraint */}
      <View backgroundColor={0x9b59b6} minHeight={80} width={200} padding={10}>
        <Text text="minHeight={80}" style={{ color: '#ffffff' }} />
      </View>

      {/* maxHeight constraint */}
      <View backgroundColor={0xf39c12} maxHeight={60} width={200} padding={10}>
        <Text text="maxHeight={60}" style={{ color: '#ffffff' }} />
        <Text text="Content may overflow" style={{ color: '#ffffff', fontSize: '10px' }} />
      </View>

      {/* All constraints combined */}
      <View
        backgroundColor={0x34495e}
        minWidth={180}
        maxWidth={250}
        minHeight={70}
        maxHeight={100}
        padding={10}
      >
        <Text text="All constraints" style={{ color: '#ffffff' }} />
        <Text text="min/max for both dimensions" style={{ color: '#ecf0f1', fontSize: '12px' }} />
      </View>
    </View>
  )
}
