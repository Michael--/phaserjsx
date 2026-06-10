/**
 * Checkbox Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Checkbox, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartCheckboxExample() {
  const [music, setMusic] = useState(true)
  const [effects, setEffects] = useState(false)

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <Text text="Audio Settings" style={{ color: '#ffffff', fontSize: '18px' }} />
      <Checkbox label="Music" checked={music} onChange={(value) => setMusic(value === true)} />
      <Checkbox
        label="Sound effects"
        checked={effects}
        onChange={(value) => setEffects(value === true)}
      />
      <Text
        text={`Music: ${music ? 'on' : 'off'} | Effects: ${effects ? 'on' : 'off'}`}
        style={{ color: '#9aa0a6', fontSize: '13px' }}
      />
    </View>
  )
}
