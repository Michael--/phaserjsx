/**
 * Toggle Label Positioning Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, Toggle, useState, View } from '@number10/phaserjsx'

export function LabelPositionToggleExample() {
  const [left, setLeft] = useState(false)
  const [right, setRight] = useState(true)
  const [none, setNone] = useState(false)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={16}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <View direction="column" gap={16}>
        <Text text="Label Position Examples" style={{ color: '#ffffff', fontSize: '14px' }} />

        <Toggle checked={left} onChange={setLeft} label="Label on left" labelPosition="left" />

        <Toggle checked={right} onChange={setRight} label="Label on right" labelPosition="right" />

        <View direction="row" gap={16} alignItems="center">
          <Text text="No label prop:" style={{ color: '#aaaaaa', fontSize: '12px' }} />
          <Toggle checked={none} onChange={setNone} />
        </View>
      </View>
    </View>
  )
}
