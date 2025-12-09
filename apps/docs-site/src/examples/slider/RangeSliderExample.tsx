/**
 * RangeSlider Example - Two thumbs for range selection
 */
/** @jsxImportSource @number10/phaserjsx */
import { RangeSlider, Text, useState, View } from '@number10/phaserjsx'

export function RangeSliderExample() {
  const [priceRange, setPriceRange] = useState<[number, number]>([25, 75])
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17])

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
      <View direction="column" gap={12} width={400}>
        <Text text="Price Range" style={{ color: '#ffffff', fontSize: '14px' }} />
        <RangeSlider
          value={priceRange}
          onChange={setPriceRange}
          min={0}
          max={100}
          step={5}
          showValue
          formatValue={(v) => `$${v}`}
          trackLength={350}
        />
        <Text
          text={`Selected: $${priceRange[0]} - $${priceRange[1]}`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>

      <View direction="column" gap={12} width={400}>
        <Text text="Time Range (with marks)" style={{ color: '#ffffff', fontSize: '14px' }} />
        <RangeSlider
          value={timeRange}
          onChange={setTimeRange}
          min={0}
          max={24}
          step={1}
          marks={true}
          showValue
          formatValue={(v) => `${v}:00`}
          trackLength={350}
        />
        <Text
          text={`Working hours: ${timeRange[0]}:00 - ${timeRange[1]}:00`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>
    </View>
  )
}
