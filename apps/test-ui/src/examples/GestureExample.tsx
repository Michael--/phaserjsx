/**
 * Example demonstrating the new gesture system
 * Shows all gesture types: onTouch, onTouchMove, onDoubleTap, onLongPress
 */
import { Text, View, useState } from '@phaserjsx/ui'

/**
 * Simple gesture button demonstrating onTouch with maxTouchDuration
 */
function TouchButton() {
  const [touchCount, setTouchCount] = useState(0)
  const [lastWasTooLong, setLastWasTooLong] = useState(false)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={lastWasTooLong ? 0x666666 : 0x4444ff}
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      enableGestures={true}
      maxTouchDuration={500}
      onTouch={() => {
        setTouchCount((c) => c + 1)
        setLastWasTooLong(false)
      }}
      onTouchMove={(data) => {
        // Visual feedback when holding too long (on end state)
        if (data.state === 'end') {
          setLastWasTooLong(true)
          setTimeout(() => setLastWasTooLong(false), 300)
        }
      }}
    >
      <Text text={`Touch/Click: ${touchCount}`} style={{ color: 'white' }} />
      <Text text="(hold <500ms)" style={{ color: '#aaaaaa' }} />
    </View>
  )
}

/**
 * Double tap detection example
 */
function DoubleTapButton() {
  const [doubleTapCount, setDoubleTapCount] = useState(0)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={0xff4444}
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      justifyContent="center"
      enableGestures={true}
      onDoubleTap={() => {
        setDoubleTapCount((c) => c + 1)
      }}
    >
      <Text text={`Double Tap: ${doubleTapCount}`} style={{ color: 'white' }} />
    </View>
  )
}

/**
 * Long press detection example - no onTouch after long press
 */
function LongPressButton() {
  const [longPressCount, setLongPressCount] = useState(0)
  const [touchCount, setTouchCount] = useState(0)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={0x44ff44}
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      justifyContent="center"
      enableGestures={true}
      longPressDuration={800}
      onTouch={() => {
        setTouchCount((c) => c + 1)
      }}
      onLongPress={() => {
        setLongPressCount((c) => c + 1)
      }}
    >
      <Text text={`Long: ${longPressCount} | Touch: ${touchCount}`} style={{ color: 'black' }} />
    </View>
  )
}

/**
 * Touch move / drag example with isInside and state ('start' | 'move' | 'end')
 */
function DragBox() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [localPos, setLocalPos] = useState({ x: 0, y: 0 })
  const [isInside, setIsInside] = useState(true)
  const [gestureState, setGestureState] = useState(false)

  const bgColor = gestureState === false ? 0x5500aa : isInside ? 0x55aa00 : 0xaa5500

  return (
    <View
      width={200}
      backgroundColor={bgColor}
      alignItems="center"
      enableGestures={true}
      onTouchMove={(data) => {
        const dx = data.dx ?? 0
        const dy = data.dy ?? 0

        // Update position with deltas
        setPosition((pos) => ({
          x: pos.x + dx,
          y: pos.y + dy,
        }))

        // Store local position and inside state
        setLocalPos({ x: data.localX, y: data.localY })
        setIsInside(data.isInside ?? true)

        // Handle state transitions
        if (data.state === 'start') {
          console.log(
            'Drag started at:',
            data.localX.toFixed(0),
            data.localY.toFixed(0),
            'dimension',
            data.width,
            data.height
          )
          setGestureState(true)
        } else if (data.state === 'end') {
          console.log('Drag ended at:', data.localX.toFixed(0), data.localY.toFixed(0))
          setGestureState(false)
        }
      }}
    >
      <Text text={`Drag Me!`} style={{ color: 'white', fontStyle: 'bold' }} />
      <Text
        text={`Δ: ${position.x.toFixed(0)}, ${position.y.toFixed(0)}`}
        style={{ color: 'white' }}
      />
      <Text
        text={`Local: ${localPos.x.toFixed(0)}, ${localPos.y.toFixed(0)}`}
        style={{ color: '#cccccc' }}
      />
      <Text text={gestureState ? `${isInside ? 'Inside' : 'Outside'}` : 'idle'} />
    </View>
  )
}

/**
 * Main example showing all gesture types
 */
export function GestureExample() {
  return (
    <View direction="column">
      <Text text="Gesture System Demo" style={{ color: 'yellow', fontStyle: 'bold' }} />

      <Text text="New high-level gesture API (mouse + touch)" style={{ color: 'white' }} />

      <View gap={20} direction="column">
        <View>
          <Text text="Touch/Click (max 500ms duration):" style={{ color: '#cccccc' }} />
          <TouchButton />
        </View>

        <View>
          <Text text="Double Tap/Click:" style={{ color: '#cccccc' }} />
          <DoubleTapButton />
        </View>

        <View>
          <Text
            text="Long Press vs Touch (hold 800ms, no Touch after LongPress):"
            style={{ color: '#cccccc' }}
          />
          <LongPressButton />
        </View>

        <View>
          <Text
            text="Drag (state: 'start' | 'move' | 'end' + isInside):"
            style={{ color: '#cccccc' }}
          />
          <DragBox />
        </View>
      </View>

      <Text text="💡 All gestures work with both mouse and touch" style={{ color: '#aaaaaa' }} />
    </View>
  )
}
