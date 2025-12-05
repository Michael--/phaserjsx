/**
 * Slider States Example - Disabled and various configurations
 */
/** @jsxImportSource @phaserjsx/ui */
import { Slider, Text, useState, View } from '@phaserjsx/ui'

export function StatesSliderExample() {
  const [normal, setNormal] = useState(50)
  const [continuous, setContinuous] = useState(7.5)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={20}
      direction="column"
      justifyContent="center"
      alignItems="start"
    >
      <View direction="column" gap={8} width={350}>
        <Text text="Normal State" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider
          value={normal}
          onChange={setNormal}
          min={0}
          max={100}
          step={5}
          showValue
          trackLength={300}
        />
      </View>

      <View direction="column" gap={8} width={350}>
        <Text text="Disabled State" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider value={75} min={0} max={100} disabled showValue trackLength={300} />
        <Text
          text="Note: Disabled sliders have reduced opacity"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>

      <View direction="column" gap={8} width={350}>
        <Text text="Continuous (No Snap)" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider
          value={continuous}
          onChange={setContinuous}
          min={0}
          max={10}
          snap={false}
          showValue
          formatValue={(v) => v.toFixed(1)}
          trackLength={300}
        />
        <Text
          text="Smooth movement without stepping"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>
    </View>
  )
}
