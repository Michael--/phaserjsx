/**
 * Toggle Animation Example - Different durations and states
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, Toggle, useState, View } from '@phaserjsx/ui'

export function AnimationToggleExample() {
  const [fast, setFast] = useState(false)
  const [normal, setNormal] = useState(false)
  const [slow, setSlow] = useState(false)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={16}
      direction="column"
      justifyContent="center"
      alignItems="start"
    >
      <View direction="column" gap={8}>
        <Text text="Animation Duration" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Text
          text="Toggle to see different animation speeds"
          style={{ color: '#aaaaaa', fontSize: '12px' }}
        />

        <Toggle
          checked={fast}
          onChange={setFast}
          label="Fast animation (100ms)"
          theme={{ Toggle: { duration: 100 } }}
        />

        <Toggle
          checked={normal}
          onChange={setNormal}
          label="Normal animation (200ms)"
          theme={{ Toggle: { duration: 200 } }}
        />

        <Toggle
          checked={slow}
          onChange={setSlow}
          label="Slow animation (500ms)"
          theme={{ Toggle: { duration: 500 } }}
        />
      </View>

      <View direction="column" gap={4}>
        <Text
          text="Animation uses Cubic.easeOut easing"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
        <Text
          text="Both thumb position and track color are animated"
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>
    </View>
  )
}
