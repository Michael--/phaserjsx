/**
 * TransformOriginView Origin Comparison Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, TransformOriginView, useForceRedraw, useSpring, View } from '@number10/phaserjsx'

/**
 * Compares different origin points for rotation
 */
export function OriginComparisonTransformOriginViewExample() {
  const [rotation, setRotation] = useSpring(0, 'gentle')
  useForceRedraw(20, rotation)

  const handleClick = () => {
    setRotation((prev) => prev + Math.PI / 4)
  }

  return (
    <View
      width={'fill'}
      height={'fill'}
      direction="column"
      gap={50}
      alignItems="center"
      justifyContent="center"
    >
      <Text text="Click any box to rotate all 45°" style={{ fontSize: 14 }} />
      <View direction="row" gap={25}>
        <Text text="Center" style={{ fontSize: 12 }} />
        <TransformOriginView
          width={70}
          height={70}
          rotation={rotation.value}
          originX={0.5}
          originY={0.5}
        >
          <View
            width={70}
            height={70}
            backgroundColor={0xff4444}
            cornerRadius={5}
            onTouch={handleClick}
            direction="stack"
          >
            <View width={6} height={6} backgroundColor={0xffff00} cornerRadius={3} x={32} y={32} />
          </View>
        </TransformOriginView>

        <Text text="Top-Left" style={{ fontSize: 12 }} />
        <TransformOriginView
          width={70}
          height={70}
          rotation={rotation.value}
          originX={0}
          originY={0}
        >
          <View
            width={70}
            height={70}
            backgroundColor={0x44ff44}
            cornerRadius={5}
            onTouch={handleClick}
            direction="stack"
          >
            <View width={6} height={6} backgroundColor={0xffff00} cornerRadius={3} x={-3} y={-3} />
          </View>
        </TransformOriginView>

        <Text text="Bottom-Right" style={{ fontSize: 12 }} />
        <TransformOriginView
          width={70}
          height={70}
          rotation={rotation.value}
          originX={1}
          originY={1}
        >
          <View
            width={70}
            height={70}
            backgroundColor={0x4444ff}
            cornerRadius={5}
            onTouch={handleClick}
            direction="stack"
          >
            <View width={6} height={6} backgroundColor={0xffff00} cornerRadius={3} x={67} y={67} />
          </View>
        </TransformOriginView>
      </View>
    </View>
  )
}
