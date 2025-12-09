/**
 * Slider Orientation Example - Horizontal and Vertical
 */
/** @jsxImportSource @number10/phaserjsx */
import { Slider, Text, useState, View } from '@number10/phaserjsx'

export function OrientationSliderExample() {
  const [horizontal, setHorizontal] = useState(30)
  const [vertical, setVertical] = useState(60)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={32}
      direction="row"
      justifyContent="center"
      alignItems="start"
    >
      <View direction="column" gap={20} alignItems="center">
        <Text text="Horizontal Slider" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider
          orientation="horizontal"
          value={horizontal}
          onChange={setHorizontal}
          min={0}
          max={100}
          showValue
          trackLength={250}
        />
      </View>

      <View direction="column" gap={12} alignItems="center">
        <Text text="Vertical Slider" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider
          orientation="vertical"
          value={vertical}
          onChange={setVertical}
          min={0}
          max={100}
          showValue
          trackLength={200}
        />
      </View>
    </View>
  )
}
