/** @jsxImportSource @phaserjsx/ui */
/**
 * Slider component examples
 * Demonstrates horizontal, vertical, marks, custom styling, and disabled states
 */
import {
  Graphics,
  RangeSlider,
  RefOriginView,
  ScrollView,
  Slider,
  Text,
  useState,
  useTheme,
  View,
  type VNode,
} from '@phaserjsx/ui'
import { ViewLevel2 } from './Helper'

function CenterOriginLabel(props: { children: VNode }) {
  return (
    <RefOriginView width={0} height={0} originX={0.5} originY={0.5}>
      <View width={100} height={100} x={-50} y={-30} alignItems="center" justifyContent="center">
        {props.children}
      </View>
    </RefOriginView>
  )
}
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
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 80])
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17])
  const localTheme = useTheme()
  // const { props: themed } = getThemedProps('Slider', localTheme, {})

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
        <View
          width="fill"
          gap={12}
          padding={{ left: 30, top: 16, right: 16, bottom: 30 }}
          backgroundColor={0xffffff}
          margin={{ bottom: 16 }}
        >
          <Text text="With Marks and Labels" style={{ fontSize: '18px', color: '#000000' }} />
          <View direction="row" gap={75}>
            <Slider
              value={temperature}
              onChange={setTemperature}
              min={-10}
              max={40}
              step={5}
              marks={[
                {
                  value: -10,
                  label: (
                    <CenterOriginLabel>
                      <Text text={'Cold'} style={{ fontSize: '16px', color: '#0000ff' }} />
                    </CenterOriginLabel>
                  ),
                },
                {
                  value: 0,
                  label: (
                    <CenterOriginLabel>
                      <Text text={'0°C'} style={{ fontSize: '16px', color: '#5555ff' }} />
                    </CenterOriginLabel>
                  ),
                },
                {
                  value: 20,
                  label: (
                    <CenterOriginLabel>
                      <Text text={'Room'} style={{ fontSize: '16px', color: '#0' }} />
                    </CenterOriginLabel>
                  ),
                },
                {
                  value: 40,
                  label: (
                    <CenterOriginLabel>
                      <Text text={'Hot'} style={{ fontSize: '16px', color: '#ff0000' }} />
                    </CenterOriginLabel>
                  ),
                },
              ]}
              snap
              //showValue
              //formatValue={(v: number) => `${v}°C`}
              trackLength={350}
            />
            <Text
              text={`Temperature: ${temperature}°C`}
              style={{ fontSize: '20px', color: '#aaaaaa' }}
            />
          </View>
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
                onDraw={(g: Phaser.GameObjects.Graphics) => {
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
                onDraw={(g: Phaser.GameObjects.Graphics) => {
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
              showValue
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

        {/* Reverse Direction Examples */}
        <Text
          text="Reverse Direction (right-to-left / bottom-to-top)"
          style={{ fontSize: '24px', color: '#000000' }}
          margin={{ top: 20, bottom: 12 }}
        />

        {/* Horizontal Reversed */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text
            text="Horizontal Reversed (100 → 0)"
            style={{ fontSize: '18px', color: '#000000' }}
          />
          <Slider defaultValue={30} min={0} max={100} reverse showValue trackLength={300} />
        </View>

        {/* Vertical Reversed */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text
            text="Vertical Reversed (top-to-bottom)"
            style={{ fontSize: '18px', color: '#000000' }}
          />
          <Slider
            orientation="vertical"
            defaultValue={40}
            min={0}
            max={100}
            reverse
            showValue
            trackLength={200}
          />
        </View>

        {/* Range Slider Examples */}
        <Text
          text="Range Slider (Two Thumbs)"
          style={{ fontSize: '24px', color: '#000000' }}
          margin={{ top: 20, bottom: 12 }}
        />

        {/* Basic Range Slider */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Price Range" style={{ fontSize: '18px', color: '#000000' }} />
          <RangeSlider
            value={priceRange}
            onChange={setPriceRange}
            min={0}
            max={100}
            step={5}
            showValue
            formatValue={(v: number) => `$${v}`}
            trackLength={350}
          />
          <Text
            text={`Selected: $${priceRange[0]} - $${priceRange[1]}`}
            style={{ fontSize: '14px', color: '#666666' }}
          />
        </View>

        {/* Range Slider with Marks */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Time Range (with marks)" style={{ fontSize: '18px', color: '#000000' }} />
          <RangeSlider
            value={timeRange}
            onChange={setTimeRange}
            min={0}
            max={24}
            step={1}
            marks={true}
            showValue
            formatValue={(v: number) => `${v}:00`}
            trackLength={400}
          />
          <Text
            text={`Working hours: ${timeRange[0]}:00 - ${timeRange[1]}:00`}
            style={{ fontSize: '14px', color: '#666666' }}
          />
        </View>

        {/* Range Slider Reversed */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Range Slider Reversed" style={{ fontSize: '18px', color: '#000000' }} />
          <RangeSlider
            defaultValue={[30, 70]}
            min={0}
            max={100}
            reverse
            showValue
            trackLength={300}
          />
        </View>

        {/* Range Slider with Min Distance */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text
            text="Range Slider with Min Distance (10)"
            style={{ fontSize: '18px', color: '#000000' }}
          />
          <RangeSlider
            defaultValue={[40, 60]}
            min={0}
            max={100}
            minDistance={10}
            showValue
            trackLength={300}
          />
        </View>

        {/* Vertical Range Slider */}
        <View width="fill" gap={12} padding={16} backgroundColor={0xffffff} margin={{ bottom: 16 }}>
          <Text text="Vertical Range Slider" style={{ fontSize: '18px', color: '#000000' }} />
          <RangeSlider
            orientation="vertical"
            defaultValue={[25, 75]}
            min={0}
            max={100}
            step={5}
            marks={true}
            showValue
            trackLength={250}
          />
        </View>
      </ViewLevel2>
    </ScrollView>
  )
}
