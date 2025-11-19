import type { GestureEventData } from '@phaserjsx/ui'
import { Text, useState, View } from '@phaserjsx/ui'
import { Button } from '../App'
import { ScrollView } from '../components'
import { ScrollSlider } from '../components/ScrollSlider'
import { Spacer } from '../components/Spacer'

function ListButton(props: { index: number }) {
  const [count, setCount] = useState(0)
  return (
    <View key={props.index} justifyContent="center" alignItems="center" direction="row">
      <Spacer />
      <View
        backgroundColor={0x0000aa}
        backgroundAlpha={1.0}
        enableGestures={true}
        onTouch={(e: GestureEventData) => {
          e.stopPropagation() // prevent bubble up to ScrollView
          setCount(count + 1)
        }}
      >
        <Text text={`Button ${props.index + 1}`} style={{ fontSize: 14, color: 'white' }} />
      </View>
      <Text text={`${count}`} style={{ fontSize: 12, color: 'yellow' }} />
    </View>
  )
}
function Content(props: { count: number; width: string }) {
  const entry = (index: number) => {
    if (index % 3 === 0) {
      // return a button like view
      return <ListButton index={index} />
    }
    return (
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
    )
  }
  return (
    <View padding={0} gap={0}>
      {Array.from({ length: props.count }).map((_, index) => entry(index))}
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
  const [scroll, setScroll] = useState({
    dx: 0,
    dy: 0,
    scrollX: 0,
    scrollY: 0,
    width: 0,
    height: 0,
  })

  const handleScroll = (x: number, y: number, vw: number, vh: number, cw: number, ch: number) => {
    // Calculate absolute scroll positions from percentages
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (y / 100) * maxScrollY

    const maxScrollX = Math.max(0, cw - vw)
    const dx = (x / 100) * maxScrollX

    setScroll({ dx, dy, scrollX: x, scrollY: y, width: (vw / cw) * 100, height: (vh / ch) * 100 })
  }

  const handleVScroll = (percent: number) => {
    const vh = 400
    const ch = vh / (scroll.height / 100)
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (percent / 100) * maxScrollY
    setScroll({ ...scroll, dy, scrollY: percent })
  }

  return (
    <View padding={0} alignItems="center">
      <Text text={props.title} style={{ fontSize: 16, color: 'orange' }} />
      {/** Border around ScrollView to visualize its bounds */}
      <View borderColor={0xffffff} borderWidth={2} padding={2} direction="row" gap={0}>
        <View width={200} height={400} padding={0}>
          <ScrollView scroll={scroll} onScroll={handleScroll}>
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
        <ScrollSlider
          direction="vertical"
          trackSize={400}
          scrollInfo={scroll}
          onScroll={handleVScroll}
        />
      </View>
    </View>
  )
}

function ScrollExampleSliderFullLocal(props: { title: string; width: string }) {
  const [scroll, setScroll] = useState({
    dx: 0,
    dy: 0,
    scrollX: 0,
    scrollY: 0,
    width: 0,
    height: 0,
  })

  const handleScroll = (x: number, y: number, vw: number, vh: number, cw: number, ch: number) => {
    // Calculate absolute scroll positions from percentages
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (y / 100) * maxScrollY

    const maxScrollX = Math.max(0, cw - vw)
    const dx = (x / 100) * maxScrollX

    setScroll({
      dx,
      dy,
      scrollX: x,
      scrollY: y,
      width: (vw / cw) * 100,
      height: (vh / ch) * 100,
    })
  }

  const handleVScroll = (percent: number) => {
    const vh = 200
    const ch = vh / (scroll.height / 100)
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (percent / 100) * maxScrollY
    setScroll({ ...scroll, dy, scrollY: percent })
  }

  const handleHScroll = (percent: number) => {
    const vw = 200
    const cw = vw / (scroll.width / 100)
    const maxScrollX = Math.max(0, cw - vw)
    const dx = (percent / 100) * maxScrollX
    setScroll({ ...scroll, dx, scrollX: percent })
  }

  return (
    <View padding={0} alignItems="center">
      <Text text={props.title} style={{ fontSize: 16, color: 'orange' }} />
      <View direction="column" gap={2} padding={0} margin={0}>
        <View direction="row" gap={2} padding={0} margin={0}>
          <View
            height={204}
            width={204}
            borderColor={0xffffff}
            borderWidth={2}
            padding={2}
            direction="row"
            gap={0}
          >
            <View width={200} height={200} padding={0}>
              <ScrollView scroll={scroll} onScroll={handleScroll}>
                <View
                  direction="stack"
                  width={300}
                  height={300}
                  padding={0}
                  backgroundColor={0x444400}
                >
                  <View x={0} y={0} width={50} height={50} backgroundColor={0xff00000}></View>
                  <View x={125} y={125} width={50} height={50} backgroundColor={0xff00000}></View>
                  <View x={250} y={250} width={50} height={50} backgroundColor={0xff00000}></View>
                </View>
              </ScrollView>
            </View>
          </View>
          <ScrollSlider
            direction="vertical"
            trackSize={200}
            scrollInfo={scroll}
            onScroll={handleVScroll}
          />
        </View>
        {/** Horizontal slider */}
        <ScrollSlider
          direction="horizontal"
          trackSize={200}
          scrollInfo={scroll}
          onScroll={handleHScroll}
        />
        <Button
          text="Scroll to left/top"
          onClick={() => setScroll({ ...scroll, dx: 0, dy: 0, scrollX: 0, scrollY: 0 })}
        />
        <Button
          text="Scroll to center"
          onClick={() => setScroll({ ...scroll, dx: 50, dy: 50, scrollX: 50, scrollY: 50 })}
        />
        <Button
          text="Scroll to bottom/right"
          onClick={() => setScroll({ ...scroll, dx: 100, dy: 100, scrollX: 100, scrollY: 100 })}
        />
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
        <ScrollExampleSliderFullLocal title="XY-Slider" width="100%" />
      </View>
    </View>
  )
}
