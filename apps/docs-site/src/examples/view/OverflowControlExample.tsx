/**
 * View Overflow Control Example - Clipping content with overflow
 */
/** @jsxImportSource @number10/phaserjsx */
import { ScrollView, Text, View } from '@number10/phaserjsx'

export function OverflowControlViewExample() {
  return (
    <ScrollView>
      <View padding={20} gap={24} direction="column" justifyContent="start" alignItems="stretch">
        <View direction="column" gap={8}>
          <Text text="overflow='visible' (default)" style={{ color: '#ffffff' }} />
          <Text
            text="Content extends beyond container bounds"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View backgroundColor={0x2c3e50} padding={10} overflow="visible" width={200} height={100}>
            <View backgroundColor={0x3498db} width={250} height={100}>
              <Text text="This box is larger" style={{ color: '#ffffff', fontSize: '12px' }} />
              <Text text="than its container" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="overflow='hidden'" style={{ color: '#ffffff' }} />
          <Text
            text="Content clipped at container boundaries"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View backgroundColor={0x2c3e50} padding={10} overflow="hidden" width={200} height={100}>
            <View backgroundColor={0xe74c3c} width={250} height={120}>
              <Text text="This box is larger" style={{ color: '#ffffff', fontSize: '12px' }} />
              <Text text="but gets clipped" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Use Case: Masked Content" style={{ color: '#ffffff' }} />
          <View
            backgroundColor={0x34495e}
            padding={0}
            overflow="hidden"
            cornerRadius={12}
            width={200}
            height={120}
          >
            <View backgroundColor={0x9b59b6} width={'fill'} height={60} padding={10}>
              <Text text="Header" style={{ color: '#ffffff' }} />
            </View>
            <View backgroundColor={0x2ecc71} width={'fill'} height={60} padding={10}>
              <Text text="Body" style={{ color: '#ffffff' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Use Case: Image Crop" style={{ color: '#ffffff' }} />
          <View
            backgroundColor={0x1abc9c}
            overflow="hidden"
            cornerRadius={50}
            width={100}
            height={100}
          >
            <View backgroundColor={0xf39c12} width={150} height={150} x={-25} y={-25}>
              <Text text="Circle" style={{ color: '#ffffff', fontSize: '24px' }} />
              <Text text="Crop" style={{ color: '#ffffff', fontSize: '16px' }} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
