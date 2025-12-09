/**
 * ScrollView Both Directions Example - Horizontal and vertical scrolling
 */
/** @jsxImportSource @number10/phaserjsx */
import { ScrollView, Text, View } from '@number10/phaserjsx'

export function BothDirectionsScrollViewExample() {
  return (
    <View direction="stack" width={'100%'} height={'100%'} padding={20}>
      <View width={'70%'} height={'100%'} backgroundColor={0x0} borderColor={0xffffff}>
        <ScrollView showVerticalSlider showHorizontalSlider>
          <View direction="column" gap={8} padding={12}>
            {Array.from({ length: 10 }, (_, row) => (
              <View key={row} direction="row" gap={8}>
                {Array.from({ length: 10 }, (_, col) => (
                  <View
                    key={col}
                    width={120}
                    height={80}
                    backgroundColor={0xffffff}
                    cornerRadius={4}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      text={`${row + 1},${col + 1}`}
                      style={{ fontSize: '14px', color: '#666' }}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
