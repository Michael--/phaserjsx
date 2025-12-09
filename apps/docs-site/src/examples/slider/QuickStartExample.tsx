/**
 * Slider Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Slider, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartSliderExample() {
  const [volume, setVolume] = useState(50)

  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <Text text="Volume Control" style={{ color: '#ffffff', fontSize: '16px' }} />

      <Slider value={volume} onChange={setVolume} min={0} max={100} step={5} trackLength={300} />

      <Text text={`Volume: ${volume}%`} style={{ color: '#aaaaaa', fontSize: '14px' }} />
    </View>
  )
}
