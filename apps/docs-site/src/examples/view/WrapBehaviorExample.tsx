/**
 * View Wrap Behavior Example - flexWrap for responsive layouts
 */
/** @jsxImportSource @number10/phaserjsx */
import { ScrollView, Text, View } from '@number10/phaserjsx'

export function WrapBehaviorViewExample() {
  return (
    <ScrollView>
      <View padding={20} gap={24} direction="column" justifyContent="start" alignItems="stretch">
        <View direction="column" gap={8}>
          <Text text="flexWrap='wrap' (default)" style={{ color: '#ffffff' }} />
          <Text
            text="Items wrap to next line when space runs out"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View
            backgroundColor={0x2c3e50}
            padding={10}
            direction="row"
            flexWrap="wrap"
            gap={8}
            width={350}
          >
            <View backgroundColor={0x3498db} width={80} height={60}>
              <Text text="Item 1" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0xe74c3c} width={80} height={60}>
              <Text text="Item 2" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0x2ecc71} width={80} height={60}>
              <Text text="Item 3" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0x9b59b6} width={80} height={60}>
              <Text text="Item 4" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0xf39c12} width={80} height={60}>
              <Text text="Item 5" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="flexWrap='nowrap'" style={{ color: '#ffffff' }} />
          <Text
            text="Items stay in single line, may overflow container"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View
            backgroundColor={0x2c3e50}
            padding={10}
            direction="row"
            flexWrap="nowrap" // default when this props is omitted
            gap={8}
            width={350}
          >
            <View backgroundColor={0x3498db} width={80} height={60}>
              <Text text="Item 1" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0xe74c3c} width={80} height={60}>
              <Text text="Item 2" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0x2ecc71} width={80} height={60}>
              <Text text="Item 3" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0x9b59b6} width={80} height={60}>
              <Text text="Item 4" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
            <View backgroundColor={0xf39c12} width={80} height={60}>
              <Text text="Item 5" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Use Case: Tag List" style={{ color: '#ffffff' }} />
          <View
            backgroundColor={0x34495e}
            padding={12}
            direction="row"
            flexWrap="wrap"
            gap={6}
            width={400}
          >
            <View backgroundColor={0x3498db} padding={8} cornerRadius={4}>
              <Text text="React" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
            <View backgroundColor={0xe74c3c} padding={8} cornerRadius={4}>
              <Text text="TypeScript" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
            <View backgroundColor={0x2ecc71} padding={8} cornerRadius={4}>
              <Text text="Phaser" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
            <View backgroundColor={0x9b59b6} padding={8} cornerRadius={4}>
              <Text text="Vite" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
            <View backgroundColor={0xf39c12} padding={8} cornerRadius={4}>
              <Text text="Node.js" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
            <View backgroundColor={0x1abc9c} padding={8} cornerRadius={4}>
              <Text text="UI Library" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
