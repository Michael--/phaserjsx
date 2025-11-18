import { Text, useState, View } from '@phaserjsx/ui'
import { ScrollView } from '../components'

function Content(props: { count: number; width: string }) {
  return (
    <View padding={0} gap={0}>
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
  )
}

/**
 *  Example of ScrollView usage, depending on props either vertical, horizontal or both scrolling is available
 * @param props title, count, width
 */
function ScrollExampleLocal(props: { title: string; count: number; width: string }) {
  return (
    <View padding={0} alignItems="center">
      <Text text={props.title} style={{ fontSize: 16, color: 'orange' }} />
      {/** Border around ScrollView to visualize its bounds */}
      <View borderColor={0xffffff} borderWidth={2} padding={2}>
        <View width={200} height={400} padding={0}>
          <ScrollView>
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

function ScrollExampleSliderLocal(props: { title: string; count: number; width: string }) {
  const [scroll, setScroll] = useState({ scrollX: 0, scrollY: 0, width: 0, height: 0 })

  const scrollHeight = (400 * scroll.height) / 100
  const newScrollY = (scroll.scrollY / 100) * (400 - scrollHeight)
  //console.log('newScrollY', scroll)

  return (
    <View padding={0} alignItems="center">
      <Text text={props.title} style={{ fontSize: 16, color: 'orange' }} />
      {/** Border around ScrollView to visualize its bounds */}
      <View borderColor={0xffffff} borderWidth={2} padding={2} direction="row" gap={0}>
        <View width={200} height={400} padding={0}>
          <ScrollView
            onScroll={(x, y, w, h) => setScroll({ scrollX: x, scrollY: y, width: w, height: h })}
          >
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
        <View width={24} height={400} backgroundColor={0xdddddd} padding={1} direction="stack">
          <View width={'fill'} height={'fill'} backgroundColor={0xaaaaaa}></View>
          <View
            width={'fill'}
            x={1}
            y={newScrollY}
            height={scrollHeight}
            backgroundColor={0xeeeebb}
          ></View>
        </View>
      </View>
    </View>
  )
}

export function ScrollExample() {
  return (
    /** inherit all default theme */
    <View>
      {/** disable padding for only the next */}
      <View direction="row">
        <ScrollExampleLocal title="Scroll Y" count={20} width="100%" />
        <ScrollExampleLocal title="Scroll X" count={5} width="120%" />
        <ScrollExampleLocal title="Scroll X+Y" count={20} width="120%" />
      </View>
      {/** disable padding for only the next */}
      <View direction="row">
        <ScrollExampleSliderLocal title="V-Slider" count={20} width="100%" />
      </View>
    </View>
  )
}
