/**
 * ProgressBar Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { ProgressBar, Slider, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartProgressBarExample() {
  const [xp, setXp] = useState(68)

  return (
    <View width="fill" height="fill" padding={24} gap={18} justifyContent="center">
      <Text text="Level Progress" style={{ color: '#ffffff', fontSize: '18px' }} />
      <ProgressBar
        value={xp}
        min={0}
        max={100}
        label="XP"
        showValue
        width={320}
        fillColor={0x38bdf8}
      />
      <Slider value={xp} onChange={setXp} min={0} max={100} step={1} trackLength={320} />
    </View>
  )
}
