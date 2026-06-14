/**
 * Smoothed Progress Example - spring-smooth volatile values
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  ProgressBar,
  Text,
  useForceRedraw,
  useSpring,
  useState,
  View,
  WrapText,
} from '@number10/phaserjsx'

const TARGETS = [
  { label: 'Low', value: 0.18, color: 0x67d391 },
  { label: 'Mid', value: 0.54, color: 0x4f9cff },
  { label: 'High', value: 0.86, color: 0xffb84d },
]

/**
 * Incoming values jump immediately; the rendered value catches up smoothly.
 */
export function SmoothedProgressExample() {
  const [target, setTarget] = useState(0.54)
  const [progress, setProgress] = useSpring(0.54, { tension: 150, friction: 20 })
  useForceRedraw(20, progress)

  const setIncomingValue = (value: number) => {
    setTarget(value)
    setProgress(value)
  }

  const displayValue = Math.max(0, Math.min(1, progress.value))
  const percent = Math.round(displayValue * 100)
  const targetPercent = Math.round(target * 100)

  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={14}
    >
      <View
        width={390}
        direction="column"
        gap={16}
        padding={18}
        backgroundColor={0x142418}
        cornerRadius={10}
      >
        <View direction="row" justifyContent="space-between" alignItems="center">
          <View direction="column" gap={4}>
            <Text text="Problem" style={{ fontSize: 11, color: '#85a38b' }} />
            <Text text="Data jumps, UI should not" style={{ fontSize: 15, color: '#ffffff' }} />
          </View>
          <Text text={`target ${targetPercent}%`} style={{ fontSize: 11, color: '#9ee6aa' }} />
        </View>

        <WrapText
          text="Sensor, score, or loading values can jump. The app stores the real target immediately and springs only the rendered value."
          style={{ fontSize: 10, color: '#b5c9ba' }}
        />

        <View direction="column" gap={7}>
          <View direction="row" justifyContent="space-between">
            <Text text="Rendered value" style={{ fontSize: 11, color: '#93a89a' }} />
            <Text text={`${percent}%`} style={{ fontSize: 11, color: '#d7ffe0' }} />
          </View>
          <ProgressBar
            value={displayValue}
            max={1}
            width="fill"
            height={12}
            fillColor={0x67d391}
            trackColor={0x0c1710}
            cornerRadius={6}
          />
        </View>

        <View direction="row" gap={10} justifyContent="center">
          {TARGETS.map((item) => (
            <View
              key={item.label}
              width={88}
              height={34}
              backgroundColor={item.color}
              cornerRadius={7}
              alignItems="center"
              justifyContent="center"
              enableGestures
              onTouch={() => setIncomingValue(item.value)}
            >
              <Text text={item.label} style={{ fontSize: 11, color: '#0b1220' }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
