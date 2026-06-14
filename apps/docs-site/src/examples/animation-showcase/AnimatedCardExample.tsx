/**
 * Animated Card Example - Card with spring-driven hover/click animations
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Button,
  Text,
  TransformOriginView,
  useForceRedraw,
  useSpring,
  View,
} from '@number10/phaserjsx'

/**
 * Animated card that springs on click with icon, title, description and button
 */
export function AnimatedCardExample() {
  const [scale, setScale] = useSpring(1, 'wobbly')
  const [rotation, setRotation] = useSpring(0, 'gentle')
  useForceRedraw(20, scale, rotation)

  const handlePress = () => {
    setScale((prev) => (prev >= 1.08 ? 0.95 : 1.08))
    setRotation((prev) => prev + Math.PI / 16)
  }

  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={12}
    >
      <Text text="Animated Card" style={{ fontSize: 14 }} />
      <TransformOriginView
        width={240}
        height={140}
        scale={scale.value}
        rotation={rotation.value}
        cornerRadius={12}
      >
        <View
          width={240}
          height={140}
          backgroundColor={0x1e3a5f}
          cornerRadius={12}
          borderWidth={1}
          borderColor={0x336699}
          padding={16}
          direction="column"
          gap={10}
          enableGestures
          onTouch={handlePress}
        >
          <View direction="row" gap={8} alignItems="center">
            <View width={28} height={28} backgroundColor={0xff8844} cornerRadius={14} />
            <Text text="Spring Card" style={{ fontSize: 15, color: '#ffffff' }} />
          </View>
          <Text
            text="Tap me to see spring physics in action. Scale & rotation respond with natural motion."
            style={{ fontSize: 10, color: '#8899bb' }}
          />
          <Button width={80} height={24} variant="primary" size="small">
            <Text text="Action" style={{ fontSize: 10, color: '#ffffff' }} />
          </Button>
        </View>
      </TransformOriginView>
    </View>
  )
}
