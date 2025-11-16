/**
 * NineSlice Example - demonstrates scalable UI elements using NineSlice
 */
import { NineSlice, Text, useNineSliceRef, useState, View } from '@phaserjsx/ui'

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
  const ref = useNineSliceRef(leftWidth, rightWidth, topHeight, bottomHeight)

  return (
    <View direction="stack" width={width} height={height} onPointerDown={onClick ?? (() => {})}>
      <NineSlice
        ref={ref.callback}
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
        padding={{
          left: ref.current?.leftWidth ?? 0,
          right: ref.current?.rightWidth ?? 0,
          top: ref.current?.topHeight ?? 0,
          bottom: ref.current?.bottomHeight ?? 0,
        }}
        alignItems="center"
        justifyContent="center"
      >
        <Text text={text} fontSize={fontSize} color={color} fontFamily={fontFamily} />
      </View>
    </View>
  )
}

/**
 * Progress bar component using NineSlice
 */
function ProgressBar({ score, maxScore = 2000 }: { score: number; maxScore?: number }) {
  const progressWidth = Math.floor((Math.min(score, maxScore) / maxScore) * 228)

  return (
    <View direction="stack" width={228} height={39}>
      <NineSlice
        texture="ui"
        frame="ButtonOrange"
        width="100%"
        height="100%"
        leftWidth={6}
        rightWidth={6}
      />
      <NineSlice
        texture="ui"
        frame="ButtonOrangeFill1"
        width={progressWidth}
        height="100%"
        leftWidth={6}
        rightWidth={6}
      />
    </View>
  )
}

/**
 * Example demonstrating NineSlice usage with ZStack pattern for buttons
 */
export function NineSliceExample() {
  const [score, setScore] = useState(0)
  const [buttonWidth, setButtonWidth] = useState(300)

  // Use NineSlice ref to access inner bounds for perfect text positioning
  const buttonRef = useNineSliceRef(64, 64, 48, 48)

  return (
    <View direction="column" gap={30} padding={{ top: 20, left: 20 }} backgroundColor={0x1a1a1a}>
      <Text text="NineSlice Examples" fontSize={24} color="#ffffff" />

      {/* Example 1: Button with NineSlice background - uses ref for inner bounds */}
      <View direction="stack" width={buttonWidth} height={98} backgroundColor={0x33aa33}>
        <NineSlice
          ref={buttonRef.callback}
          texture="ui"
          frame="GreenButtonSml"
          width="100%"
          height="100%"
          leftWidth={64}
          rightWidth={64}
          topHeight={48}
          bottomHeight={48}
        />
        <View
          direction="column"
          width="100%"
          height="100%"
          padding={{
            left: buttonRef.current?.leftWidth ?? 0,
            right: buttonRef.current?.rightWidth ?? 0,
            top: buttonRef.current?.topHeight ?? 0,
            bottom: buttonRef.current?.bottomHeight ?? 0,
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Text text={`Score: ${score}`} fontSize={32} color="#ffffff" fontFamily="Courier" />
          <Text
            text={`Inner: ${buttonRef.current?.innerBounds.width ?? 0}x${buttonRef.current?.innerBounds.height ?? 0}`}
            fontSize={12}
            color="#88ff88"
          />
        </View>
      </View>

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
        frame="BlueButtonSml"
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
    </View>
  )
}
