/**
 * Example demonstrating the new gesture system
 * Shows all gesture types: onTouch, onTouchMove, onDoubleTap, onLongPress
 */
import { Text, View, useState } from '@phaserjsx/ui'

/**
 * Simple gesture button demonstrating onTouch
 */
function TouchButton() {
  const [touchCount, setTouchCount] = useState(0)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={0x4444ff}
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      justifyContent="center"
      enableGestures={true}
      onTouch={() => {
        setTouchCount((c) => c + 1)
      }}
    >
      <Text text={`Touch/Click: ${touchCount}`} style={{ fontSize: 14, color: 'white' }} />
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
      <Text text={`Double Tap: ${doubleTapCount}`} style={{ fontSize: 14, color: 'white' }} />
    </View>
  )
}

/**
 * Long press detection example
 */
function LongPressButton() {
  const [longPressCount, setLongPressCount] = useState(0)

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
      onLongPress={() => {
        setLongPressCount((c) => c + 1)
      }}
    >
      <Text
        text={`Long Press (800ms): ${longPressCount}`}
        style={{ fontSize: 14, color: 'black' }}
      />
    </View>
  )
}

/**
 * Touch move / drag example with delta tracking
 */
function DragBox() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  return (
    <View
      width={200}
      height={100}
      backgroundColor={isDragging ? 0xffaa00 : 0xaa00ff}
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      justifyContent="center"
      enableGestures={true}
      onTouch={() => {
        setIsDragging(true)
      }}
      onTouchMove={(data) => {
        const dx = data.dx ?? 0
        const dy = data.dy ?? 0
        setPosition((pos) => ({
          x: pos.x + dx,
          y: pos.y + dy,
        }))
      }}
    >
      <Text text={`Drag Me!`} style={{ fontSize: 16, color: 'white', fontStyle: 'bold' }} y={-20} />
      <Text
        text={`dx: ${position.x.toFixed(0)}, dy: ${position.y.toFixed(0)}`}
        style={{ fontSize: 12, color: 'white' }}
        y={10}
      />
    </View>
  )
}

/**
 * Main example showing all gesture types
 */
export function GestureExample() {
  return (
    <View width="100%" padding={20} gap={20} direction="column">
      <Text
        text="Gesture System Demo"
        style={{ fontSize: 20, color: 'yellow', fontStyle: 'bold' }}
      />

      <Text
        text="New high-level gesture API (mouse + touch)"
        style={{ fontSize: 14, color: 'white' }}
      />

      <View gap={20} direction="column">
        <View>
          <Text text="Simple Touch/Click:" style={{ fontSize: 12, color: '#cccccc' }} y={-25} />
          <TouchButton />
        </View>

        <View>
          <Text text="Double Tap/Click:" style={{ fontSize: 12, color: '#cccccc' }} y={-25} />
          <DoubleTapButton />
        </View>

        <View>
          <Text
            text="Long Press (hold 800ms):"
            style={{ fontSize: 12, color: '#cccccc' }}
            y={-25}
          />
          <LongPressButton />
        </View>

        <View>
          <Text
            text="Drag (tracks outside bounds!):"
            style={{ fontSize: 12, color: '#cccccc' }}
            y={-25}
          />
          <DragBox />
        </View>
      </View>

      <View backgroundColor={0x333333} backgroundAlpha={0.5} padding={15} width="100%">
        <Text
          text="💡 All gestures work with both mouse and touch"
          style={{ fontSize: 12, color: '#aaaaaa' }}
        />
      </View>
    </View>
  )
}
