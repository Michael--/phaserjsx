/** @jsxImportSource ../.. */
/**
 * Slider/Range component
 * Provides interactive value selection with horizontal/vertical orientation
 */
import type Phaser from 'phaser'
import type { GestureEventData } from '../../core-props'
import { applyEffectByName, useGameObjectEffect, type EffectDefinition } from '../../effects'
import { useEffect, useMemo, useRef, useState, useTheme, type VNode } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { Graphics, Text, View } from '../index'
import type { ViewProps } from '../view'

/**
 * Slider mark/tick definition
 */
export interface SliderMark {
  /** Value at this mark */
  value: number
  /** Optional label to display */
  label?: VNode
  /** Custom style for this mark */
  style?: {
    color?: number
    height?: number
    width?: number
  }
}

/**
 * Props for Slider component
 */
export interface SliderProps extends Omit<ViewProps, 'children'>, EffectDefinition {
  /** Current value (controlled) */
  value?: number

  /** Default value (uncontrolled) */
  defaultValue?: number

  /** Minimum value */
  min?: number

  /** Maximum value */
  max?: number

  /** Step increment (default: 1) */
  step?: number

  /** Orientation */
  orientation?: 'horizontal' | 'vertical'

  /** Disabled state */
  disabled?: boolean

  /** Show value label on thumb */
  showValue?: boolean

  /** Custom value formatter for label */
  formatValue?: (value: number) => string

  /** Marks/ticks to display */
  marks?: SliderMark[] | boolean

  /** Snap to marks/steps */
  snap?: boolean

  /** Track length (overrides theme default) */
  trackLength?: number

  /** Custom thumb renderer */
  renderThumb?: (value: number, isDragging: boolean) => ChildrenType

  /** Custom track renderer */
  renderTrack?: (fillPercentage: number) => ChildrenType

  /** Callback when value changes */
  onChange?: (value: number) => void

  /** Callback when dragging starts */
  onChangeStart?: (value: number) => void

  /** Callback when dragging ends */
  onChangeEnd?: (value: number) => void
}

/**
 * Default thumb component - circular shape with border
 * @param props - Thumb properties
 * @returns JSX element
 */
function DefaultThumb(props: {
  size: number
  color: number
  borderColor?: number
  borderWidth?: number
  isDragging: boolean
}) {
  const { size, color, borderColor, borderWidth = 0, isDragging } = props
  const scale = isDragging ? 1.1 : 1.0

  return (
    <Graphics
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()

        // Border
        if (borderWidth > 0 && borderColor !== undefined) {
          g.fillStyle(borderColor, 1)
          g.fillCircle(0, 0, size / 2)
        }

        // Fill
        g.fillStyle(color, 1)
        g.fillCircle(0, 0, (size - borderWidth * 2) / 2)
      }}
      scale={scale}
    />
  )
}

/**
 * Slider component - interactive value selection
 * @param props - Slider properties
 * @returns Slider JSX element
 */
