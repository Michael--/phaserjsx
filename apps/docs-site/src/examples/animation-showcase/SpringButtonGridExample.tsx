/**
 * Spring Button Grid Example - Multiple buttons with different spring presets
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

const BUTTONS: { label: string; color: number; preset: AnimationPreset }[] = [
  { label: 'Gentle', color: 0x44aaff, preset: 'gentle' },
  { label: 'Default', color: 0x44cc88, preset: 'default' },
  { label: 'Wobbly', color: 0xff8844, preset: 'wobbly' },
  { label: 'Stiff', color: 0xee4444, preset: 'stiff' },
  { label: 'Slow', color: 0xaa66ff, preset: 'slow' },
]

function SpringButton({
  label,
  color,
  preset,
}: {
  label: string
  color: number
  preset: AnimationPreset
}) {
  const [scale, setScale] = useSpring(1, preset)
  useForceRedraw(20, scale)

  const handlePress = () => {
    setScale((prev) => (prev >= 1.2 ? 0.85 : 1.2))
  }

  return (
    <View direction="column" gap={6} alignItems="center">
      <TransformOriginView width={90} height={40} scale={scale.value} cornerRadius={8}>
        <View
          width={90}
          height={40}
          backgroundColor={color}
          cornerRadius={8}
          direction="row"
          alignItems="center"
          justifyContent="center"
          enableGestures
          onTouch={handlePress}
        >
          <Text text={label} style={{ fontSize: 12, color: '#ffffff' }} />
        </View>
      </TransformOriginView>
      <Text text={preset} style={{ fontSize: 10, color: '#888888' }} />
    </View>
  )
}

/**
 * Grid of spring-animated buttons showing different presets
 */
export function SpringButtonGridExample() {
  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={12}
    >
      <Text text="Spring Buttons" style={{ fontSize: 14 }} />
      <Text
        text="Each button uses a different spring preset"
        style={{ fontSize: 10, color: '#888888' }}
      />
      <View direction="row" gap={16} flexWrap="wrap" justifyContent="center">
        {BUTTONS.map((btn) => (
          <SpringButton key={btn.label} label={btn.label} color={btn.color} preset={btn.preset} />
        ))}
      </View>
    </View>
  )
}
