/**
 * Spring Playground Example - Live demo of all 6 spring presets
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Text,
  TransformOriginView,
  useForceRedraw,
  useSpring,
  View,
  type AnimationPreset,
} from '@number10/phaserjsx'

/** Preset display names and their accent colors */
const PRESETS: { name: AnimationPreset; label: string; color: number }[] = [
  { name: 'gentle', label: 'gentle', color: 0x44aaff },
  { name: 'default', label: 'default', color: 0x44cc88 },
  { name: 'wobbly', label: 'wobbly', color: 0xff8844 },
  { name: 'stiff', label: 'stiff', color: 0xee4444 },
  { name: 'slow', label: 'slow', color: 0xaa66ff },
  { name: 'instant', label: 'instant', color: 0xffdd44 },
]

/**
 * Single preset demo card - shows rotation + scale with a spring preset
 */
function PresetCard({
  preset,
  color,
  label,
}: {
  preset: AnimationPreset
  color: number
  label: string
}) {
  const [rotation, setRotation] = useSpring(0, preset)
  const [scale, setScale] = useSpring(1, preset)
  useForceRedraw(20, rotation, scale)

  const handleClick = () => {
    setRotation((prev) => prev + Math.PI / 2)
    setScale((prev) => (prev >= 1.3 ? 0.85 : prev + 0.15))
  }

  return (
    <View direction="column" gap={8} alignItems="center">
      <TransformOriginView
        width={70}
        height={70}
        rotation={rotation.value}
        scale={scale.value}
        cornerRadius={10}
      >
        <View
          width={70}
          height={70}
          backgroundColor={color}
          cornerRadius={10}
          enableGestures
          onTouch={handleClick}
        />
      </TransformOriginView>
      <Text text={label} style={{ fontSize: 12 }} />
    </View>
  )
}

/**
 * Spring Playground - all 6 presets side by side
 * Click any box to see the spring animation personality
 */
export function SpringPlaygroundExample() {
  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      gap={14}
      padding={16}
      alignItems="center"
      justifyContent="center"
    >
      <View direction="column" gap={4} alignItems="center">
        <Text text="Spring Presets" style={{ fontSize: 16 }} />
        <Text text="Click any box to spin & scale" style={{ fontSize: 11, color: '#888888' }} />
      </View>

      <View direction="row" gap={16} flexWrap="wrap" justifyContent="center">
        {PRESETS.map((p) => (
          <PresetCard preset={p.name} color={p.color} label={p.label} />
        ))}
      </View>
    </View>
  )
}
