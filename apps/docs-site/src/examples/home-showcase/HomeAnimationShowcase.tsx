/**
 * Home Animation Showcase - Eye-catching animation demo for the HomePage
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Text,
  TransformOriginView,
  useEffect,
  useForceRedraw,
  useSpring,
  View,
} from '@number10/phaserjsx'

/**
 * Animated floating element with spring physics
 */
function FloatingBox({
  color,
  size,
  xOffset,
  preset,
  delay,
}: {
  color: number
  size: number
  xOffset: number
  preset: 'gentle' | 'default' | 'wobbly' | 'stiff' | 'slow'
  delay: number
}) {
  const [rotation, setRotation] = useSpring(0, preset)
  const [scale, setScale] = useSpring(1, preset)
  useForceRedraw(20, rotation, scale)

  // Cycle through transformations on a timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation((prev) => prev + Math.PI / 3)
      setScale((prev) => (prev >= 1.25 ? 0.8 : prev + 0.15))
    }, delay)

    return () => clearInterval(timer)
  }, [delay])

  return (
    <TransformOriginView
      width={size}
      height={size}
      rotation={rotation.value}
      scale={scale.value}
      cornerRadius={size / 6}
      x={xOffset}
      y={-10}
    >
      <View
        width={size}
        height={size}
        backgroundColor={color}
        cornerRadius={size / 6}
        backgroundAlpha={0.85}
      />
    </TransformOriginView>
  )
}

/**
 * Home page animation showcase
 * Displays colorful elements animated with different spring presets
 */
export function HomeAnimationShowcase() {
  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      gap={8}
      alignItems="center"
      justifyContent="center"
    >
      <View direction="row" gap={12} alignItems="center" justifyContent="center">
        <FloatingBox color={0xff4488} size={50} xOffset={-80} preset="wobbly" delay={1200} />
        <FloatingBox color={0x44aaff} size={55} xOffset={-30} preset="gentle" delay={1800} />
        <FloatingBox color={0x44cc88} size={60} xOffset={20} preset="default" delay={1400} />
        <FloatingBox color={0xff8844} size={55} xOffset={70} preset="stiff" delay={1000} />
        <FloatingBox color={0xaa66ff} size={50} xOffset={110} preset="slow" delay={2200} />
      </View>
      <Text text="Spring Physics Animations" style={{ fontSize: 16 }} />
      <Text
        text="gentle · default · wobbly · stiff · slow"
        style={{ fontSize: 11, color: '#888888' }}
      />
    </View>
  )
}
