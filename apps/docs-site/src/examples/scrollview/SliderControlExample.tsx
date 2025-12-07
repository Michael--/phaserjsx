/**
 * ScrollView Slider Control Example - Custom slider visibility and sizing
 */
/** @jsxImportSource @phaserjsx/ui */
import { ScrollView, Text, View } from '@phaserjsx/ui'

export function SliderControlScrollViewExample() {
  return (
    <View direction="row" gap={16} padding={20}>
      {/* Auto slider (default) */}
      <View direction="column" gap={8}>
        <Text text="Auto Slider" style={{ fontSize: '14px' }} />
        <View width={200} height={250} backgroundColor={0xf0f0f0} padding={1}>
          <ScrollView showVerticalSlider="auto">
            <View direction="column" gap={8} padding={12}>
              {Array.from({ length: 15 }, (_, i) => (
                <View key={i} padding={12} backgroundColor={0xffffff} cornerRadius={4}>
                  <Text text={`Item ${i + 1}`} style={{ fontSize: '14px', color: '#666' }} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Always show slider */}
      <View direction="column" gap={8}>
        <Text text="Always Visible" style={{ fontSize: '14px' }} />
        <View width={200} height={250} backgroundColor={0xf0f0f0} padding={1}>
          <ScrollView showVerticalSlider={true}>
            <View direction="column" gap={8} padding={12}>
              {Array.from({ length: 3 }, (_, i) => (
                <View key={i} padding={12} backgroundColor={0xffffff} cornerRadius={4}>
                  <Text text={`Item ${i + 1}`} style={{ fontSize: '14px', color: '#666' }} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Hidden slider */}
      <View direction="column" gap={8}>
        <Text text="Hidden Slider" style={{ fontSize: '14px' }} />
        <View width={200} height={250} backgroundColor={0xf0f0f0} padding={1}>
          <ScrollView showVerticalSlider={false}>
            <View direction="column" gap={8} padding={12}>
              {Array.from({ length: 15 }, (_, i) => (
                <View key={i} padding={12} backgroundColor={0xffffff} cornerRadius={4}>
                  <Text text={`Item ${i + 1}`} style={{ fontSize: '14px', color: '#666' }} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
