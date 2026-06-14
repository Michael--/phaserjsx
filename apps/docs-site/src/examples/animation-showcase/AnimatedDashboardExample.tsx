/**
 * Animated Dashboard Panel - Combined UI with coordinated spring animations
 * Shows a mini dashboard with slider, progress bar, and animated indicator
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  ProgressBar,
  Slider,
  Text,
  TransformOriginView,
  useEffect,
  useForceRedraw,
  useSpring,
  useState,
  View,
} from '@number10/phaserjsx'

/**
 * Animated indicator that continuously pulses with spring physics
 */
function AnimatedIndicator({ value }: { value: number }) {
  const [scale, setScale] = useSpring(1, 'wobbly')
  useForceRedraw(20, scale)

  // Pulse on an interval
  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev >= 1.25 ? 0.85 : 1.25))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <TransformOriginView width={76} height={76} scale={scale.value} cornerRadius={38}>
      <View
        width={76}
        height={76}
        backgroundColor={0x44aaff}
        cornerRadius={38}
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={0}
      >
        <Text text={`${Math.round(value * 100)}%`} style={{ fontSize: 18, color: '#ffffff' }} />
      </View>
    </TransformOriginView>
  )
}

/**
 * Animated dashboard panel with slider, progress, and spring-driven indicator
 */
export function AnimatedDashboardExample() {
  const [progress, setProgress] = useState(0.6)
  const activeColor = 0x44aaff

  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <View
        width={380}
        direction="column"
        gap={16}
        padding={20}
        backgroundColor={0x162030}
        cornerRadius={12}
        borderWidth={1}
        borderColor={0x2a3a50}
      >
        {/* Header */}
        <View direction="row" justifyContent="space-between" alignItems="center">
          <Text text="Dashboard" style={{ fontSize: 15, color: '#ddeeff' }} />
          <Text text="Spring Demo" style={{ fontSize: 10, color: '#667788' }} />
        </View>

        {/* Animated Indicator */}
        <View direction="row" justifyContent="center" padding={8}>
          <AnimatedIndicator value={progress} />
        </View>

        {/* Progress Bar */}
        <View direction="column" gap={6}>
          <View direction="row" justifyContent="space-between">
            <Text text="Progress" style={{ fontSize: 11, color: '#8899aa' }} />
            <Text
              text={`${Math.round(progress * 100)}%`}
              style={{ fontSize: 11, color: '#aabbcc' }}
            />
          </View>
          <ProgressBar
            value={progress}
            width="fill"
            height={8}
            progressColor={activeColor}
            trackColor={0x1a2a3a}
            cornerRadius={4}
          />
        </View>

        {/* Slider */}
        <View direction="column" gap={6}>
          <Text text="Adjust Value" style={{ fontSize: 11, color: '#8899aa' }} />
          <Slider
            value={progress}
            min={0}
            max={1}
            step={0.01}
            width="fill"
            height={24}
            activeColor={activeColor}
            onChange={(value) => setProgress(value)}
          />
          <View direction="row" justifyContent="space-between">
            <Text text="0%" style={{ fontSize: 9, color: '#556677' }} />
            <Text text="100%" style={{ fontSize: 9, color: '#556677' }} />
          </View>
        </View>
      </View>
    </View>
  )
}
