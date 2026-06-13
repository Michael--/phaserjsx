/** @jsxImportSource ../.. */
/**
 * RatingBar component — star rating input (1–N).
 */
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View, type ViewProps } from '../index'

export type RatingBarSize = 'small' | 'medium' | 'large'

export interface RatingBarLabels {
  rating?: string
}

export interface RatingBarIconRenderProps {
  filled: boolean
  index: number
  size: RatingBarSize
}

export interface RatingBarThemeSlot extends ViewTheme {
  size?: RatingBarSize
  gap?: number
  iconSize?: number
  filledColor?: string
  emptyColor?: string
  disabledAlpha?: number
  labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
  labels?: RatingBarLabels
}

export interface RatingBarProps extends Omit<ViewProps, 'children'> {
  /** Current rating value in controlled mode. */
  value?: number
  /** Initial rating value in uncontrolled mode. */
  defaultValue?: number
  /** Maximum number of stars (default 5). */
  max?: number
  /** Called when rating changes. */
  onChange?: (value: number) => void
  /** Size preset. */
  size?: RatingBarSize
  /** Custom star icon renderer. */
  renderIcon?: (props: RatingBarIconRenderProps) => ChildrenType
  /** Localized labels. */
  labels?: RatingBarLabels
  /** Disabled state. */
  disabled?: boolean
  /** Theme overrides. */
  theme?: PartialTheme
}

function getSizeConfig(size: RatingBarSize): { iconSize: number; fontSize: string } {
  switch (size) {
    case 'small':
      return { iconSize: 16, fontSize: '16px' }
    case 'large':
      return { iconSize: 32, fontSize: '32px' }
    default:
      return { iconSize: 24, fontSize: '24px' }
  }
}

function clampRating(value: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(value)))
}

/**
 * RatingBar — star rating input.
 */
export function RatingBar(props: RatingBarProps): VNodeLike {
  const {
    value,
    defaultValue = 0,
    max = 5,
    onChange,
    size,
    renderIcon,
    labels: labelOverrides,
    disabled = false,
    theme,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('RatingBar', mergedLocalTheme, {})
  const themedControl = themed as unknown as RatingBarThemeSlot

  const resolvedSize = size ?? themedControl.size ?? 'medium'
  const sizeConfig = getSizeConfig(resolvedSize)
  const iconSize = themedControl.iconSize ?? sizeConfig.iconSize
  const gap = themedControl.gap ?? 4

  const isControlled = value !== undefined
  const initialValue = clampRating(value ?? defaultValue, max)
  const [internalValue, setInternalValue] = useState(initialValue)
  const currentValue = isControlled ? clampRating(value ?? 0, max) : internalValue

  useEffect(() => {
    if (isControlled) {
      setInternalValue(clampRating(value ?? 0, max))
    }
  }, [isControlled, value, max])

  const labels = { ...(themedControl.labels ?? {}), ...(labelOverrides ?? {}) }
  const filledColor = themedControl.filledColor ?? '#fbbf24'
  const emptyColor = themedControl.emptyColor ?? '#475569'
  const finalAlpha = disabled ? (themedControl.disabledAlpha ?? 0.5) : alpha

  const commitValue = (nextValue: number) => {
    if (disabled) return
    const clamped = clampRating(nextValue, max)
    if (!isControlled) {
      setInternalValue(clamped)
    }
    onChange?.(clamped)
  }

  const indices = Array.from({ length: max }, (_, i) => i)

  return (
    <View
      direction="row"
      alignItems="center"
      gap={gap}
      {...viewProps}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
    >
      {indices.map((i) => {
        const filled = i < currentValue
        const content = renderIcon?.({ filled, index: i, size: resolvedSize })

        return (
          <View
            key={i}
            width={iconSize}
            height={iconSize}
            alignItems="center"
            justifyContent="center"
            enableGestures={!disabled}
            onTouch={() => commitValue(i + 1)}
            theme={nestedTheme}
          >
            {content ?? (
              <Text
                text={filled ? '★' : '☆'}
                style={{ color: filled ? filledColor : emptyColor, fontSize: sizeConfig.fontSize }}
              />
            )}
          </View>
        )
      })}
      {labels.rating ? <Text text={labels.rating} style={themedControl.labelStyle} /> : null}
    </View>
  )
}
