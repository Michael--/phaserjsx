/** @jsxImportSource ../.. */
/**
 * ProgressView component — composite progress indicator.
 * Renders a determinate ProgressBar or an indeterminate ActivityIndicator
 * with optional label, percentage, and cancel button.
 */
import { useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { VNodeLike } from '../../vdom'
import { Button, Text, View, type ViewProps } from '../index'
import type { ButtonSize } from './Button'
import { ActivityIndicator } from './ActivityIndicator'
import { ProgressBar, type ProgressBarProps } from './ProgressBar'

export interface ProgressViewLabels {
  cancel?: string
  loading?: string
}

export interface ProgressViewThemeSlot extends ViewTheme {
  width?: ViewTheme['width']
  barHeight?: number
  gap?: number
  labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
  percentageStyle?: Phaser.Types.GameObjects.Text.TextStyle
  cancelButtonSize?: ButtonSize
  labels?: ProgressViewLabels
}

export interface ProgressViewProps extends Omit<ViewProps, 'children'> {
  /** Current progress value (determinate mode). */
  value?: number
  /** Minimum value used for normalization (default 0). */
  min?: number
  /** Maximum value used for normalization (default 100). */
  max?: number
  /** Switch to indeterminate ActivityIndicator when true. */
  indeterminate?: boolean
  /** Optional label above the bar. */
  label?: string
  /** Show percentage text next to the bar. */
  showPercentage?: boolean
  /** Show a cancel button below the bar. */
  showCancel?: boolean
  /** Called when the cancel button is clicked. */
  onCancel?: () => void
  /** Localized labels. */
  labels?: ProgressViewLabels
  /** Props forwarded to the underlying ProgressBar. */
  progressBarProps?: Omit<
    ProgressBarProps,
    'value' | 'min' | 'max' | 'label' | 'showValue' | 'labelPosition' | 'labelStyle' | 'theme'
  >
  /** Theme overrides. */
  theme?: PartialTheme
}

/**
 * ProgressView — determinate or indeterminate progress with label and cancel.
 */
export function ProgressView(props: ProgressViewProps): VNodeLike {
  const {
    value,
    min = 0,
    max = 100,
    indeterminate = false,
    label,
    showPercentage = false,
    showCancel = false,
    onCancel,
    labels: labelOverrides,
    progressBarProps,
    theme,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('ProgressView', mergedLocalTheme, {})
  const themedControl = themed as unknown as ProgressViewThemeSlot

  const labels = {
    ...(themedControl.labels ?? {}),
    ...(labelOverrides ?? {}),
  }

  const gap = themedControl.gap ?? 8
  const barHeight = themedControl.barHeight ?? 24
  const labelStyle = themedControl.labelStyle ?? { color: '#e0e7ff', fontSize: '14px' }
  const percentageStyle = themedControl.percentageStyle ?? {
    color: '#9fb3c8',
    fontSize: '13px',
  }

  const percentage =
    value !== undefined ? Math.round(((value - min) / (max - min)) * 100) : undefined

  return (
    <View
      direction="column"
      gap={gap}
      width={themedControl.width ?? 'fill'}
      {...viewProps}
      theme={nestedTheme}
    >
      {/* Label row */}
      {(label || showPercentage) && !indeterminate ? (
        <View direction="row" justifyContent="space-between" width="fill">
          {label ? <Text text={label} style={labelStyle} /> : <View />}
          {showPercentage && percentage !== undefined ? (
            <Text text={`${percentage}%`} style={percentageStyle} />
          ) : null}
        </View>
      ) : null}

      {/* Indicator */}
      {indeterminate ? (
        <ActivityIndicator
          {...(label || labels.loading ? { label: label ?? labels.loading } : {})}
          theme={nestedTheme}
        />
      ) : (
        <ProgressBar
          value={value ?? 0}
          min={min}
          max={max}
          height={barHeight}
          width="fill"
          {...progressBarProps}
          theme={nestedTheme}
        />
      )}

      {/* Cancel button */}
      {showCancel && onCancel ? (
        <View alignItems="center" width="fill">
          <Button
            variant="ghost"
            size={themedControl.cancelButtonSize ?? 'small'}
            onClick={onCancel}
          >
            <Text text={labels.cancel ?? 'Cancel'} />
          </Button>
        </View>
      ) : null}
    </View>
  )
}
