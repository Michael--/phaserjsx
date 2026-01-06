/** @jsxImportSource ../.. */
/**
 * Slider/Range component
 * Provides interactive value selection with horizontal/vertical orientation
 */
import type * as Phaser from 'phaser'
import type { ViewProps } from '..'
import type { GestureEventData } from '../../core-props'
import { applyEffectByName, useGameObjectEffect, type EffectDefinition } from '../../effects'
import { useEffect, useMemo, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Graphics, Text, View } from '../index'
import { RefOriginView } from './RefOriginView'

/**
 * Slider mark/tick definition
 */
export interface SliderMark {
  /** Value at this mark */
  value: number
  /** Optional label to display */
  label?: VNodeLike
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

  /** Reverse direction (right-to-left or bottom-to-top) */
  reverse?: boolean

  /** Disabled state */
  disabled?: boolean

  /** Show value label on thumb */
  showValue?: boolean

  /** Value label offset (x, y) relative to thumb - overrides theme */
  valueLabelOffset?: { x?: number; y?: number }

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
 * Props for RangeSlider component
 */
export interface RangeSliderProps extends Omit<ViewProps, 'children'>, EffectDefinition {
  /** Current value range (controlled) */
  value?: [number, number]

  /** Default value range (uncontrolled) */
  defaultValue?: [number, number]

  /** Minimum value */
  min?: number

  /** Maximum value */
  max?: number

  /** Step increment (default: 1) */
  step?: number

  /** Orientation */
  orientation?: 'horizontal' | 'vertical'

  /** Reverse direction (right-to-left or bottom-to-top) */
  reverse?: boolean

  /** Disabled state */
  disabled?: boolean

  /** Show value labels on thumbs */
  showValue?: boolean

  /** Value label offset for first thumb (x, y) - overrides theme */
  valueLabelOffset1?: { x?: number; y?: number }

  /** Value label offset for second thumb (x, y) - overrides theme */
  valueLabelOffset2?: { x?: number; y?: number }

  /** Custom value formatter for labels */
  formatValue?: (value: number) => string

  /** Marks/ticks to display */
  marks?: SliderMark[] | boolean

  /** Snap to marks/steps */
  snap?: boolean

  /** Track length (overrides theme default) */
  trackLength?: number

  /** Minimum distance between thumbs */
  minDistance?: number

  /** Custom thumb renderer */
  renderThumb?: (value: number, isDragging: boolean, thumbIndex?: number) => ChildrenType

  /** Custom track renderer */
  renderTrack?: (startPercentage: number, endPercentage?: number) => ChildrenType

  /** Callback when value changes */
  onChange?: (value: [number, number]) => void

  /** Callback when dragging starts */
  onChangeStart?: (value: [number, number]) => void

