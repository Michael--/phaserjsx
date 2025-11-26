/**
 * Example demonstrating the new gesture system
 * Shows all gesture types: onTouch, onTouchMove, onDoubleTap, onLongPress
 */
import { Text, View, useState, useThemeTokens, type GestureEventData } from '@phaserjsx/ui'
import { ScrollView } from '../components'
import { ViewLevel2 } from './Helper/ViewLevel'

/**
 * Simple gesture button demonstrating onTouch with maxTouchDuration
 */
function TouchButton() {
  const tokens = useThemeTokens()
  const [touchCount, setTouchCount] = useState(0)
  const [lastWasTooLong, setLastWasTooLong] = useState(false)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={
        lastWasTooLong
          ? tokens?.colors.info.medium.toNumber()
          : tokens?.colors.info.light.toNumber()
      }
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      enableGestures={true}
      maxTouchDuration={500}
      onTouch={() => {
        setTouchCount((c) => c + 1)
        setLastWasTooLong(false)
      }}
      onTouchMove={(data: GestureEventData) => {
        // Visual feedback when holding too long (on end state)
        if (data.state === 'end') {
          setLastWasTooLong(true)
          setTimeout(() => setLastWasTooLong(false), 300)
        }
      }}
    >
      <Text text={`Touch/Click: ${touchCount}`} style={tokens?.textStyles.medium} />
      <Text text="(hold <500ms)" style={tokens?.textStyles.small} />
    </View>
  )
}

/**
 * Double tap detection example
 */
function DoubleTapButton() {
  const tokens = useThemeTokens()
  const [doubleTapCount, setDoubleTapCount] = useState(0)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={tokens?.colors.info.light.toNumber()}
      backgroundAlpha={1.0}
      padding={10}
      alignItems="center"
      justifyContent="center"
      enableGestures={true}
      onDoubleTap={() => {
        setDoubleTapCount((c) => c + 1)
      }}
    >
      <Text text={`Double Tap: ${doubleTapCount}`} style={tokens?.textStyles.medium} />
    </View>
  )
}

/**
 * Long press detection example - no onTouch after long press
 */
function LongPressButton() {
  const tokens = useThemeTokens()
  const [longPressCount, setLongPressCount] = useState(0)
  const [touchCount, setTouchCount] = useState(0)

  return (
    <View
      width={200}
      height={60}
      backgroundColor={tokens?.colors.info.light.toNumber()}
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
      <Text
        text={`Long: ${longPressCount} | Touch: ${touchCount}`}
        style={tokens?.textStyles.medium}
      />
    </View>
  )
}

/**
 * Touch move / drag example with isInside and state ('start' | 'move' | 'end')
 */
function DragBox() {
  const tokens = useThemeTokens()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [localPos, setLocalPos] = useState({ x: 0, y: 0 })
  const [isInside, setIsInside] = useState(true)
  const [gestureState, setGestureState] = useState(false)

  const bgColor =
    gestureState === false
      ? tokens?.colors.info.light.toNumber()
      : isInside
        ? tokens?.colors.success.medium.toNumber()
        : tokens?.colors.warning.medium.toNumber()

  return (
    <View
      width={200}
      backgroundColor={bgColor}
      alignItems="center"
      enableGestures={true}
      onTouchMove={(data: GestureEventData) => {
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
          setGestureState(true)
        } else if (data.state === 'end') {
          setGestureState(false)
        }
      }}
    >
      <Text text={`Drag Me!`} style={tokens?.textStyles.medium} />
      <Text
        text={`Δ: ${position.x.toFixed(0)}, ${position.y.toFixed(0)}`}
        style={tokens?.textStyles.small}
      />
      <Text
        text={`Local: ${localPos.x.toFixed(0)}, ${localPos.y.toFixed(0)}`}
        style={tokens?.textStyles.small}
      />
      <Text
        text={gestureState ? `${isInside ? 'Inside' : 'Outside'}` : 'idle'}
        style={tokens?.textStyles.small}
      />
    </View>
  )
}

/**
 * Main example showing all gesture types
 */
export function GestureExample() {
  const tokens = useThemeTokens()

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          <Text text="Gesture System Demo" style={tokens?.textStyles.title} />

          <Text
            text="New high-level gesture API (mouse + touch)"
            style={tokens?.textStyles.large}
          />

          <View gap={20} direction="column">
            <View>
              <Text text="Touch/Click (max 500ms duration):" style={tokens?.textStyles.medium} />
              <TouchButton />
            </View>

            <View>
              <Text text="Double Tap/Click:" style={tokens?.textStyles.medium} />
              <DoubleTapButton />
            </View>

            <View>
              <Text
                text="Long Press vs Touch (hold 800ms, no Touch after LongPress):"
                style={tokens?.textStyles.medium}
              />
              <LongPressButton />
            </View>

            <View>
              <Text
                text="Drag (state: 'start' | 'move' | 'end' + isInside):"
                style={tokens?.textStyles.medium}
              />
              <DragBox />
            </View>
          </View>

          <Text
            text="💡 All gestures work with both mouse and touch"
            style={tokens?.textStyles.small}
          />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
