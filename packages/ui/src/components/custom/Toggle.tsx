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
export function Toggle(props: ToggleProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Toggle', localTheme, props.theme ?? {})

  // Theme values with defaults
  const width = themed.width ?? 50
  const height = themed.height ?? 28
  const thumbSize = themed.thumbSize ?? 24
  const trackColorOff = themed.trackColorOff ?? 0x999999
  const trackColorOn = themed.trackColorOn ?? 0x4caf50
  const thumbColor = themed.thumbColor ?? 0xffffff
  const disabledColor = themed.disabledColor ?? 0x666666
  const padding = themed.padding ?? 2
  const duration = themed.duration ?? 200
  const gap = themed.gap ?? 8
  const labelPosition = props.labelPosition ?? themed.labelPosition ?? 'right'

  // State
  const initialChecked = props.checked !== undefined ? props.checked : false
  const [checked, setChecked] = useState<boolean>(initialChecked)
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs
  const trackRef = useRef<Phaser.GameObjects.Graphics | null>(null)
  const thumbRef = useRef<Phaser.GameObjects.Graphics | null>(null)
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)

  // Sync with controlled prop
  useEffect(() => {
    if (props.checked !== undefined && props.checked !== checked) {
      animateToggle(props.checked)
    }
  }, [props.checked])

  // Calculate positions
  const thumbRadius = thumbSize / 2
  const trackRadius = height / 2
  const thumbOffsetOff = padding + thumbRadius
  const thumbOffsetOn = width - padding - thumbRadius

  /**
   * Animate toggle transition
   */
  const animateToggle = (newChecked: boolean) => {
    const track = trackRef.current
    const thumb = thumbRef.current
    const container = containerRef.current

    if (!track || !thumb || !container) return

    const scene = container.scene
    if (!scene) return

    setIsAnimating(true)

    const endX = newChecked ? thumbOffsetOn : thumbOffsetOff

    // Animate thumb position
    scene.tweens.add({
      targets: thumb,
      x: endX,
      duration,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        setIsAnimating(false)
      },
    })

    // Animate track color
    const startColor = checked ? trackColorOn : trackColorOff
    const endColor = newChecked ? trackColorOn : trackColorOff

    scene.tweens.add({
      targets: { value: 0 },
      value: 1,
      duration,
      ease: 'Cubic.easeOut',
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const progress = (tween.getValue() as number) ?? 0
        const currentColor = interpolateColor(startColor, endColor, progress)

        track.clear()
        track.fillStyle(props.disabled ? disabledColor : currentColor, 1)
        track.fillRoundedRect(0, 0, width, height, trackRadius)
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
    const color = props.disabled ? disabledColor : checked ? trackColorOn : trackColorOff
    g.fillStyle(color, 1)
    g.fillRoundedRect(0, 0, width, height, trackRadius)
  }

  /**
   * Draw thumb graphics
   */
  const drawThumb = (g: Phaser.GameObjects.Graphics) => {
    g.clear()
    g.fillStyle(thumbColor, 1)
    g.fillCircle(0, 0, thumbRadius)
  }

  // Initial thumb position
  const initialThumbX = checked ? thumbOffsetOn : thumbOffsetOff
  const thumbY = height / 2

  // Build toggle element
  const toggleElement = (
    <View
      direction="stack"
      width={width}
      height={height}
      enableGestures={!props.disabled}
      onTouch={handleClick}
      alpha={props.disabled ? 0.5 : 1}
    >
      {/* Track */}
      <Graphics ref={trackRef} width={width} height={height} onDraw={drawTrack} />

      {/* Thumb */}
      <Graphics
        ref={thumbRef}
        width={thumbSize}
        height={thumbSize}
        x={initialThumbX}
        y={thumbY}
        onDraw={drawThumb}
      />
    </View>
  )

  // Build label if provided
  const labelElement = props.label && labelPosition !== 'none' && (
    <Text text={props.label} style={themed.labelStyle} />
  )

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
