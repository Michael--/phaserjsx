/**
 * Slider with Marks Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Slider, Text, useState, View } from '@number10/phaserjsx'

export function MarksSliderExample() {
  const [withMarks, setWithMarks] = useState(5)
  const [autoMarks, setAutoMarks] = useState(50)

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={24}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <View direction="column" gap={12} width={350}>
        <Text text="With Custom Marks" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider
          value={withMarks}
          onChange={setWithMarks}
          min={0}
          max={10}
          step={1}
          marks={[{ value: 0 }, { value: 2 }, { value: 5 }, { value: 8 }, { value: 10 }]}
          snap
          showValue
          trackLength={300}
        />
        <Text text={`Value: ${withMarks}`} style={{ color: '#95a5a6', fontSize: '12px' }} />
      </View>

      <View direction="column" gap={12} width={350}>
        <Text text="Auto-Generated Marks" style={{ color: '#ffffff', fontSize: '14px' }} />
        <Slider
          value={autoMarks}
          onChange={setAutoMarks}
          min={0}
          max={100}
          step={10}
          marks={true}
          showValue
          trackLength={300}
        />
        <Text text={`Value: ${autoMarks}`} style={{ color: '#95a5a6', fontSize: '12px' }} />
      </View>
    </View>
  )
}
