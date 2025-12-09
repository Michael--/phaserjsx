/**
 * View Alpha & Visibility Example - Opacity and visibility control
 */
/** @jsxImportSource @number10/phaserjsx */
import { ScrollView, Text, View } from '@number10/phaserjsx'

export function AlphaVisibilityViewExample() {
  return (
    <ScrollView>
      <View padding={20} gap={24} direction="column" justifyContent="start" alignItems="stretch">
        <View direction="column" gap={8}>
          <Text text="Alpha (Opacity) Control" style={{ color: '#ffffff' }} />
          <Text
            text="alpha prop controls transparency (0 = invisible, 1 = opaque)"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View direction="row" gap={12} flexWrap="wrap">
            <View backgroundColor={0x3498db} width={100} height={80} padding={10} alpha={1}>
              <Text text="alpha={1}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0x3498db} width={100} height={80} padding={10} alpha={0.8}>
              <Text text="alpha={0.8}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0x3498db} width={100} height={80} padding={10} alpha={0.6}>
              <Text text="alpha={0.6}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0x3498db} width={100} height={80} padding={10} alpha={0.4}>
              <Text text="alpha={0.4}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0x3498db} width={100} height={80} padding={10} alpha={0.2}>
              <Text text="alpha={0.2}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0x3498db} width={100} height={80} padding={10} alpha={0}>
              <Text text="alpha={0}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="visible prop (Show/Hide/None)" style={{ color: '#ffffff' }} />
          <Text
            text="visible={'none'} completely removes from rendering"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View direction="row" gap={12} alignItems="center">
            <View backgroundColor={0x2ecc71} width={120} height={80} padding={10} visible={true}>
              <Text text="visible={true}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0xe74c3c} width={120} height={80} padding={10} visible={'none'}>
              <Text text="visible={'none'}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View backgroundColor={0x9b59b6} width={120} height={80} padding={10} visible={true}>
              <Text text="visible={true}" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
          <Text
            text="Note: Middle box (red) is not rendered at all"
            style={{ color: '#95a5a6', fontSize: '11px' }}
          />
        </View>

        <View direction="column" gap={8}>
          <Text text="Alpha vs Visible Comparison" style={{ color: '#ffffff' }} />
          <View
            backgroundColor={0x34495e}
            padding={16}
            direction="row"
            gap={16}
            justifyContent="space-around"
            flexWrap="wrap"
          >
            <View direction="column" gap={8} alignItems="center">
              <Text text="alpha={0}" style={{ color: '#ffffff', fontSize: '12px' }} />
              <View backgroundColor={0xf39c12} width={80} height={80} alpha={0} />
              <Text text="Still takes space" style={{ color: '#95a5a6', fontSize: '10px' }} />
            </View>

            <View direction="column" gap={8} alignItems="center">
              <Text text="visible={false}" style={{ color: '#ffffff', fontSize: '12px' }} />
              <View backgroundColor={0xf39c12} width={80} height={80} visible={false} />
              <Text text="Space taken" style={{ color: '#95a5a6', fontSize: '10px' }} />
            </View>

            <View direction="column" gap={8} alignItems="center">
              <Text text="visible={'none'}" style={{ color: '#ffffff', fontSize: '12px' }} />
              <View backgroundColor={0xf39c12} width={80} height={80} visible={'none'} />
              <Text text="No space taken" style={{ color: '#95a5a6', fontSize: '10px' }} />
            </View>

            <View direction="column" gap={8} alignItems="center">
              <Text text="alpha={1}" style={{ color: '#ffffff', fontSize: '12px' }} />
              <View backgroundColor={0xf39c12} width={80} height={80} alpha={1} />
              <Text text="Normal display" style={{ color: '#95a5a6', fontSize: '10px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Use Case: Fade Effect" style={{ color: '#ffffff' }} />
          <Text
            text="Simulate fade-in effect with multiple alpha values"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View
            backgroundColor={0x2c3e50}
            padding={16}
            direction="row"
            gap={8}
            justifyContent="center"
          >
            <View backgroundColor={0x1abc9c} width={60} height={60} cornerRadius={30} alpha={0.2} />
            <View backgroundColor={0x1abc9c} width={60} height={60} cornerRadius={30} alpha={0.4} />
            <View backgroundColor={0x1abc9c} width={60} height={60} cornerRadius={30} alpha={0.6} />
            <View backgroundColor={0x1abc9c} width={60} height={60} cornerRadius={30} alpha={0.8} />
            <View backgroundColor={0x1abc9c} width={60} height={60} cornerRadius={30} alpha={1} />
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Nested Alpha (Multiplicative)" style={{ color: '#ffffff' }} />
          <Text
            text="Child alpha is multiplied with parent alpha"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View backgroundColor={0x34495e} padding={16} alpha={0.5}>
            <Text text="Parent alpha={0.5}" style={{ color: '#ffffff', fontSize: '12px' }} />
            <View backgroundColor={0x3498db} padding={12} margin={8} alpha={0.5}>
              <Text text="Child alpha={0.5}" style={{ color: '#ffffff', fontSize: '11px' }} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
