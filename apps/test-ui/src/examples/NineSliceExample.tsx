/**
 * NineSlice Example - demonstrates scalable UI elements using NineSlice
 */
import {
  createNineSliceRef,
  NineSlice,
  Text,
  useEffect,
  useRef,
  useState,
  View,
} from '@phaserjsx/ui'

/**
 * Reusable NineSlice button component with proper inner padding
 */
function NineSliceButton({
  texture,
  frame,
  text,
  onClick,
  width,
  height,
  leftWidth,
  rightWidth,
  topHeight,
  bottomHeight,
  fontSize = 24,
  color = '#ffffff',
  fontFamily = 'Arial',
}: {
  texture: string
  frame: string
  text: string
  onClick?: (() => void) | undefined
  width: number
  height: number
  leftWidth: number
  rightWidth: number
  topHeight: number
  bottomHeight: number
  fontSize?: number
  color?: string
  fontFamily?: string
}) {
  const ref = useRef<ReturnType<typeof createNineSliceRef> | null>(null)

  const handleRef = (node: Phaser.GameObjects.NineSlice | null) => {
    if (node) {
      ref.current = createNineSliceRef(node, {
        leftWidth,
        rightWidth,
        topHeight,
        bottomHeight,
      })
    } else {
      ref.current = null
    }
  }

  return (
    <View direction="stack" width={width} height={height} onPointerDown={onClick ?? (() => {})}>
      <NineSlice
        ref={handleRef}
        texture={texture}
        frame={frame}
        width="100%"
        height="100%"
        leftWidth={leftWidth}
        rightWidth={rightWidth}
        topHeight={topHeight}
        bottomHeight={bottomHeight}
      />
      <View
        direction="column"
        width="100%"
        height="100%"
        borderWidth={3}
        borderColor={0x990099}
        alignItems="center"
        justifyContent="center"
      >
        <Text text={text} fontSize={fontSize} color={color} fontFamily={fontFamily} />
        <Text text={text} fontSize={fontSize} color={color} fontFamily={fontFamily} />
      </View>
    </View>
  )
}

/**
 * Progress bar component using NineSlice
 */
function ProgressBar({ score, maxScore = 2000 }: { score: number; maxScore?: number }) {
  const ref = useRef<ReturnType<typeof createNineSliceRef> | null>(null)

  const handleRef = (node: Phaser.GameObjects.NineSlice | null) => {
    if (node) {
      ref.current = createNineSliceRef(node, {
        leftWidth: 6,
        rightWidth: 6,
      })
    } else {
      ref.current = null
    }
  }

  const innerWidth =
    ref.current != null
      ? ref.current.innerBounds.width - ref.current.leftWidth - ref.current.rightWidth
      : 216
  const progressWidth = Math.floor((Math.min(score, maxScore) / maxScore) * innerWidth)

  useEffect(() => {
    console.log('Ref updated:', ref.current)
    //if (ref.current?.node != null) console.log('Inner bounds:', ref.current?.node.getBounds())
  }, [ref])

  return (
    <View direction="stack" width={228} height={40}>
      <NineSlice
        ref={handleRef}
        texture="ui"
        frame="ButtonOrange"
        width="100%"
        height="100%"
        leftWidth={12}
        rightWidth={12}
      />
      <View
        direction="stack"
        width={innerWidth}
        height={'100%'}
        x={ref.current ? ref.current.leftWidth : 12}
        y={12}
        borderWidth={3}
        borderColor={0x0000aa}
      >
        <NineSlice
          //x={0}
          //y={0}
          texture="ui"
          frame="ButtonOrangeFill2"
          width={progressWidth}
          //height={10}
          leftWidth={6}
          rightWidth={6}
        />
      </View>
    </View>
  )
}

/**
 * Example demonstrating NineSlice usage with ZStack pattern for buttons
 */
export function NineSliceExample() {
  const [score, setScore] = useState(0)
  const [buttonWidth, setButtonWidth] = useState(300)

  return (
    <View
      direction="column"
      gap={30}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
      alignItems="center"
      backgroundColor={0x1a1a1a}
    >
      <Text text="NineSlice Examples" fontSize={24} color="#ffffff" />

      {/* Example 1: Button with NineSlice background - uses ref for inner bounds */}
      <NineSliceButton
        texture="ui"
        frame="GreenButtonSml"
        text={`Score: ${score}`}
        width={300}
        height={98}
        leftWidth={64}
        rightWidth={64}
        topHeight={48}
        bottomHeight={48}
        fontSize={36}
        color="#000000"
        fontFamily="Arial"
      />

      {/* Example 2: Clickable button */}
      <NineSliceButton
        texture="ui"
        frame="RedButtonSml"
        text="Add 500 to Score"
        onClick={() => setScore(score + 500)}
        width={300}
        height={98}
        leftWidth={64}
        rightWidth={64}
        topHeight={48}
        bottomHeight={48}
        fontSize={24}
        color="#00ffff"
        fontFamily="Arial"
      />

      {/* Example 3: Resize button with max width */}
      <NineSliceButton
        texture="ui"
        frame="ButtonOrange"
        text="Toggle Size"
        onClick={() => setButtonWidth(Math.min(buttonWidth === 300 ? 400 : 300, 400))}
        width={200}
        height={70}
        leftWidth={64}
        rightWidth={64}
        topHeight={35}
        bottomHeight={35}
        fontSize={18}
        color="#ffffff"
        fontFamily="Arial"
      />

      {/* Example 4: 3-Slice horizontal bar */}
      <View direction="column" gap={10}>
        <Text text="3-Slice Progress Bar:" fontSize={16} color="#ffffff" />
        <ProgressBar score={score} />
      </View>
      {/** TODO: this is a dummy view at end, because nineSlice did not correctly considered when calculate needed size */}
      <View />
    </View>
  )
}
