/**
 * ScrollView Snap Example - Snapping to specific positions
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, ScrollView, Text, useState, View } from '@number10/phaserjsx'

export function SnapScrollViewExample() {
  const [snapTo, setSnapTo] = useState<number | undefined>(undefined)
  const [currentSnap, setCurrentSnap] = useState<number>(0)

  // Define snap positions for each item (item height + gap)
  const itemHeight = 80
  const gap = 15
  const snapPositions = Array.from({ length: 8 }, (_, i) => i * (itemHeight + gap))

  return (
    <View padding={20} gap={15} alignItems="center">
      <Text
        text="Snap Scrolling Example"
        style={{ fontSize: '18px', fontStyle: 'bold', color: '#333' }}
      />

      {/* Control buttons */}
      <View direction="row" gap={10} alignItems="center" depth={42}>
        <Button onClick={() => setSnapTo(0)} size="small">
          <Text text="First" style={{ fontSize: '12px' }} />
        </Button>
        <Button onClick={() => setSnapTo(3)} size="small">
          <Text text="Item 4" style={{ fontSize: '12px' }} />
        </Button>
        <Button onClick={() => setSnapTo(7)} size="small">
          <Text text="Last" style={{ fontSize: '12px' }} />
        </Button>
        <Text text={`Current: ${currentSnap + 1}`} style={{ fontSize: '14px', color: '#666' }} />
      </View>

      {/* ScrollView with snap enabled */}
      <View width={300} height={300} backgroundColor={0xf5f5f5} padding={0}>
        <ScrollView
          showVerticalSlider={true}
          sliderSize="small"
          scroll={{ snapIndex: snapTo }}
          snap={{
            positions: snapPositions,
            threshold: itemHeight,
          }}
          snapAlignment="start"
          momentum={true}
          onSnap={(index) => {
            setCurrentSnap(index)
            setSnapTo(undefined) // Reset programmatic snap
          }}
        >
          <View padding={15} gap={gap}>
            {Array.from({ length: 8 }).map((_, index) => (
              <View
                key={index}
                width={'calc(100% - 30px)'}
                height={itemHeight}
                backgroundColor={index % 2 === 0 ? 0x4a90e2 : 0x5da3f0}
                borderWidth={8}
                justifyContent="center"
                alignItems="center"
                padding={20}
              >
                <Text
                  text={`Item ${index + 1}`}
                  style={{ fontSize: '24px', fontStyle: 'bold', color: '#ffffff' }}
                />
                <Text
                  text="Scroll will snap to items"
                  style={{ fontSize: '14px', color: '#ffffff' }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text
        text="Scroll and release - it snaps to nearest item"
        style={{ fontSize: '12px', color: '#888' }}
      />
    </View>
  )
}
