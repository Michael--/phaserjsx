import { createTheme, Text, View } from '@phaserjsx/ui'
import { ScrollView } from '../components'

/**
 *  Example of ScrollView usage, depending on props either vertical, horizontal or both scrolling is available
 * @param props title, count, width
 */
function ScrollExampleLocal(props: { title: string; count: number; width: string }) {
  return (
    <View
      backgroundColor={0x222222}
      backgroundAlpha={1.0}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      gap={10}
      alignItems="center"
    >
      <Text text={props.title} style={{ fontSize: 16, color: 'orange' }} />
      {/** X: The overall example container, this is always a part of the user code */}
      <View width={200} height={400}>
        <ScrollView>
          <View>
            {/** C: At least the content */}
            {Array.from({ length: props.count }).map((_, index) => (
              <View
                key={index}
                width={props.width}
                height={50}
                backgroundColor={index % 2 === 0 ? 0xaa0000 : 0x00aa00}
                backgroundAlpha={1.0}
                justifyContent="center"
                alignItems="center"
              >
                <Text text={`Item ${index + 1}`} style={{ fontSize: 14, color: 'white' }} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export function ScrollExample() {
  return (
    /** inherit all default theme */
    <View>
      {/** disable padding for only the next */}
      <View direction="row" theme={createTheme({ View: { padding: 0 } })}>
        <ScrollExampleLocal title="Scroll Y" count={20} width="100%" />
        <ScrollExampleLocal title="Scroll X" count={5} width="120%" />
        <ScrollExampleLocal title="Scroll X+Y" count={20} width="120%" />
      </View>
    </View>
  )
}
