/**
 * ScrollView Slider Size Example - Compare all sliderSize variants
 */
/** @jsxImportSource @number10/phaserjsx */
import { ScrollView, Text, View, type SliderSize } from '@number10/phaserjsx'

const sizes: Array<{ label: string; value: SliderSize }> = [
  { label: 'large', value: 'large' },
  { label: 'medium', value: 'medium' },
  { label: 'small', value: 'small' },
  { label: 'tiny', value: 'tiny' },
  { label: 'micro', value: 'micro' },
  { label: 'nano', value: 'nano' },
]

function SizeCard(props: { key?: string; label: string; value: SliderSize }) {
  return (
    <View direction="column" gap={6} alignItems="center">
      <Text text={props.label} style={{ color: '#ffffff', fontSize: '12px' }} />
      <View
        width={112}
        height={118}
        backgroundColor={0x1f2937}
        borderColor={0x4b5563}
        borderWidth={1}
        cornerRadius={6}
      >
        <ScrollView showVerticalSlider={true} showHorizontalSlider={false} sliderSize={props.value}>
          <View direction="column" gap={6} padding={8}>
            {Array.from({ length: 9 }, (_, i) => (
              <View
                key={i}
                padding={{ left: 8, right: 8, top: 6, bottom: 6 }}
                backgroundColor={i % 2 === 0 ? 0xf8fafc : 0xe5e7eb}
                cornerRadius={4}
              >
                <Text text={`Row ${i + 1}`} style={{ color: '#374151', fontSize: '11px' }} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export function SliderSizeScrollViewExample() {
  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      direction="row"
      gap={14}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      {sizes.map((size) => (
        <SizeCard key={size.label} label={size.label} value={size.value} />
      ))}
    </View>
  )
}
