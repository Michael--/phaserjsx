/**
 * Portal Event Blocking Example - Control click-through behavior
 */
/** @jsxImportSource @phaserjsx/ui */
import { Portal, Text, View, useState } from '@phaserjsx/ui'

export function EventBlockingExample() {
  const [showBlocking, setShowBlocking] = useState(false)
  const [showNonBlocking, setShowNonBlocking] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Event Blocking Control" style={{ fontSize: '18px' }} />

        {/* Background clickable area */}
        <View
          width={'fill'}
          height={150}
          backgroundColor={0xe5e7eb}
          cornerRadius={8}
          justifyContent="center"
          alignItems="center"
          onTouch={() => setClickCount(clickCount + 1)}
        >
          <Text text={`Background clicks: ${clickCount}`} style={{ fontSize: '16px' }} />
          <Text text="Click to increment counter" style={{ fontSize: '12px', color: '#666' }} />
        </View>

        {/* Control buttons */}
        <View direction="row" gap={12}>
          <View
            padding={12}
            backgroundColor={0x3b82f6}
            cornerRadius={6}
            onTouch={() => {
              setShowBlocking(!showBlocking)
              setShowNonBlocking(false)
            }}
          >
            <Text
              text={showBlocking ? 'Hide Blocking' : 'Show Blocking'}
              style={{ fontSize: '14px', color: '#fff' }}
            />
          </View>

          <View
            padding={12}
            backgroundColor={0x10b981}
            cornerRadius={6}
            onTouch={() => {
              setShowNonBlocking(!showNonBlocking)
              setShowBlocking(false)
            }}
          >
            <Text
              text={showNonBlocking ? 'Hide Pass-Through' : 'Show Pass-Through'}
              style={{ fontSize: '14px', color: '#fff' }}
            />
          </View>
        </View>
      </View>

      {/* Blocking Portal - prevents click-through */}
      {showBlocking && (
        <Portal depth={1000} blockEvents={true}>
          <View
            x={300}
            y={150}
            width={300}
            height={150}
            backgroundColor={0xef4444}
            cornerRadius={12}
            padding={20}
            justifyContent="center"
            alignItems="center"
          >
            <Text text="Event Blocking ON" style={{ fontSize: '18px', color: '#fff' }} />
            <Text text="Background clicks blocked" style={{ fontSize: '12px', color: '#fff' }} />
          </View>
        </Portal>
      )}

      {/* Non-blocking Portal - allows click-through */}
      {showNonBlocking && (
        <Portal depth={1000} blockEvents={false}>
          <View
            x={300}
            y={150}
            width={300}
            height={150}
            backgroundColor={0xf59e0b}
            cornerRadius={12}
            padding={20}
            justifyContent="center"
            alignItems="center"
          >
            <Text text="Event Blocking OFF" style={{ fontSize: '18px', color: '#fff' }} />
            <Text
              text="Background clicks pass through"
              style={{ fontSize: '12px', color: '#fff' }}
            />
          </View>
        </Portal>
      )}
    </View>
  )
}
