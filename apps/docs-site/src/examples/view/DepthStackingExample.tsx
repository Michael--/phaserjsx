/**
 * View Depth Stacking Example - Z-Index control with depth property
 */
/** @jsxImportSource @phaserjsx/ui */
import { ScrollView, Text, View, WrapText } from '@phaserjsx/ui'

export function DepthStackingViewExample() {
  return (
    <ScrollView>
      <View padding={20} gap={24} direction="column" justifyContent="start" alignItems="stretch">
        <View direction="column" gap={8}>
          <Text text="Overlapping Cards with depth" style={{ color: '#ffffff' }} />
          <Text
            text="Higher depth values render on top"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View width={400} height={200} direction="stack">
            <View
              backgroundColor={0x3498db}
              width={150}
              height={120}
              padding={12}
              cornerRadius={8}
              x={0}
              y={0}
              depth={1}
            >
              <Text text="depth={1}" style={{ color: '#ffffff', fontSize: '14px' }} />
              <Text text="Blue Card" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View
              backgroundColor={0xe74c3c}
              width={150}
              height={120}
              padding={12}
              cornerRadius={8}
              x={60}
              y={40}
              depth={2}
            >
              <Text text="depth={2}" style={{ color: '#ffffff', fontSize: '14px' }} />
              <Text text="Red Card" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View
              backgroundColor={0x2ecc71}
              width={150}
              height={120}
              padding={12}
              cornerRadius={8}
              x={120}
              y={80}
              depth={3}
            >
              <Text text="depth={3}" style={{ color: '#ffffff', fontSize: '14px' }} />
              <Text text="Green Card" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Tooltip Overlay" style={{ color: '#ffffff' }} />
          <Text
            text="Tooltip with higher depth appears above content"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View
            backgroundColor={0x34495e}
            width={300}
            height={150}
            padding={16}
            cornerRadius={8}
            direction="stack"
          >
            <View
              backgroundColor={0x3498db}
              padding={12}
              cornerRadius={6}
              width={120}
              height={40}
              depth={1}
            >
              <Text text="Hover Target" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>

            <View
              backgroundColor={0x2c3e50}
              padding={10}
              cornerRadius={6}
              borderWidth={1}
              borderColor={0x95a5a6}
              width={180}
              x={80}
              y={-20}
              depth={10}
            >
              <Text text="Tooltip (depth=10)" style={{ color: '#ffffff', fontSize: '11px' }} />
              <Text text="Appears on top" style={{ color: '#95a5a6', fontSize: '10px' }} />
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Modal / Dialog Pattern" style={{ color: '#ffffff' }} />
          <Text
            text="Modal overlay with high depth covers content"
            style={{ color: '#aaaaaa', fontSize: '12px' }}
          />
          <View width={350} height={250} direction="stack">
            <View
              backgroundColor={0x34495e}
              width={'fill'}
              height={'fill'}
              padding={16}
              cornerRadius={8}
              depth={1}
            >
              <Text text="Page Content" style={{ color: '#ffffff', fontSize: '14px' }} />
              <Text
                text="Background content below modal"
                style={{ color: '#95a5a6', fontSize: '12px' }}
              />
            </View>

            <View
              backgroundColor={0x000000}
              backgroundAlpha={0.7}
              width={'fill'}
              height={'fill'}
              x={0}
              y={0}
              depth={100}
              justifyContent="center"
              alignItems="center"
            >
              <View
                backgroundColor={0x2c3e50}
                width={250}
                padding={20}
                cornerRadius={12}
                direction="column"
                gap={12}
                depth={101}
              >
                <Text text="Modal Dialog" style={{ color: '#ffffff', fontSize: '16px' }} />
                <WrapText
                  text="This modal has depth={101} and appears above the backdrop"
                  style={{ color: '#bdc3c7', fontSize: '12px' }}
                />
                <View backgroundColor={0x3498db} padding={10} cornerRadius={6} alignItems="center">
                  <Text text="Confirm" style={{ color: '#ffffff', fontSize: '12px' }} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View direction="column" gap={8}>
          <Text text="Badge / Notification Pattern" style={{ color: '#ffffff' }} />
          <View
            backgroundColor={0x34495e}
            width={100}
            height={100}
            cornerRadius={12}
            justifyContent="center"
            alignItems="center"
            direction="stack"
          >
            <Text text="Avatar" style={{ color: '#ffffff', fontSize: '14px' }} />

            <View
              backgroundColor={0xe74c3c}
              width={28}
              height={28}
              cornerRadius={14}
              justifyContent="center"
              alignItems="center"
              x={30}
              y={-30}
              depth={5}
            >
              <Text text="3" style={{ color: '#ffffff', fontSize: '12px' }} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
