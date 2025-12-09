/**
 * TransformOriginView Spring Animation Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, TransformOriginView, useForceRedraw, useSpring, View } from '@phaserjsx/ui'

/**
 * Demonstrates useSpring with rotation and scale
 */
export function SpringTransformOriginViewExample() {
  const [rotation, setRotation] = useSpring(0, 'wobbly')
  const [scale, setScale] = useSpring(1, 'gentle')
  useForceRedraw(20, rotation, scale)

  return (
    <View
      width={'fill'}
      height={'fill'}
      direction="row"
      gap={15}
      alignItems="center"
      justifyContent="center"
    >
      {/* Rotation with wobbly spring */}
      <View direction="column" gap={25} alignItems="center">
        <Text text="Spin" style={{ fontSize: 20 }} />
        <TransformOriginView width={80} height={80} rotation={rotation.value} cornerRadius={12}>
          <View
            width={80}
            height={80}
            backgroundColor={0x00aaff}
            cornerRadius={12}
            onTouch={() => setRotation((prev) => prev + Math.PI / 2)}
          />
        </TransformOriginView>
        <Text text="Wobbly rotation" style={{ fontSize: 12 }} />
      </View>

      {/* Scale with gentle spring */}
      <View direction="column" gap={25} alignItems="center">
        <Text text="Pulse" style={{ fontSize: 18 }} />
        <TransformOriginView width={80} height={80} scale={scale.value}>
          <View
            width={80}
            height={80}
            backgroundColor={0xff6600}
            cornerRadius={40}
            onTouch={() => setScale(scale.value === 1 ? 1.5 : 1)}
          />
        </TransformOriginView>
        <Text text="Gentle scale" style={{ fontSize: 12 }} />
      </View>
    </View>
  )
}
