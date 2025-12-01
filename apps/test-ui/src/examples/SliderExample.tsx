/** @jsxImportSource @phaserjsx/ui */
/**
 * Slider component examples
 * Demonstrates horizontal, vertical, marks, custom styling, and disabled states
 */
import { Graphics, ScrollView, Slider, Text, useState, useTheme, View } from '@phaserjsx/ui'
import { ViewLevel2 } from './Helper'

/**
 * SliderExample component
 * @returns JSX element
 */
export function SliderExample() {
  // State for controlled sliders
  const [volume, setVolume] = useState(50)
  const [temperature, setTemperature] = useState(20)
  const [fineTune, setFineTune] = useState(5.5)
  const [rangeValue, setRangeValue] = useState(0)
  const localTheme = useTheme()

  return (
    <ScrollView width="fill" height="fill" backgroundColor={0xf0f0f0} padding={20}>
      <ViewLevel2>
        <Text
          text="Slider Component Examples"
          style={{ fontSize: '32px', color: '#000000' }}
          margin={{ bottom: 20 }}
        />

        {/* Basic Horizontal Slider */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Basic Horizontal Slider" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            value={volume}
            onChange={(v) => {
              setVolume(v)
            }}
            min={0}
            max={100}
            step={1}
          />
          <Text text={`Volume: ${volume}%`} style={{ fontSize: '14px', color: '#666666' }} />
        </View>

        {/* With Value Label */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="With Value Label" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            defaultValue={65}
            min={0}
            max={100}
            step={5}
            showValue
            formatValue={(v: number) => `${v}%`}
            trackLength={300}
          />
        </View>

        {/* Temperature Slider with Marks */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="With Marks and Labels" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            value={temperature}
            onChange={setTemperature}
            min={-10}
            max={40}
            step={5}
            marks={[
              { value: -10, label: 'Cold' },
              { value: 0, label: '0°C' },
              { value: 20, label: 'Room' },
              { value: 40, label: 'Hot' },
            ]}
            snap
            showValue
            formatValue={(v: number) => `${v}°C`}
            trackLength={350}
          />
        </View>

        {/* Auto-Generated Marks */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Auto-Generated Marks" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider defaultValue={5} min={0} max={10} step={1} marks={true} trackLength={250} />
        </View>

        {/* Disabled Slider */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Disabled State" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider value={50} min={0} max={100} disabled trackLength={250} />
        </View>

        {/* Continuous (No Snap) */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Continuous (No Snap)" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            defaultValue={50}
            min={0}
            max={100}
            snap={false}
            showValue
            formatValue={(v: number) => `${v.toFixed(2)}`}
            trackLength={280}
          />
        </View>

        {/* Custom Thumb Rendering */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Custom Thumb (Square)" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            defaultValue={30}
            min={0}
            max={100}
            renderThumb={(_value: number, isDragging: boolean) => (
              <Graphics
                onDraw={(g) => {
                  g.clear()
                  g.fillStyle(0x333333, 1)
                  g.fillRect(-10, -10, 20, 20)
                }}
                scale={isDragging ? 1.1 : 1}
              />
            )}
            trackLength={250}
          />
        </View>

        {/* Custom Track Rendering */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Custom Track" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            defaultValue={40}
            min={0}
            max={100}
            renderTrack={(fillPercentage: number) => (
              <Graphics
                onDraw={(g) => {
                  g.clear()
                  const length = 250
                  const height = localTheme?.Slider?.trackHeight ?? 6
                  g.lineStyle(10, 0x660066, 1)
                  for (let i = 0; i < length * fillPercentage; i += 10) {
                    g.lineBetween(i, 0, i + height, height)
                  }
                }}
              />
            )}
            trackLength={250}
          />
        </View>

        {/* Fine Step Size */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Fine Step Size (0.1)" style={{ fontSize: '18px', color: '#000000' }} />
          <Slider
            value={fineTune}
            onChange={setFineTune}
            min={0}
            max={10}
            step={0.1}
            showValue
            formatValue={(v: number) => `${v.toFixed(1)}`}
            trackLength={300}
          />
        </View>

        {/* Large Value Range */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text
            text="Large Value Range (-100 to 100)"
            style={{ fontSize: '18px', color: '#000000' }}
          />
          <Slider
            value={rangeValue}
            onChange={setRangeValue}
            min={-100}
            max={100}
            step={10}
            marks={true}
            showValue
            trackLength={350}
          />
        </View>

        <ViewLevel2 direction="row">
          {/* Basic Vertical Slider */}
          <View
            width="fill"
            gap={12}
            padding={16}
            backgroundColor={0xffffff}
            margin={{ bottom: 16 }}
          >
            <Text text="Basic Vertical Slider" style={{ fontSize: '18px', color: '#000000' }} />
            <Slider
              orientation="vertical"
              value={volume}
              onChange={(v) => {
                setVolume(v)
              }}
              min={0}
              max={100}
              step={1}
            />
            <Text text={`Volume: ${volume}%`} style={{ fontSize: '14px', color: '#666666' }} />
          </View>

          {/* Vertical Slider with Marks */}
          <View
            width="fill"
            gap={12}
            padding={16}
            backgroundColor={0xffffff}
            margin={{ bottom: 16 }}
          >
            <Text text="Vertical with Marks" style={{ fontSize: '18px', color: '#000000' }} />
            <Slider
              orientation="vertical"
              defaultValue={50}
              min={0}
              max={100}
              step={10}
              marks={true}
              showValue
              trackLength={200}
            />
          </View>
        </ViewLevel2>
      </ViewLevel2>
    </ScrollView>
  )
}
