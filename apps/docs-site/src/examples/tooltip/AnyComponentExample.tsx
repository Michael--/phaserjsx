/**
 * Tooltip Any Component Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Slider, Text, View } from '@number10/phaserjsx'

export function TooltipAnyComponentExample() {
  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" gap={18}>
      <Text text="Tooltips work on any component" style={{ color: '#ffffff', fontSize: '16px' }} />

      <View
        width={260}
        height={80}
        backgroundColor={0x2f2f2f}
        cornerRadius={8}
        alignItems="center"
        justifyContent="center"
        onTooltip={() => 'This is a View tooltip'}
      >
        <Text text="Hover the panel" />
      </View>

      <Slider
        value={60}
        min={0}
        max={100}
        step={5}
        trackLength={260}
        onTooltip={() => 'Sliders can show tooltips too'}
      />
    </View>
  )
}
