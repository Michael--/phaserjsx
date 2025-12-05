/**
 * Slider with Marks Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { RefOriginView, Slider, Text, useState, View, type VNode } from '@phaserjsx/ui'

// Helper component to center the label below the mark
function CenterOriginLabel(props: { children: VNode }) {
  return (
    <RefOriginView originX={0.5} originY={0.5}>
      <View width={100} height={100} x={-50} y={-30} alignItems="center" justifyContent="center">
        {props.children}
      </View>
    </RefOriginView>
  )
}

export function CustomMarksAndLabelsExample() {
  const [temperature, setTemperature] = useState(20)
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
      {/* Temperature Slider with Marks */}
      <View
        width={'fill'}
        gap={12}
        padding={{ left: 30, top: 16, right: 16, bottom: 30 }}
        backgroundColor={0xbbbbbb}
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
            style={{ fontSize: '20px', color: '#ffff00' }}
          />
        </View>
      </View>
    </View>
  )
}
