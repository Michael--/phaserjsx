/**
 * TransformOriginView Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, TransformOriginView, useForceRedraw, useSpring, View } from '@number10/phaserjsx'

/**
 * Basic TransformOriginView with reactive rotation
 */
export function QuickStartTransformOriginViewExample() {
  const [rotation, setRotation] = useSpring(0, 'gentle')
  useForceRedraw(20, rotation)

  return (
    <View
      width={'fill'}
      height={'fill'}
      direction="row"
      gap={15}
      alignItems="center"
      justifyContent="center"
    >
      <Text text="Click it to rotate" style={{ fontSize: 14 }} />
      <TransformOriginView width={80} height={80} rotation={rotation.value}>
        <View
          width={80}
          height={80}
          backgroundColor={0xff00ff}
          cornerRadius={12}
          enableGestures
          onTouch={() => setRotation((prev) => prev + Math.PI / 4)}
        />
      </TransformOriginView>
    </View>
  )
}
