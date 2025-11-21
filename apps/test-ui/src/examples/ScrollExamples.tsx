import { Text, useState, useThemeTokens, View } from '@phaserjsx/ui'
import { Button, ScrollView } from '../components'
import { ScrollSlider } from '../components/ScrollSlider'
import { Spacer } from '../components/Spacer'

function ListButton(props: { index: number }) {
  const [count, setCount] = useState(0)
  return (
    <View key={props.index} justifyContent="center" alignItems="center" direction="row">
      <Spacer />
      <Button
        size="small"
        text={`Button ${props.index + 1}`}
        onClick={() => {
          setCount(count + 1)
        }}
      />
      <Text text={`${count}`} />
    </View>
  )
}
function Content(props: { count: number; width: string }) {
  const tokens = useThemeTokens()
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
        backgroundColor={
          index % 2 === 0
            ? tokens?.colors.error.dark.toNumber()
            : tokens?.colors.success.dark.toNumber()
        }
        backgroundAlpha={1.0}
        justifyContent="center"
        alignItems="center"
      >
        <Text text={`Item ${index + 1}`} style={tokens?.textStyles.medium} />
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
  const tokens = useThemeTokens()

  return (
    <View padding={0} alignItems="center">
      <Text text={props.title} style={tokens?.textStyles.large} />
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
  const tokens = useThemeTokens()
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
      <Text text={props.title} style={tokens?.textStyles.large} />
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
  // define the view and content sizes for scroll calculations
  const viewSize = 200
  const contentSize = 300
  const rect = 50

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
    const vh = viewSize
    const ch = vh / (scroll.height / 100)
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (percent / 100) * maxScrollY
    setScroll({ ...scroll, dy, scrollY: percent })
  }

  const handleHScroll = (percent: number) => {
    const vw = viewSize
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
            height={viewSize + 4}
            width={viewSize + 4}
            borderColor={0xffffff}
            borderWidth={2}
            padding={2}
            direction="row"
            gap={0}
          >
            <View width={viewSize} height={viewSize} padding={0}>
              <ScrollView scroll={scroll} onScroll={handleScroll}>
                <View
                  direction="stack"
                  width={contentSize}
                  height={contentSize}
                  padding={0}
                  backgroundColor={0x444400}
                >
                  <View x={0} y={0} width={rect} height={rect} backgroundColor={0xff00000}></View>
                  <View
                    x={(contentSize - rect) / 2}
                    y={(contentSize - rect) / 2}
                    width={rect}
                    height={rect}
                    backgroundColor={0xff00000}
                  ></View>
                  <View
                    x={contentSize - rect}
                    y={contentSize - rect}
                    width={rect}
                    height={rect}
                    backgroundColor={0xff00000}
                  ></View>
                </View>
              </ScrollView>
            </View>
          </View>
          <ScrollSlider
            direction="vertical"
            trackSize={viewSize}
            scrollInfo={scroll}
            onScroll={handleVScroll}
          />
        </View>
        {/** Horizontal slider */}
        <ScrollSlider
          direction="horizontal"
          trackSize={viewSize}
          scrollInfo={scroll}
          onScroll={handleHScroll}
        />
        <Button
          variant="primary"
          text="Scroll to left/top"
          onClick={() => setScroll({ ...scroll, dx: 0, dy: 0, scrollX: 0, scrollY: 0 })}
        />
        <Button
          variant="primary"
          text="Scroll to center"
          onClick={() =>
            setScroll({
              ...scroll,
              dx: (contentSize - viewSize) / 2,
              dy: (contentSize - viewSize) / 2,
              scrollX: 50,
              scrollY: 50,
            })
          }
        />
        <Button
          variant="primary"
          text="Scroll to bottom/right"
          onClick={() =>
            setScroll({
              ...scroll,
              dx: contentSize - viewSize,
              dy: contentSize - viewSize,
              scrollX: 100,
              scrollY: 100,
            })
          }
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
