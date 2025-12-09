/**
 * ScrollView Quick Start Example - Basic scrollable content
 */
/** @jsxImportSource @number10/phaserjsx */
import { ScrollView, Text, View } from '@number10/phaserjsx'

export function QuickStartScrollViewExample() {
  return (
    <View direction="stack" width={'100%'} height={'100%'} padding={20}>
      <View width={'30%'} height={'100%'} backgroundColor={0x0} borderColor={0xffffff}>
        <ScrollView>
          <View direction="column" gap={12} padding={12}>
            {Array.from({ length: 20 }, (_, i) => (
              <View
                key={i}
                padding={16}
                backgroundColor={0x888888}
                cornerRadius={8}
                minHeight={60}
                justifyContent="center"
              >
                <Text text={`Item ${i + 1}`} style={{ fontSize: '16px' }} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
