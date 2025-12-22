/** @jsxImportSource ../.. */
/**
 * Toggle/Switch component - Binary on/off control with animated thumb
 * Provides smooth animations and flexible theming
 */
import type Phaser from 'phaser'
import { numberToRgb, rgbToNumber } from '../../colors/color-utils'
import { useEffect, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Graphics, Text, View } from '../index'

/**
 * Interpolate between two colors
 * @param color1 - Start color
 * @param color2 - End color
 * @param progress - Interpolation progress (0.0 to 1.0)
 * @returns Interpolated color
 */
function interpolateColor(color1: number, color2: number, progress: number): number {
  const rgb1 = numberToRgb(color1)
  const rgb2 = numberToRgb(color2)

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress)

  return rgbToNumber(r, g, b)
}

/**
 * Props for Toggle component
 */
export interface ToggleProps {
  /** Whether the toggle is checked/on */
  checked?: boolean
  /** Callback when toggle state changes */
  onChange?: (checked: boolean) => void
  /** Optional label text */
  label?: string
  /** Label position relative to toggle */
  labelPosition?: 'left' | 'right' | 'none'
  /** Disabled state */
  disabled?: boolean
  /** Optional prefix content (e.g., Icon) */
  prefix?: ChildrenType
  /** Optional suffix content */
  suffix?: ChildrenType
  /** Theme overrides */
  theme?: PartialTheme
}

/**
 * Toggle/Switch component
 * Animated on/off switch with customizable appearance
 *
 * @example
 * ```tsx
 * // Basic toggle
 * <Toggle checked={isEnabled} onChange={setIsEnabled} label="Enable feature" />
 *
 * // With custom positioning
 * <Toggle
 *   checked={value}
 *   onChange={setValue}
 *   label="Dark Mode"
 *   labelPosition="left"
 * />
 *
 * // With icons
 * <Toggle
 *   checked={value}
 *   onChange={setValue}
 *   prefix={<Icon type="sun" />}
 *   suffix={<Icon type="moon" />}
 * />
 * ```
 */
