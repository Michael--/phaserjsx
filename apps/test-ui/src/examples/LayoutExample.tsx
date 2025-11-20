import { Text, View, useState, useThemeTokens } from '@phaserjsx/ui'
import { Button } from '../components'

/**
 * Counter component with configurable step
 * @param props - Counter properties
 * @returns Counter component JSX
 */
function Counter(props: { step?: number; label?: string }) {
  const [n, setN] = useState(0)
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  const step = props.step ?? 1
  return (
    <View
      backgroundColor={colors?.background.dark.toNumber()}
      direction="row"
      alignItems="center"
      padding={10}
      gap={10}
    >
      <Button
        width={150}
        text={`Add +${step}`}
        onClick={() => {
          setN((v) => v + step)
        }}
      />
      <Text text={`${props.label ?? 'Count'}: ${n}`} style={tokens?.textStyles.large} />
    </View>
  )
}

/**
 * Example: Layout system demonstration
 * Shows automatic vertical stacking with margins and padding
 * @returns Layout demo JSX
 */
export function LayoutExample() {
  const colors = useThemeTokens()?.colors
  return (
    <View width={'100%'} height={'100%'} justifyContent="start" padding={20} gap={10}>
      <Text text="Automatic vertical stacking:" />
      <Counter step={1} label="Counter A" />
      <Counter step={5} label="Counter B" />
      <Counter step={10} label="Counter C" />
      <View
        margin={{ top: 20 }}
        backgroundColor={colors?.background.dark.toNumber()}
        backgroundAlpha={1.0}
        padding={15}
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
