import { Text, View, useState } from '@phaserjsx/ui'

/**
 * Counter component with configurable step
 * @param props - Counter properties
 * @returns Counter component JSX
 */
function Counter(props: { step?: number; label?: string }) {
  const [n, setN] = useState(0)
  const step = props.step ?? 1
  return (
    <View
      margin={{ top: 10, bottom: 10 }}
      backgroundColor={0x008800}
      backgroundAlpha={1.0}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      direction="row"
      gap={20}
      alignItems="center"
    >
      <View
        backgroundColor={0x880000}
        backgroundAlpha={1.0}
        enableGestures={true}
        onTouch={() => {
          setN((v) => v + step)
        }}
      >
        <Text
          text={`Add +${step}`}
          style={{ fontSize: 20 }}
          margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
        />
      </View>
      <View backgroundColor={0x444444} backgroundAlpha={1.0}>
        <Text text={`${props.label ?? 'Count'}: ${n}`} />
      </View>
    </View>
  )
}

/**
 * Example: Layout system demonstration
 * Shows automatic vertical stacking with margins and padding
 * @returns Layout demo JSX
 */
export function LayoutExample() {
  return (
    <View x={20} y={20} justifyContent="start">
      <Text text="Layout System Demo (gap: 10)" style={{ color: 'yellow' }} />
      <Text text="Automatic vertical stacking:" />
      <Counter step={1} label="Counter A" />
      <Counter step={5} label="Counter B" />
      <Counter step={10} label="Counter C" />
      <View
        margin={{ top: 20 }}
        backgroundColor={0x444444}
        backgroundAlpha={1.0}
        padding={{ left: 15, top: 15, right: 15, bottom: 15 }}
        direction="row"
        gap={15}
        alignItems="center"
      >
        <Text style={{ fontSize: 20, color: 'cyan' }} text="Row" />
        <Text style={{ fontSize: 30, color: 'lime' }} text="Layout" />
        <Text style={{ fontSize: 15, color: 'orange' }} text="Demo" />
      </View>
    </View>
  )
}