export function Toggle(props: ToggleProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Toggle', localTheme, props.theme ?? {})

  // Theme values with defaults - use refs for values used in closures
  const width = useRef(themed.width ?? 50)
  const height = useRef(themed.height ?? 28)
  const thumbSize = useRef(themed.thumbSize ?? 24)
  const trackColorOff = useRef(themed.trackColorOff ?? 0x999999)
  const trackColorOn = useRef(themed.trackColorOn ?? 0x4caf50)
  const thumbColor = useRef(themed.thumbColor ?? 0xffffff)
  const disabledColor = useRef(themed.disabledColor ?? 0x666666)
  const padding = useRef(themed.padding ?? 2)
  const duration = useRef(themed.duration ?? 200)
  const gap = themed.gap ?? 8
  const labelPosition = props.labelPosition ?? themed.labelPosition ?? 'right'

  // Update refs when theme changes
  width.current = themed.width ?? 50
  height.current = themed.height ?? 28
  thumbSize.current = themed.thumbSize ?? 24
  trackColorOff.current = themed.trackColorOff ?? 0x999999
  trackColorOn.current = themed.trackColorOn ?? 0x4caf50
  thumbColor.current = themed.thumbColor ?? 0xffffff
  disabledColor.current = themed.disabledColor ?? 0x666666
  padding.current = themed.padding ?? 2
  duration.current = themed.duration ?? 200

  // Calculate positions
  const thumbRadius = thumbSize.current / 2
  const trackRadius = height.current / 2
  const thumbOffsetOff = padding.current + thumbRadius
  const thumbOffsetOn = width.current - padding.current - thumbRadius

  // State
  const initialChecked = props.checked !== undefined ? props.checked : false
  const [checked, setChecked] = useState<boolean>(initialChecked)
  const [isAnimating, setIsAnimating] = useState(false)
  const [thumbX, setThumbX] = useState<number>(initialChecked ? thumbOffsetOn : thumbOffsetOff)

  // Refs
  const trackRef = useRef<Phaser.GameObjects.Graphics | null>(null)
  const thumbRef = useRef<Phaser.GameObjects.Graphics | null>(null)
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)

  // Sync with controlled prop
  useEffect(() => {
    if (props.checked !== undefined && props.checked !== checked) {
      animateToggle(props.checked)
    }
  }, [props.checked, checked])

  /**
   * Animate toggle transition
   */
  const animateToggle = (newChecked: boolean) => {
    const track = trackRef.current
    const container = containerRef.current

    if (!track || !container) return

    const scene = container.scene
    if (!scene) return

    setIsAnimating(true)

    const endX = newChecked ? thumbOffsetOn : thumbOffsetOff

    // Animate thumb position via state
    const startX = thumbX

    console.log('Duration:', duration.current)

    scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: duration.current,
      ease: 'Cubic.easeOut',
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const progress = tween.getValue() as number
        const currentX = startX + (endX - startX) * progress
        setThumbX(currentX)
      },
      onComplete: () => {
        setThumbX(endX)
        setIsAnimating(false)
      },
    })

    // Animate track color
    const startColor = checked ? trackColorOn.current : trackColorOff.current
    const endColor = newChecked ? trackColorOn.current : trackColorOff.current

    scene.tweens.add({
      targets: { value: 0 },
      value: 1,
      duration: duration.current,
      ease: 'Cubic.easeOut',
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const progress = (tween.getValue() as number) ?? 0
        const currentColor = interpolateColor(startColor, endColor, progress)

        track.clear()
        track.fillStyle(props.disabled ? disabledColor.current : currentColor, 1)
        track.fillRoundedRect(0, 0, width.current, height.current, trackRadius)
      },
    })

    setChecked(newChecked)
  }

  /**
   * Handle toggle click
   */
  const handleClick = () => {
    if (props.disabled || isAnimating) return

    const newChecked = !checked
    animateToggle(newChecked)
    props.onChange?.(newChecked)
  }

  /**
   * Draw track graphics
   */
  const drawTrack = (g: Phaser.GameObjects.Graphics) => {
    g.clear()
    const color = props.disabled
      ? disabledColor.current
      : checked
        ? trackColorOn.current
        : trackColorOff.current
    g.fillStyle(color, 1)
    g.fillRoundedRect(0, 0, width.current, height.current, trackRadius)
  }

  /**
   * Draw thumb graphics
   */
  const drawThumb = (g: Phaser.GameObjects.Graphics) => {
    g.clear()
    g.fillStyle(thumbColor.current, 1)
    g.fillCircle(0, 0, thumbRadius)
  }

  // Build toggle element
  const toggleElement = (
    <View
      direction="stack"
      width={width.current}
      height={height.current}
      enableGestures={!props.disabled}
      onTouch={handleClick}
      alpha={props.disabled ? 0.5 : 1}
    >
      {/* Track */}
      <Graphics ref={trackRef} width={width.current} height={height.current} onDraw={drawTrack} />

      {/* Thumb - position controlled by state */}
      <Graphics
        ref={thumbRef}
        width={thumbSize.current}
        height={thumbSize.current}
        x={thumbX}
        y={height.current / 2}
        onDraw={drawThumb}
      />
    </View>
  )

  // Build label if provided
  const labelElement =
    props.label && labelPosition !== 'none' ? (
      <Text text={props.label} style={themed.labelStyle} />
    ) : null

  // Render with label positioning
  if (!props.label || labelPosition === 'none') {
    return (
      <View ref={containerRef} direction="row" alignItems="center" gap={gap} theme={nestedTheme}>
        {props.prefix}
        {toggleElement}
        {props.suffix}
      </View>
    )
  }

  return (
    <View ref={containerRef} direction="row" alignItems="center" gap={gap} theme={nestedTheme}>
      {labelPosition === 'left' && labelElement}
      {props.prefix}
      {toggleElement}
      {props.suffix}
      {labelPosition === 'right' && labelElement}
    </View>
  )
}
