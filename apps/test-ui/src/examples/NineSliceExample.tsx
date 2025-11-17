/**
 * NineSlice Example - demonstrates scalable UI elements using NineSlice
 */
import { Text, useState, View } from '@phaserjsx/ui'
import { NineSliceButton } from '../components'

/**
 * Example demonstrating NineSlice usage with ZStack pattern for buttons
 */
export function NineSliceExample() {
  const [score, setScore] = useState(0)
  const [buttonWidth, setButtonWidth] = useState(200)

  return (
    <View
      direction="column"
      gap={30}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
      alignItems="center"
      backgroundColor={0x1a1a1a}
    >
      <Text text="NineSlice Examples" style={{ fontSize: 24 }} />

      {/* Example 1: Button with NineSlice background */}
      <NineSliceButton
        texture="ui"
        frame="GreenButtonSml"
        width={250}
        height={102}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
      >
        <Text
          text={`Score: ${score}`}
          style={{
            fontSize: 30,
            fontStyle: 'bold',
            color: '#ffff00',
            shadow: { offsetX: 2, offsetY: 2, blur: 3, fill: true },
          }}
        />
      </NineSliceButton>

      {/* Example 2: Clickable button */}
      <NineSliceButton
        texture="ui"
        frame="RedButtonSml"
        onClick={() => setScore(score + 500)}
        width={300}
        height={98}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
      >
        <Text
          text="Add 500 to Score"
          style={{ fontSize: 24, fontStyle: 'bold', color: '#00ffff' }}
        />
      </NineSliceButton>

      {/* Example 3: Resize button with max width */}
      <NineSliceButton
        texture="ui"
        frame="ButtonOrange"
        onClick={() => setButtonWidth(buttonWidth === 300 ? 200 : 300)}
        width={buttonWidth}
        height={70}
        leftWidth={14}
        rightWidth={14}
        topHeight={14}
        bottomHeight={14}
      >
        <Text text="Toggle Size" style={{ fontSize: 20 }} />
      </NineSliceButton>

      {/** TODO: this is a dummy view at end, because nineSlice did not correctly considered when calculate needed size */}
      <View />
    </View>
  )
}