  /** Callback when dragging ends */
  onChangeEnd?: (value: [number, number]) => void
}

/**
 * Internal props for BaseSlider
 */
interface BaseSliderProps extends Omit<ViewProps, 'children'>, EffectDefinition {
  mode: 'single' | 'range'
  value?: number | [number, number]
  defaultValue?: number | [number, number]
  min?: number
  max?: number
  step?: number
  orientation?: 'horizontal' | 'vertical'
  reverse?: boolean
  disabled?: boolean
  showValue?: boolean
  valueLabelOffset?: { x?: number; y?: number }
  valueLabelOffset1?: { x?: number; y?: number }
  valueLabelOffset2?: { x?: number; y?: number }
  formatValue?: (value: number) => string
  marks?: SliderMark[] | boolean
  snap?: boolean
  trackLength?: number
  minDistance?: number
  renderThumb?: (value: number, isDragging: boolean, thumbIndex?: number) => ChildrenType
  renderTrack?: (startOrFillPercentage: number, endPercentage?: number) => ChildrenType
  onChange?: ((value: number) => void) | ((value: [number, number]) => void)
  onChangeStart?: ((value: number) => void) | ((value: [number, number]) => void)
  onChangeEnd?: ((value: number) => void) | ((value: [number, number]) => void)
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
  dragScale?: number
}) {
  const { size, color, borderColor, borderWidth = 0, isDragging, dragScale = 1.1 } = props
  const scale = isDragging ? dragScale : 1.0

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
 * Base slider implementation - shared between Slider and RangeSlider
 * @param props - Base slider properties
 * @returns Slider JSX element
 */
function BaseSlider(props: BaseSliderProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Slider', localTheme, {})

  const mode = props.mode
  const isRange = mode === 'range'

  // State management - controlled vs uncontrolled
  const defaultSingleValue = (props.defaultValue as number | undefined) ?? props.min ?? 0
  const defaultRangeValue: [number, number] = (props.defaultValue as
    | [number, number]
    | undefined) ?? [props.min ?? 0, props.max ?? 100]

  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    isRange ? defaultRangeValue : defaultSingleValue
  )

  const isControlled = props.value !== undefined
  const value = isControlled ? props.value : internalValue

  const min = props.min ?? 0
  const max = props.max ?? 100

  // Extract values for single/range mode
  const singleValue = !isRange ? (value as number) : 0
  const rangeValue: [number, number] = isRange ? (value as [number, number]) : [min, max]
  const step = props.step ?? 1
  const orientation = props.orientation ?? 'horizontal'
  const reverse = props.reverse ?? false
  const disabled = props.disabled ?? false
  const snap = props.snap ?? true
  const minDistance = props.minDistance ?? step

  const trackLength = props.trackLength ?? themed.trackLength ?? 200
  const trackHeight = themed.trackHeight ?? 6
  const thumbSize = themed.thumbSize ?? 20

  const trackRef = useRef<Phaser.GameObjects.Container | null>(null)
  const thumb1Ref = useRef<Phaser.GameObjects.Container | null>(null)
  const thumb2Ref = useRef<Phaser.GameObjects.Container | null>(null)
  const [isDragging1, setIsDragging1] = useState(false)
  const [isDragging2, setIsDragging2] = useState(false)
  const virtualPos1Ref = useRef(0)
  const virtualPos2Ref = useRef(0)

  const { applyEffect: applyEffect1 } = useGameObjectEffect(thumb1Ref)
  const { applyEffect: applyEffect2 } = useGameObjectEffect(thumb2Ref)

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

  // Position (pixels) to value - respects reverse
  const positionToValue = (pos: number, length: number): number => {
    const actualPos = reverse ? length - pos : pos
    const percentage = Math.max(0, Math.min(1, actualPos / length))
    return min + percentage * (max - min)
  }

  // Value to position (pixels) - respects reverse
  const valueToPosition = (val: number): number => {
    const percentage = valueToPercentage(val)
    const pos = percentage * trackLength
    return reverse ? trackLength - pos : pos
  }

  // Calculate thumb positions from values
  const thumb1Value = (isRange ? rangeValue[0] : singleValue) ?? 0
  const thumb2Value = (isRange ? rangeValue[1] : 0) ?? 0

  const thumb1PositionFromValue = valueToPosition(thumb1Value)
  const thumb2PositionFromValue = isRange ? valueToPosition(thumb2Value) : 0

  // During drag, calculate position directly from delta
  const [currentDragPos1, setCurrentDragPos1] = useState(thumb1PositionFromValue)
  const [currentDragPos2, setCurrentDragPos2] = useState(thumb2PositionFromValue)

  // Sync drag positions with values when not dragging (controlled component support)
  useEffect(() => {
    if (!isDragging1) {
      setCurrentDragPos1(thumb1PositionFromValue)
    }
  }, [thumb1PositionFromValue, isDragging1])

  useEffect(() => {
    if (!isDragging2 && isRange) {
      setCurrentDragPos2(thumb2PositionFromValue)
    }
  }, [thumb2PositionFromValue, isRange, isDragging2])

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

    if (isRange) {
      // Find closest thumb
      const dist1 = Math.abs(clampedValue - rangeValue[0])
      const dist2 = Math.abs(clampedValue - rangeValue[1])
      const useThumb1 = dist1 <= dist2

      const newRangeValue: [number, number] = useThumb1
        ? [clampedValue, rangeValue[1]]
        : [rangeValue[0], clampedValue]

      // Enforce min distance
      if (newRangeValue[1] - newRangeValue[0] < minDistance) {
        return
      }

      if (!isControlled) {
        setInternalValue(newRangeValue)
      }
      ;(props.onChange as ((v: [number, number]) => void) | undefined)?.(newRangeValue)
    } else {
      if (!isControlled) {
        setInternalValue(clampedValue)
      }
      ;(props.onChange as ((v: number) => void) | undefined)?.(clampedValue)
    }
  }

  // Handle thumb drag
  const handleThumbDrag = (thumbIndex: number) => (data: GestureEventData) => {
    if (disabled) return
    data.stopPropagation()

    const isThumb1 = thumbIndex === 0
    const isDragging = isThumb1 ? isDragging1 : isDragging2
    const setIsDragging = isThumb1 ? setIsDragging1 : setIsDragging2
    const virtualPosRef = isThumb1 ? virtualPos1Ref : virtualPos2Ref
    const setCurrentDragPos = isThumb1 ? setCurrentDragPos1 : setCurrentDragPos2
    const currentThumbPos = isThumb1 ? currentDragPos1 : currentDragPos2
    const applyEffect = isThumb1 ? applyEffect1 : applyEffect2

    if (data.state === 'start') {
      setIsDragging(true)
      virtualPosRef.current = currentThumbPos

      if (isRange) {
        ;(props.onChangeStart as ((v: [number, number]) => void) | undefined)?.(rangeValue)
      } else {
        ;(props.onChangeStart as ((v: number) => void) | undefined)?.(singleValue)
      }
      return
    }

    if (data.state === 'end') {
      setIsDragging(false)

      if (isRange) {
        ;(props.onChangeEnd as ((v: [number, number]) => void) | undefined)?.(rangeValue)
      } else {
        ;(props.onChangeEnd as ((v: number) => void) | undefined)?.(singleValue)
      }

      applyEffectByName(applyEffect, 'none')
      return
    }

    if (!isDragging) return

    // Use frame-to-frame delta
    const delta = orientation === 'horizontal' ? (data.dx ?? 0) : (data.dy ?? 0)

    // Update virtual position (can exceed bounds)
    virtualPosRef.current += delta

    // Clamp visual position to track bounds
    const newPos = Math.max(0, Math.min(trackLength, virtualPosRef.current))

    // Calculate and update value
    let newValue = positionToValue(newPos, trackLength)
    newValue = snap ? snapToStep(newValue) : newValue

    if (isRange) {
      let newRangeValue: [number, number] = isThumb1
        ? [newValue, rangeValue[1]]
        : [rangeValue[0], newValue]

      // Enforce bounds and min distance
      if (isThumb1) {
        newRangeValue[0] = clampValue(newRangeValue[0])
        if (newRangeValue[1] - newRangeValue[0] < minDistance) {
          newRangeValue[0] = newRangeValue[1] - minDistance
        }
        newRangeValue[0] = clampValue(newRangeValue[0])
      } else {
        newRangeValue[1] = clampValue(newRangeValue[1])
        if (newRangeValue[1] - newRangeValue[0] < minDistance) {
          newRangeValue[1] = newRangeValue[0] + minDistance
        }
        newRangeValue[1] = clampValue(newRangeValue[1])
      }

      // Update position to reflect clamped value
      const clampedPos = valueToPosition(isThumb1 ? newRangeValue[0] : newRangeValue[1])
      setCurrentDragPos(snap ? clampedPos : newPos)

      if (!isControlled) {
        setInternalValue(newRangeValue)
      }
      ;(props.onChange as ((v: [number, number]) => void) | undefined)?.(newRangeValue)
    } else {
      const clampedValue = clampValue(newValue)
      const snappedPos = valueToPosition(clampedValue)
      setCurrentDragPos(snap ? snappedPos : newPos)

      if (!isControlled) {
        setInternalValue(clampedValue)
      }
      ;(props.onChange as ((v: number) => void) | undefined)?.(clampedValue)
    }
  }

  const formatValue = props.formatValue ?? ((v: number) => v.toString())

  const isHorizontal = orientation === 'horizontal'

  const finalAlpha = disabled ? (themed.disabledAlpha ?? 0.4) : (props.alpha ?? 1)

  // Calculate value label offsets with smart defaults for RangeSlider
  // Labels are centered (origin 0.5, 0.5), so offset is from thumb center
  const defaultThemeOffset = themed.valueLabel?.offset ?? 8
  const labelGap = thumbSize + 8 // Gap from thumb edge + small padding

  // For single slider: label follows reverse direction (left if reversed, right if normal)
  // For range slider: labels on opposite sides (flipped if reversed)
  const labelOffset1 = {
    x:
      props.valueLabelOffset1?.x ??
      props.valueLabelOffset?.x ??
      (isRange
        ? isHorizontal
          ? reverse
            ? labelGap
            : -labelGap
          : labelGap
        : isHorizontal
          ? reverse
            ? -labelGap
            : labelGap
          : labelGap),
    y:
      props.valueLabelOffset1?.y ??
      props.valueLabelOffset?.y ??
      (isRange
        ? !isHorizontal
          ? reverse
            ? labelGap
            : -labelGap
          : -defaultThemeOffset
        : !isHorizontal
          ? reverse
            ? labelGap
            : -defaultThemeOffset
          : -defaultThemeOffset),
  }
  const labelOffset2 = {
    x:
      props.valueLabelOffset2?.x ??
      (isRange ? (isHorizontal ? (reverse ? -labelGap : labelGap) : labelGap) : labelGap),
    y:
      props.valueLabelOffset2?.y ??
      (isRange
        ? !isHorizontal
          ? reverse
            ? -labelGap
            : labelGap
          : -defaultThemeOffset
        : -defaultThemeOffset),
  }

  // Calculate fill track dimensions
  const fillStartPercentage = isRange ? valueToPercentage(rangeValue[0]) : 0
  const fillEndPercentage = isRange
    ? valueToPercentage(rangeValue[1])
    : valueToPercentage(singleValue)

  const fillStartPos = reverse
    ? trackLength - fillEndPercentage * trackLength
    : fillStartPercentage * trackLength
  const fillEndPos = reverse
    ? trackLength - fillStartPercentage * trackLength
    : fillEndPercentage * trackLength
  const fillLength = fillEndPos - fillStartPos

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
          <View key={Math.random()}>
            {props.renderTrack(fillStartPercentage, isRange ? fillEndPercentage : undefined)}
          </View>
        ) : (
          <View
            x={isHorizontal ? fillStartPos : 0}
            y={isHorizontal ? 0 : fillStartPos}
            width={isHorizontal ? fillLength : trackHeight}
            height={isHorizontal ? trackHeight : fillLength}
            backgroundColor={themed.trackFilledColor ?? 0x4dabf7}
            cornerRadius={themed.trackBorderRadius ?? trackHeight / 2}
            theme={nestedTheme}
          />
        )}

        {/* Marks/Ticks */}
        <View direction="stack" theme={nestedTheme}>
          {marksArray.map((mark) => {
            const markPercentage = valueToPercentage(mark.value)
            const markPos = reverse
              ? trackLength - markPercentage * trackLength
              : markPercentage * trackLength

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

        {/* Thumb 1 (or single thumb) */}
        <View
          ref={thumb1Ref}
          x={isHorizontal ? currentDragPos1 : 0}
          y={isHorizontal ? 0 : currentDragPos1}
          direction="stack"
          theme={nestedTheme}
        >
          <View
            x={-thumbSize}
            y={-thumbSize}
            width={thumbSize * 2}
            height={thumbSize * 2}
            onTouchMove={handleThumbDrag(0)}
          />
          <View
            x={isHorizontal ? 0 : trackHeight / 2}
            y={isHorizontal ? trackHeight / 2 : 0}
            width={thumbSize}
            height={thumbSize}
            direction="stack"
            theme={nestedTheme}
          >
            {props.renderThumb ? (
              props.renderThumb(thumb1Value, isDragging1, 0)
            ) : (
              <DefaultThumb
                size={thumbSize}
                color={themed.thumbColor ?? 0x4dabf7}
                borderColor={themed.thumbBorderColor ?? 0xffffff}
                borderWidth={themed.thumbBorderWidth ?? 2}
                isDragging={isDragging1}
                dragScale={themed.thumbDragScale ?? 1.1}
              />
            )}
          </View>

          {props.showValue ? (
            <RefOriginView
              x={labelOffset1.x}
              y={labelOffset1.y}
              width={0}
              height={0}
              originX={0.5}
              originY={0.5}
            >
              <View
                width={100}
                height={50}
                x={-50}
                y={-25}
                alignItems="center"
                justifyContent="center"
              >
                <View
                  backgroundColor={themed.valueLabel?.backgroundColor ?? 0x000000}
                  padding={themed.valueLabel?.padding ?? { left: 6, right: 6, top: 4, bottom: 4 }}
                  cornerRadius={themed.valueLabel?.cornerRadius ?? 4}
                  theme={nestedTheme}
                >
                  <Text
                    text={formatValue(thumb1Value)}
                    style={themed.valueLabel?.textStyle ?? { color: '#ffffff', fontSize: '12px' }}
                    theme={nestedTheme}
                  />
                </View>
              </View>
            </RefOriginView>
          ) : null}
        </View>

        {/* Thumb 2 (range mode only) */}
        {isRange ? (
          <View
            ref={thumb2Ref}
            x={isHorizontal ? currentDragPos2 : 0}
            y={isHorizontal ? 0 : currentDragPos2}
            direction="stack"
            theme={nestedTheme}
          >
            <View
              x={-thumbSize}
              y={-thumbSize}
              width={thumbSize * 2}
              height={thumbSize * 2}
              onTouchMove={handleThumbDrag(1)}
            />
            <View
              x={isHorizontal ? 0 : trackHeight / 2}
              y={isHorizontal ? trackHeight / 2 : 0}
              width={thumbSize}
              height={thumbSize}
              direction="stack"
              theme={nestedTheme}
            >
              {props.renderThumb ? (
                props.renderThumb(thumb2Value, isDragging2, 1)
              ) : (
                <DefaultThumb
                  size={thumbSize}
                  color={themed.thumbColor ?? 0x4dabf7}
                  borderColor={themed.thumbBorderColor ?? 0xffffff}
                  borderWidth={themed.thumbBorderWidth ?? 2}
                  isDragging={isDragging2}
                  dragScale={themed.thumbDragScale ?? 1.1}
                />
              )}
            </View>

            {props.showValue ? (
              <RefOriginView
                x={labelOffset2.x}
                y={labelOffset2.y}
                width={0}
                height={0}
                originX={0.5}
                originY={0.5}
              >
                <View
                  width={100}
                  height={50}
                  x={-50}
                  y={-25}
                  alignItems="center"
                  justifyContent="center"
                >
                  <View
                    backgroundColor={themed.valueLabel?.backgroundColor ?? 0x000000}
                    padding={themed.valueLabel?.padding ?? { left: 6, right: 6, top: 4, bottom: 4 }}
                    cornerRadius={themed.valueLabel?.cornerRadius ?? 4}
                    theme={nestedTheme}
                  >
                    <Text
                      text={formatValue(thumb2Value)}
                      style={themed.valueLabel?.textStyle ?? { color: '#ffffff', fontSize: '12px' }}
                      theme={nestedTheme}
                    />
                  </View>
                </View>
              </RefOriginView>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  )
}

/**
 * Slider component - interactive single value selection
 * @param props - Slider properties
 * @returns Slider JSX element
 */
export function Slider(props: SliderProps): VNodeLike {
  return <BaseSlider {...props} mode="single" />
}

/**
 * RangeSlider component - interactive range selection with two thumbs
 * @param props - RangeSlider properties
 * @returns RangeSlider JSX element
 */
export function RangeSlider(props: RangeSliderProps): VNodeLike {
  return <BaseSlider {...props} mode="range" />
}
