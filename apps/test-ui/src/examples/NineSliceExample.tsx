/**
 * NineSlice Example - demonstrates scalable UI elements using NineSlice
 */
import { NineSlice, Text, useRef, useState, View, type ChildrenType } from '@phaserjsx/ui'

/**
 * Reusable NineSlice button component with proper inner padding
 */
function NineSliceButton(props: {
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
  children?: ChildrenType
}) {
  const ref = useRef<Phaser.GameObjects.NineSlice | null>(null)
  const innerWidth = props.width - props.leftWidth - props.rightWidth
  const innerHeight = props.height - props.topHeight - props.bottomHeight

  return (
    <View
      direction="stack"
      width={props.width}
      height={props.height}
      onPointerDown={props.onClick ?? (() => {})}
    >
      <NineSlice
        ref={ref}
        texture={props.texture}
        frame={props.frame}
        width="100%"
        height="100%"
        leftWidth={props.leftWidth}
        rightWidth={props.rightWidth}
        topHeight={props.topHeight}
        bottomHeight={props.bottomHeight}
      />
      <View
        direction="column"
        x={props.leftWidth}
        y={props.topHeight}
        width={innerWidth}
        height={innerHeight}
        borderWidth={3}
        borderColor={0x990099}
        alignItems="center"
        justifyContent="center"
      >
        {props.children}
      </View>
    </View>
  )
}

/**
 * Example demonstrating NineSlice usage with ZStack pattern for buttons
 */
export function NineSliceExample() {
  const [score, setScore] = useState(0)
  const [buttonWidth, setButtonWidth] = useState(200)

  const toggleSize = () => {
    console.log('Toggling button size', buttonWidth)
    setButtonWidth(buttonWidth === 300 ? 200 : 300)
  }

  return (
    <View
      direction="column"
      gap={30}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
      alignItems="center"
      backgroundColor={0x1a1a1a}
    >
      <Text text="NineSlice Examples" style={{ fontSize: 24 }} />

      {/* Example 1: Button with NineSlice background - uses ref for inner bounds */}
      <NineSliceButton
        texture="ui"
        frame="GreenButtonSml"
        text={`Score: ${score}`}
        width={250}
        height={102}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
      >
        <Text text={`Score: ${score}`} style={{ fontSize: 20, color: '#000000' }} />
      </NineSliceButton>

      {/* Example 2: Clickable button */}
      <NineSliceButton
        texture="ui"
        frame="RedButtonSml"
        text="Add 500 to Score"
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
        text="Toggle Size"
        onClick={toggleSize}
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
