/**
 * NineSlice Example - demonstrates scalable UI elements using NineSlice
 */
import { NineSlice, Text, useNineSliceRef, useState, View } from '@phaserjsx/ui'

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
      <View direction="stack" width={300} height={98} onPointerDown={() => setScore(score + 500)}>
        <NineSlice
          texture="ui"
          frame="RedButtonSml"
          width="100%"
          height="100%"
          leftWidth={64}
          rightWidth={64}
          topHeight={48}
          bottomHeight={48}
        />
        <Text text="Add 500 to Score" fontSize={24} color="#00ffff" fontFamily="Arial" />
      </View>

      {/* Example 3: Resize button */}
      <View
        direction="stack"
        width={200}
        height={70}
        onPointerDown={() => setButtonWidth(buttonWidth === 300 ? 400 : 300)}
      >
        <NineSlice
          texture="ui"
          frame="BlueButtonSml"
          width="100%"
          height="100%"
          leftWidth={64}
          rightWidth={64}
          topHeight={35}
          bottomHeight={35}
        />
        <Text text="Toggle Size" fontSize={18} color="#ffffff" fontFamily="Arial" />
      </View>

      {/* Example 4: 3-Slice horizontal bar */}
      <View direction="column" gap={10}>
        <Text text="3-Slice Progress Bar:" fontSize={16} color="#ffffff" />
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
            width={Math.floor((score / 2000) * 228)}
            height="100%"
            leftWidth={6}
            rightWidth={6}
          />
        </View>
      </View>
    </View>
  )
}
