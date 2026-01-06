/** @jsxImportSource @number10/phaserjsx */
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
  useThemeTokens,
  View,
  type VNodeLike,
} from '@number10/phaserjsx'
import { ViewLevel2, ViewLevel3 } from './Helper'

function CenterOriginLabel(props: { children: VNodeLike }) {
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
  const tokens = useThemeTokens()
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#000000'
  const headingStyle =
    tokens?.textStyles.title ?? ({ fontSize: '28px', fontStyle: 'bold', color: textColor } as const)
  const subheadingStyle =
    tokens?.textStyles.medium ?? ({ fontSize: '16px', color: textColor } as const)
  const mediumStyle = tokens?.textStyles.medium ?? ({ fontSize: '16px', color: textColor } as const)
  const smallStyle = tokens?.textStyles.small ?? ({ fontSize: '12px', color: textColor } as const)
  const largeStyle = tokens?.textStyles.large ?? ({ fontSize: '20px', color: textColor } as const)
  const mutedStyle = { ...smallStyle, color: tokens?.colors.text.light.toString() ?? textColor }
  const hotColor = tokens?.colors.error.medium.toString() ?? textColor
  const coldColor = tokens?.colors.info.light.toString() ?? textColor
  const roomColor = textColor
  const accentFill =
    tokens?.colors.accent.dark.toNumber() ?? tokens?.colors.primary.dark.toNumber() ?? 0

  return (
    <ScrollView width="fill" height="fill" padding={20}>
      <ViewLevel2>
        <Text text="Slider Component Examples" style={headingStyle} margin={{ bottom: 20 }} />

        {/* Basic Horizontal Slider */}
        <ViewLevel3 width={'fill'}>
          <Text text="Basic Horizontal Slider" style={subheadingStyle} />
          <Slider
            value={volume}
            onChange={(v) => {
              setVolume(v)
            }}
            min={0}
            max={100}
            step={1}
          />
          <Text text={`Volume: ${volume}%`} style={smallStyle} />
        </ViewLevel3>

        {/* With Value Label */}
        <ViewLevel3 width={'fill'}>
          <Text text="With Value Label" style={subheadingStyle} />
          <Slider
            defaultValue={65}
            min={0}
            max={100}
            step={5}
            showValue
            formatValue={(v: number) => `${v}%`}
            trackLength={300}
          />
        </ViewLevel3>

        {/* Temperature Slider with Marks */}
        <ViewLevel3 width={'fill'}>
          <Text text="With Marks and Labels" style={subheadingStyle} />
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
                      <Text text={'Cold'} style={{ ...mediumStyle, color: coldColor }} />
                    </CenterOriginLabel>
                  ),
                },
                {
                  value: 0,
                  label: (
                    <CenterOriginLabel>
                      <Text
                        text={'0°C'}
                        style={{
                          ...mediumStyle,
                          color: tokens?.colors.info.medium.toString() ?? textColor,
                        }}
                      />
                    </CenterOriginLabel>
                  ),
                },
                {
                  value: 20,
                  label: (
                    <CenterOriginLabel>
                      <Text text={'Room'} style={{ ...mediumStyle, color: roomColor }} />
                    </CenterOriginLabel>
                  ),
                },
                {
                  value: 40,
                  label: (
                    <CenterOriginLabel>
                      <Text text={'Hot'} style={{ ...mediumStyle, color: hotColor }} />
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
              style={{ ...largeStyle, color: tokens?.colors.text.light.toString() ?? textColor }}
            />
          </View>
        </ViewLevel3>

        {/* Auto-Generated Marks */}
        <ViewLevel3 width={'fill'}>
          <Text text="Auto-Generated Marks" style={subheadingStyle} />
          <Slider defaultValue={5} min={0} max={10} step={1} marks={true} trackLength={250} />
        </ViewLevel3>

        {/* Disabled Slider */}
        <ViewLevel3 width={'fill'}>
          <Text text="Disabled State" style={subheadingStyle} />
          <Slider value={50} min={0} max={100} disabled trackLength={250} />
        </ViewLevel3>

        {/* Continuous (No Snap) */}
        <ViewLevel3 width={'fill'}>
          <Text text="Continuous (No Snap)" style={subheadingStyle} />
          <Slider
            defaultValue={50}
            min={0}
            max={100}
            snap={false}
            showValue
            formatValue={(v: number) => `${v.toFixed(2)}`}
            trackLength={280}
          />
        </ViewLevel3>

        {/* Custom Thumb Rendering */}
        <ViewLevel3 width={'fill'}>
          <Text text="Custom Thumb (Square)" style={subheadingStyle} />
          <Slider
            defaultValue={30}
            min={0}
            max={100}
            renderThumb={(_value: number, isDragging: boolean) => (
              <Graphics
                onDraw={(g: Phaser.GameObjects.Graphics) => {
                  g.clear()
                  g.fillStyle(tokens?.colors.surface.dark.toNumber() ?? 0, 1)
                  g.fillRect(-10, -10, 20, 20)
                }}
                scale={isDragging ? 1.1 : 1}
              />
            )}
            trackLength={250}
          />
        </ViewLevel3>

        {/* Custom Track Rendering */}
        <ViewLevel3 width={'fill'}>
          <Text text="Custom Track" style={subheadingStyle} />
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
                  g.lineStyle(10, accentFill, 1)
                  for (let i = 0; i < length * fillPercentage; i += 10) {
                    g.lineBetween(i, 0, i + height, height)
                  }
                }}
              />
            )}
            trackLength={250}
          />
        </ViewLevel3>

        {/* Fine Step Size */}
        <ViewLevel3 width={'fill'}>
          <Text text="Fine Step Size (0.1)" style={subheadingStyle} />
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
        </ViewLevel3>

        {/* Large Value Range */}
        <ViewLevel3 width={'fill'}>
          <Text text="Large Value Range (-100 to 100)" style={subheadingStyle} />
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
        </ViewLevel3>

        <ViewLevel2 direction="row">
          {/* Basic Vertical Slider */}
          <ViewLevel3 width={'fill'}>
            <Text text="Basic Vertical Slider" style={subheadingStyle} />
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
            <Text text={`Volume: ${volume}%`} style={mutedStyle} />
          </ViewLevel3>

          {/* Vertical Slider with Marks */}
          <ViewLevel3 width={'fill'}>
            <Text text="Vertical with Marks" style={subheadingStyle} />
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
          </ViewLevel3>
        </ViewLevel2>

        {/* Reverse Direction Examples */}
        <Text
          text="Reverse Direction (right-to-left / bottom-to-top)"
          style={headingStyle}
          margin={{ top: 20, bottom: 12 }}
        />

        {/* Horizontal Reversed */}
        <ViewLevel3 width={'fill'}>
          <Text text="Horizontal Reversed (100 → 0)" style={subheadingStyle} />
          <Slider defaultValue={30} min={0} max={100} reverse showValue trackLength={300} />
        </ViewLevel3>

        {/* Vertical Reversed */}
        <ViewLevel3 width={'fill'}>
          <Text text="Vertical Reversed (top-to-bottom)" style={subheadingStyle} />
          <Slider
            orientation="vertical"
            defaultValue={40}
            min={0}
            max={100}
            reverse
            showValue
            trackLength={200}
          />
        </ViewLevel3>

        {/* Range Slider Examples */}
        <Text
          text="Range Slider (Two Thumbs)"
          style={headingStyle}
          margin={{ top: 20, bottom: 12 }}
        />

        {/* Basic Range Slider */}
        <ViewLevel3 width={'fill'}>
          <Text text="Price Range" style={subheadingStyle} />
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
          <Text text={`Selected: $${priceRange[0]} - $${priceRange[1]}`} style={mutedStyle} />
        </ViewLevel3>

        {/* Range Slider with Marks */}
        <ViewLevel3 width={'fill'}>
          <Text text="Time Range (with marks)" style={subheadingStyle} />
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
            style={mutedStyle}
          />
        </ViewLevel3>

        {/* Range Slider Reversed */}
        <ViewLevel3 width={'fill'}>
          <Text text="Range Slider Reversed" style={subheadingStyle} />
          <RangeSlider
            defaultValue={[30, 70]}
            min={0}
            max={100}
            reverse
            showValue
            trackLength={300}
          />
        </ViewLevel3>

        {/* Range Slider with Min Distance */}
        <ViewLevel3 width={'fill'}>
          <Text text="Range Slider with Min Distance (10)" style={subheadingStyle} />
          <RangeSlider
            defaultValue={[40, 60]}
            min={0}
            max={100}
            minDistance={10}
            showValue
            trackLength={300}
          />
        </ViewLevel3>

        {/* Vertical Range Slider */}
        <ViewLevel3 width={'fill'}>
          <Text text="Vertical Range Slider" style={subheadingStyle} />
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
        </ViewLevel3>
      </ViewLevel2>
    </ScrollView>
  )
}