export function Slider(props: SliderProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Slider', localTheme, {})

  // State management - controlled vs uncontrolled
  const [internalValue, setInternalValue] = useState<number>(props.defaultValue ?? props.min ?? 0)
  const isControlled = props.value !== undefined
  const value = (isControlled ? props.value : internalValue) ?? 0

  const min = props.min ?? 0
  const max = props.max ?? 100
  const step = props.step ?? 1
  const orientation = props.orientation ?? 'horizontal'
  const disabled = props.disabled ?? false
  const snap = props.snap ?? true

  const trackLength = props.trackLength ?? themed.trackLength ?? 200
  const trackHeight = themed.trackHeight ?? 6
  const thumbSize = themed.thumbSize ?? 20

  const trackRef = useRef<Phaser.GameObjects.Container | null>(null)
  const thumbRef = useRef<Phaser.GameObjects.Container | null>(null)
  const isDraggingRef = useRef(false)
  const virtualPosRef = useRef(0) // Virtual unclamped position (can exceed bounds for sticky edges)

  const { applyEffect } = useGameObjectEffect(thumbRef)

  // Clamp value to valid range
  const clampValue = (val: number): number => {
    return Math.max(min, Math.min(max, val))
  }

  // Snap value to step
  const snapToStep = (val: number): number => {
    const steps = Math.round((val - min) / step)
    return min + steps * step
  }

  // Value to percentage (0-1)
  const valueToPercentage = (val: number): number => {
    if (max === min) return 0
    return (val - min) / (max - min)
  }

  // Position (pixels) to value
  const positionToValue = (pos: number, length: number): number => {
    const percentage = Math.max(0, Math.min(1, pos / length))
    return min + percentage * (max - min)
  }

  // Calculate thumb position from value
  const percentage = valueToPercentage(value)
  const thumbPositionFromValue = percentage * trackLength

  // During drag, calculate position directly from delta
  const [currentDragPos, setCurrentDragPos] = useState(thumbPositionFromValue)

  // Sync drag position with value when not dragging (controlled component support)
  useEffect(() => {
    if (!isDraggingRef.current) {
      setCurrentDragPos(thumbPositionFromValue)
    }
  }, [thumbPositionFromValue])

  // Animated thumb position (disabled during drag for responsive control)

  // Use animated or direct position
  const currentThumbPos = currentDragPos

  // Generate marks if marks={true}
  const marksArray = useMemo<SliderMark[]>(() => {
    if (!props.marks) return []
    if (Array.isArray(props.marks)) return props.marks

    // Auto-generate marks
    const marks: SliderMark[] = []
    for (let val = min; val <= max; val += step) {
      marks.push({ value: val })
    }
    return marks
  }, [props.marks, min, max, step])

  // Handle track touch/click - jump to position
  const handleTrackTouch = (data: GestureEventData) => {
    if (disabled) return
    data.stopPropagation()

    const localPos = orientation === 'horizontal' ? (data.localX ?? 0) : (data.localY ?? 0)
    const newValue = positionToValue(localPos, trackLength)
    const snappedValue = snap ? snapToStep(newValue) : newValue
    const clampedValue = clampValue(snappedValue)

    if (!isControlled) {
      setInternalValue(clampedValue)
    }
    props.onChange?.(clampedValue)
  }

  // Handle thumb drag
  const handleThumbDrag = (data: GestureEventData) => {
    if (disabled) return
    data.stopPropagation()

    if (data.state === 'start') {
      isDraggingRef.current = true
      // Initialize virtual position to current thumb position
      virtualPosRef.current = currentThumbPos

      props.onChangeStart?.(value)
      return
    }

    if (data.state === 'end') {
      isDraggingRef.current = false
      props.onChangeEnd?.(value)

      // Remove effect
      applyEffectByName(applyEffect, 'none')
      return
    }

    if (!isDraggingRef.current) return

    // Use frame-to-frame delta
    const delta = orientation === 'horizontal' ? (data.dx ?? 0) : (data.dy ?? 0)

    // Update virtual position (can exceed bounds)
    virtualPosRef.current += delta

    // Clamp visual position to track bounds
    const newPos = Math.max(0, Math.min(trackLength, virtualPosRef.current))

    // Calculate and update value
    const newValue = positionToValue(newPos, trackLength)
    const snappedValue = snap ? snapToStep(newValue) : newValue
    const clampedValue = clampValue(snappedValue)

    // For snapping, update position to snapped position
    const snappedPercentage = valueToPercentage(clampedValue)
    const snappedPos = snappedPercentage * trackLength
    setCurrentDragPos(snap ? snappedPos : newPos)

    if (!isControlled) {
      setInternalValue(clampedValue)
    }
    props.onChange?.(clampedValue)
  }

  const formatValue = props.formatValue ?? ((v: number) => v.toString())

  const isHorizontal = orientation === 'horizontal'

  const finalAlpha = disabled ? (themed.disabledAlpha ?? 0.4) : (props.alpha ?? 1)

  return (
    <View
      {...props}
      direction={isHorizontal ? 'column' : 'row'}
      alignItems="center"
      justifyContent="center"
      gap={8}
      alpha={finalAlpha}
      theme={nestedTheme}
    >
      {/* Track Container */}
      <View
        ref={trackRef}
        width={isHorizontal ? trackLength : trackHeight}
        height={isHorizontal ? trackHeight : trackLength}
        backgroundColor={themed.trackColor ?? 0x444444}
        cornerRadius={themed.trackBorderRadius ?? trackHeight / 2}
        direction="stack"
        onTouch={handleTrackTouch}
        theme={nestedTheme}
      >
        {/* Filled Track */}
        {props.renderTrack ? (
          <View key={Math.random()}>{props.renderTrack(percentage)}</View>
        ) : (
          <View
            x={0}
            y={0}
            width={isHorizontal ? percentage * trackLength : trackHeight}
            height={isHorizontal ? trackHeight : percentage * trackLength}
            backgroundColor={themed.trackFilledColor ?? 0x4dabf7}
            cornerRadius={themed.trackBorderRadius ?? trackHeight / 2}
            theme={nestedTheme}
          />
        )}

        {/* Marks/Ticks */}
        <View direction="stack" theme={nestedTheme}>
          {marksArray.map((mark) => {
            const markPercentage = valueToPercentage(mark.value)
            const markPos = markPercentage * trackLength

            const markHeight = mark.style?.height ?? themed.markHeight ?? 8
            const markWidth = mark.style?.width ?? themed.markWidth ?? 2
            const markColor = mark.style?.color ?? themed.markColor ?? 0x888888

            return (
              <View
                key={mark.value}
                x={isHorizontal ? markPos - markWidth / 2 : trackHeight / 2 - markWidth / 2}
                y={isHorizontal ? trackHeight / 2 - markHeight / 2 : markPos - markWidth / 2}
                width={isHorizontal ? markWidth : markHeight}
                height={isHorizontal ? markHeight : markWidth}
                backgroundColor={markColor}
                theme={nestedTheme}
                direction="stack"
              >
                {mark.label}
              </View>
            )
          })}
        </View>

        {/* Thumb - center area position, content organized as stack stack from it */}
        <View
          ref={thumbRef}
          x={isHorizontal ? currentThumbPos : 0}
          y={isHorizontal ? 0 : currentThumbPos}
          direction="stack"
          theme={nestedTheme}
        >
          {/* Gripper with onTouchMove, this is the invisible thumb */}
          <View
            x={-thumbSize}
            y={-thumbSize}
            width={thumbSize * 2}
            height={thumbSize * 2}
            // backgroundColor={0xff0000} // debug color
            // backgroundAlpha={0.3} // debug alpha
            onTouchMove={handleThumbDrag}
          />
          {/* Visual thumb - centered in hit area */}
          <View
            x={isHorizontal ? 0 : trackHeight / 2}
            y={isHorizontal ? trackHeight / 2 : 0}
            width={thumbSize}
            height={thumbSize}
            direction="stack"
            theme={nestedTheme}
          >
            {props.renderThumb ? (
              props.renderThumb(value, isDraggingRef.current)
            ) : (
              <DefaultThumb
                size={thumbSize}
                color={themed.thumbColor ?? 0x4dabf7}
                borderColor={themed.thumbBorderColor ?? 0xffffff}
                borderWidth={themed.thumbBorderWidth ?? 2}
                isDragging={isDraggingRef.current}
              />
            )}
          </View>

          {/* Value label - positioned relative to hit area */}
          {props.showValue ? (
            <View
              x={thumbSize}
              y={-(themed.valueLabel?.offset ?? 8)}
              backgroundColor={themed.valueLabel?.backgroundColor ?? 0x000000}
              padding={themed.valueLabel?.padding ?? { left: 6, right: 6, top: 4, bottom: 4 }}
              cornerRadius={themed.valueLabel?.cornerRadius ?? 4}
              theme={nestedTheme}
            >
              <Text
                text={formatValue(value)}
                style={themed.valueLabel?.textStyle ?? { color: '#ffffff', fontSize: '12px' }}
                theme={nestedTheme}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}
