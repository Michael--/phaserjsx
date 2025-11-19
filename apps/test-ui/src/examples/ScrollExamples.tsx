import { Text, useRef, useState, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { ScrollView } from '../components'
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
        onTouch={(e) => {
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

function Slider(props: {
  scroll: { scrollX: number; scrollY: number; width: number; height: number }
  trackHeight: number
  onScroll: (scrollY: number) => void
}) {
  const scrollHeight = (props.trackHeight * props.scroll.height) / 100
  const newScrollY = (props.scroll.scrollY / 100) * (props.trackHeight - scrollHeight)
  const sliderRef = useRef<Phaser.GameObjects.Container | null>(null)
  const isDraggingRef = useRef(false)

  const handleThumbTouchMove = (data: { dy?: number; state?: string }) => {
    if (data.state === 'start') {
      isDraggingRef.current = true
      return
    }

    if (data.state === 'end') {
      isDraggingRef.current = false
      return
    }

    if (!isDraggingRef.current || !data.dy) return

    const thumbRange = props.trackHeight - scrollHeight
    const currentThumbY = (props.scroll.scrollY / 100) * thumbRange
    const newThumbY = Math.max(0, Math.min(thumbRange, currentThumbY + data.dy))
    const newScrollYPercent = thumbRange > 0 ? (newThumbY / thumbRange) * 100 : 0

    props.onScroll(newScrollYPercent)
  }

  const handleBackgroundTouch = (data: { localY: number }) => {
    const effectiveHeight = props.trackHeight - 2
    const normalizedY = (data.localY - 1) / effectiveHeight
    const targetScrollY = Math.max(0, Math.min(100, normalizedY * 100))
    props.onScroll(targetScrollY)
  }

  return (
    <View
      ref={sliderRef}
      width={24}
      height={props.trackHeight}
      backgroundColor={0xdddddd}
      direction="stack"
      padding={1}
    >
      <View
        width={'fill'}
        height={'fill'}
        backgroundColor={0xaaaaaa}
        enableGestures={true}
        onTouch={handleBackgroundTouch}
      ></View>
      <View
        width={'fill'}
        x={1}
        y={newScrollY}
        height={scrollHeight}
        backgroundColor={0xeeeebb}
        enableGestures={true}
        onTouchMove={handleThumbTouchMove}
      ></View>
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

  const handleScrollViewScroll = (x: number, y: number, w: number, h: number) => {
    // Calculate absolute scroll positions from percentages
    const contentHeight = 400 / (h / 100)
    const maxScrollY = contentHeight - 400
    const dy = (y / 100) * maxScrollY

    const contentWidth = 200 / (w / 100)
    const maxScrollX = contentWidth - 200
    const dx = (x / 100) * maxScrollX

    setScroll({ dx, dy, scrollX: x, scrollY: y, width: w, height: h })
  }

  const handleSliderScroll = (scrollYPercent: number) => {
    const contentHeight = 400 / (scroll.height / 100)
    const maxScrollY = contentHeight - 400
    const dy = (scrollYPercent / 100) * maxScrollY

    setScroll({ ...scroll, dy, scrollY: scrollYPercent })
  }

  return (
    <View padding={0} alignItems="center">
      <Text text={props.title} style={{ fontSize: 16, color: 'orange' }} />
      {/** Border around ScrollView to visualize its bounds */}
      <View borderColor={0xffffff} borderWidth={2} padding={2} direction="row" gap={0}>
        <View width={200} height={400} padding={0}>
          <ScrollView scroll={scroll} onScroll={handleScrollViewScroll}>
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
        <Slider scroll={scroll} trackHeight={400} onScroll={handleSliderScroll} />
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

  const handleScrollViewScroll = (x: number, y: number, w: number, h: number) => {
    // Calculate absolute scroll positions from percentages
    const contentHeight = 200 / (h / 100)
    const maxScrollY = contentHeight - 200
    const dy = (y / 100) * maxScrollY

    const contentWidth = 200 / (w / 100)
    const maxScrollX = contentWidth - 200
    const dx = (x / 100) * maxScrollX

    setScroll({ dx, dy, scrollX: x, scrollY: y, width: w, height: h })
  }

  const handleSliderScroll = (scrollYPercent: number) => {
    const contentHeight = 200 / (scroll.height / 100)
    const maxScrollY = contentHeight - 200
    const dy = (scrollYPercent / 100) * maxScrollY

    setScroll({ ...scroll, dy, scrollY: scrollYPercent })
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
              <ScrollView scroll={scroll} onScroll={handleScrollViewScroll}>
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
          <Slider scroll={scroll} trackHeight={200} onScroll={handleSliderScroll} />
        </View>
        {/** Adjust to be a horizontal slider in Slider itself (not yet supported) */}
        <Slider scroll={scroll} trackHeight={200} onScroll={handleSliderScroll} />
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
