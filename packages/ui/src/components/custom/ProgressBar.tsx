/** @jsxImportSource ../.. */
/**
 * ProgressBar component - determinate progress indicator for health, loading, cooldowns, and XP.
 */
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { VNodeLike } from '../../vdom'
import { Text, View, type ViewProps } from '../index'

export type ProgressBarOrientation = 'horizontal' | 'vertical'
export type ProgressBarLabelPosition = 'none' | 'inside' | 'top' | 'bottom' | 'left' | 'right'

export interface ProgressBarFormatProps {
  value: number
  min: number
  max: number
  ratio: number
  percent: number
}

export interface ProgressBarProps extends Omit<ViewProps, 'children'> {
  /** Current progress value */
  value: number
  /** Minimum value used for normalization */
  min?: number
  /** Maximum value used for normalization */
  max?: number
  /** Progress direction */
  orientation?: ProgressBarOrientation
  /** Optional static label prefix */
  label?: string
  /** Show formatted value text */
  showValue?: boolean
  /** Position of the label/value text */
  labelPosition?: ProgressBarLabelPosition
  /** Custom formatter for value text */
  formatValue?: (props: ProgressBarFormatProps) => string
  /** Track/background color */
  trackColor?: number
  /** Filled progress color */
  fillColor?: number
  /** Border color around the track */
  borderColor?: number
  /** Border width around the track */
  borderWidth?: number
  /** Track corner radius */
  cornerRadius?: number
  /** Text style for label/value */
  labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
  /** Disabled state */
  disabled?: boolean
  /** Alpha applied while disabled */
  disabledAlpha?: number
  /** Theme overrides */
  theme?: PartialTheme
}

export function clampProgressValue(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(Math.max(value, min), max)
}

export function getProgressRatio(value: number, min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return 0

  const normalizedMin = Math.min(min, max)
  const normalizedMax = Math.max(min, max)
  const clamped = clampProgressValue(value, normalizedMin, normalizedMax)

  return (clamped - normalizedMin) / (normalizedMax - normalizedMin)
}

function formatDefaultValue(props: ProgressBarFormatProps): string {
  return `${Math.round(props.percent)}%`
}

export function ProgressBar(props: ProgressBarProps): VNodeLike {
  const {
    value,
    min = 0,
    max = 100,
    orientation: explicitOrientation,
    label,
    showValue,
    labelPosition: explicitLabelPosition,
    formatValue,
    trackColor: explicitTrackColor,
    fillColor: explicitFillColor,
    borderColor: explicitBorderColor,
    borderWidth: explicitBorderWidth,
    cornerRadius: explicitCornerRadius,
    labelStyle: explicitLabelStyle,
    disabled = false,
    disabledAlpha: explicitDisabledAlpha,
    theme,
    width,
    height,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('ProgressBar', localTheme, theme ?? {})

  const orientation = explicitOrientation ?? themed.orientation ?? 'horizontal'
  const ratio = getProgressRatio(value, min, max)
  const percent = ratio * 100
  const labelPosition =
    explicitLabelPosition ?? themed.labelPosition ?? (showValue || label ? 'right' : 'none')
  const shouldShowText = labelPosition !== 'none' && Boolean(showValue || label)
  const text = shouldShowText
    ? [
        label,
        showValue
          ? (formatValue ?? themed.formatValue ?? formatDefaultValue)({
              value,
              min,
              max,
              ratio,
              percent,
            })
          : undefined,
      ]
        .filter(Boolean)
        .join(' ')
    : ''

  const resolvedWidth = width ?? themed.width ?? (orientation === 'horizontal' ? 240 : 24)
  const resolvedHeight = height ?? themed.height ?? (orientation === 'horizontal' ? 22 : 160)
  const trackColor = explicitTrackColor ?? themed.trackColor ?? 0x1f2937
  const fillColor = explicitFillColor ?? themed.fillColor ?? 0x22c55e
  const borderColor = explicitBorderColor ?? themed.borderColor ?? 0x334155
  const borderWidth = explicitBorderWidth ?? themed.borderWidth ?? 1
  const cornerRadius =
    explicitCornerRadius ?? themed.cornerRadius ?? (orientation === 'horizontal' ? 11 : 8)
  const labelStyle = explicitLabelStyle ??
    themed.labelStyle ?? { color: '#ffffff', fontSize: '12px' }
  const disabledAlpha = explicitDisabledAlpha ?? themed.disabledAlpha ?? 0.5
  const effectiveAlpha = disabled ? disabledAlpha : alpha
  const rootDirection =
    labelPosition === 'left' || labelPosition === 'right'
      ? 'row'
      : labelPosition === 'top' || labelPosition === 'bottom'
        ? 'column'
        : 'column'

  const labelNode = shouldShowText ? <Text text={text} style={labelStyle} /> : null
  const fillProps =
    orientation === 'horizontal'
      ? { width: `${percent}%` as const, height: 'fill' as const }
      : { width: 'fill' as const, height: `${percent}%` as const }

  const track = (
    <View
      width={resolvedWidth}
      height={resolvedHeight}
      direction={orientation === 'horizontal' ? 'stack' : 'column'}
      justifyContent={orientation === 'vertical' ? 'end' : 'start'}
      backgroundColor={trackColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      cornerRadius={cornerRadius}
      overflow="hidden"
      theme={nestedTheme}
    >
      <View {...fillProps} backgroundColor={fillColor} cornerRadius={cornerRadius} />
      {labelPosition === 'inside' && shouldShowText && (
        <View width="fill" height="fill" justifyContent="center" alignItems="center">
          {labelNode}
        </View>
      )}
    </View>
  )

  return (
    <View
      {...viewProps}
      direction={rootDirection}
      alignItems="center"
      gap={themed.gap ?? 8}
      {...(effectiveAlpha !== undefined ? { alpha: effectiveAlpha } : {})}
      theme={nestedTheme}
    >
      {labelPosition === 'top' || labelPosition === 'left' ? labelNode : null}
      {track}
      {labelPosition !== 'inside' && (labelPosition === 'bottom' || labelPosition === 'right')
        ? labelNode
        : null}
    </View>
  )
}
