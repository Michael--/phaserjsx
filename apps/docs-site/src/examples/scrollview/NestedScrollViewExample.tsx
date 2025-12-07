/**
 * ScrollView Nested Example - ScrollViews within ScrollViews
 */
/** @jsxImportSource @phaserjsx/ui */
import { ScrollView, Text, View } from '@phaserjsx/ui'

export function NestedScrollViewExample() {
  return (
    <View width={'fill'} height={'fill'} padding={20}>
      {/* Outer vertical scroll */}
      <View width={'fill'} height={'fill'} backgroundColor={0xf0f0f0} padding={1}>
        <ScrollView>
          <View direction="column" gap={12} padding={12} width={'80%'}>
            <Text text="Outer ScrollView (Vertical)" style={{ fontSize: '18px', color: '#333' }} />

            {/* Card 1 with horizontal scroll */}
            <View
              direction="column"
              gap={8}
              backgroundColor={0xffffff}
              padding={16}
              cornerRadius={8}
            >
              <Text text="Horizontal Scroll Section" style={{ fontSize: '14px', color: '#666' }} />
              <View width={'fill'} height={120} backgroundColor={0xf9f9f9} cornerRadius={4}>
                <ScrollView showHorizontalSlider showVerticalSlider={false}>
                  <View direction="row" gap={8} padding={8}>
                    {Array.from({ length: 15 }, (_, i) => (
                      <View
                        key={i}
                        width={100}
                        height={80}
                        backgroundColor={0x4a9eff}
                        cornerRadius={4}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text text={`${i + 1}`} style={{ fontSize: '20px', color: '#fff' }} />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* Card 2 with vertical scroll */}
            <View
              direction="column"
              gap={8}
              backgroundColor={0xffffff}
              padding={16}
              cornerRadius={8}
            >
              <Text text="Nested Vertical Scroll" style={{ fontSize: '14px', color: '#666' }} />
              <View width={'fill'} height={200} backgroundColor={0xf9f9f9} cornerRadius={4}>
                <ScrollView>
                  <View direction="column" gap={8} padding={8}>
                    {Array.from({ length: 20 }, (_, i) => (
                      <View
                        key={i}
                        padding={12}
                        backgroundColor={0xffffff}
                        cornerRadius={4}
                        borderWidth={1}
                        borderColor={0xe0e0e0}
                      >
                        <Text
                          text={`Nested Item ${i + 1}`}
                          style={{ fontSize: '14px', color: '#666' }}
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* Card 3 with both directions */}
            <View
              direction="column"
              gap={8}
              backgroundColor={0xffffff}
              padding={16}
              cornerRadius={8}
            >
              <Text text="Nested Both Directions" style={{ fontSize: '14px', color: '#666' }} />
              <View width={'fill'} height={180} backgroundColor={0xf9f9f9} cornerRadius={4}>
                <ScrollView showVerticalSlider showHorizontalSlider>
                  <View direction="column" gap={8} padding={8}>
                    {Array.from({ length: 8 }, (_, row) => (
                      <View key={row} direction="row" gap={8}>
                        {Array.from({ length: 8 }, (_, col) => (
                          <View
                            key={col}
                            width={80}
                            height={60}
                            backgroundColor={0x10b981}
                            cornerRadius={4}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text
                              text={`${row + 1},${col + 1}`}
                              style={{ fontSize: '12px', color: '#fff' }}
                            />
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* More content to make outer scroll work */}
            {...Array.from({ length: 5 }, (_, i) => (
              <View key={i} padding={16} backgroundColor={0xffffff} cornerRadius={8} minHeight={80}>
                <Text
                  text={`Additional Card ${i + 1}`}
                  style={{ fontSize: '16px', color: '#678' }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
