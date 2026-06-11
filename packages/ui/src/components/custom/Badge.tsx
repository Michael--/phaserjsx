/** @jsxImportSource ../.. */
/**
 * Badge and Tag components - compact labels for counts, status, filters, and inventory metadata.
 */
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Button, Text, View, type ViewProps } from '../index'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeVariant = 'solid' | 'soft' | 'outline'
export type BadgeSize = 'small' | 'medium' | 'large'

export interface BadgeToneColors {
  backgroundColor: number
  softBackgroundColor: number
  borderColor: number
  textColor: string
  outlineTextColor: string
}

export interface BadgeSizeConfig {
  height: number
  padding: ViewProps['padding']
  fontSize: number
  cornerRadius: number
  gap: number
  dotSize: number
}

export interface BadgeFormatOptions {
  count?: number
  maxCount?: number
}

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  /** Badge content. Use children for custom content, or label/count for text content. */
  children?: ChildrenType
  /** Text or number shown inside the badge. */
  label?: string | number
  /** Numeric count. Values above maxCount render as maxCount+. */
  count?: number
  /** Maximum count before compact overflow formatting is used. */
  maxCount?: number
  /** Render as a compact status dot without text. */
  dot?: boolean
  /** Semantic color tone. */
  tone?: BadgeTone
  /** Visual style variant. */
  variant?: BadgeVariant
  /** Size preset. */
  size?: BadgeSize
  /** Text style override for generated label/count content. */
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  /** Disabled state. */
  disabled?: boolean
  /** Alpha applied while disabled. */
  disabledAlpha?: number
  /** Theme overrides. */
  theme?: PartialTheme
}

export interface TagProps extends Omit<BadgeProps, 'count' | 'maxCount' | 'dot'> {
  /** Selected/active tag state. */
  selected?: boolean
  /** Optional close/remove action. */
  onRemove?: () => void
  /** Text used for the close affordance. */
  closeLabel?: string
}

const DEFAULT_TONES: Record<BadgeTone, BadgeToneColors> = {
  neutral: {
    backgroundColor: 0x475569,
    softBackgroundColor: 0x1e293b,
    borderColor: 0x64748b,
    textColor: '#ffffff',
    outlineTextColor: '#cbd5e1',
  },
  primary: {
    backgroundColor: 0x2563eb,
    softBackgroundColor: 0x1e3a8a,
    borderColor: 0x60a5fa,
    textColor: '#ffffff',
    outlineTextColor: '#93c5fd',
  },
  success: {
    backgroundColor: 0x16a34a,
    softBackgroundColor: 0x14532d,
    borderColor: 0x4ade80,
    textColor: '#ffffff',
    outlineTextColor: '#86efac',
  },
  warning: {
    backgroundColor: 0xf59e0b,
    softBackgroundColor: 0x78350f,
    borderColor: 0xfbbf24,
    textColor: '#111827',
    outlineTextColor: '#fde68a',
  },
  danger: {
    backgroundColor: 0xdc2626,
    softBackgroundColor: 0x7f1d1d,
    borderColor: 0xf87171,
    textColor: '#ffffff',
    outlineTextColor: '#fecaca',
  },
  info: {
    backgroundColor: 0x0891b2,
    softBackgroundColor: 0x164e63,
    borderColor: 0x22d3ee,
    textColor: '#ffffff',
    outlineTextColor: '#a5f3fc',
  },
}

const DEFAULT_SIZES: Record<BadgeSize, BadgeSizeConfig> = {
  small: {
    height: 22,
    padding: { left: 8, right: 8, top: 3, bottom: 3 },
    fontSize: 12,
    cornerRadius: 11,
    gap: 5,
    dotSize: 8,
  },
  medium: {
    height: 26,
    padding: { left: 10, right: 10, top: 4, bottom: 4 },
    fontSize: 14,
    cornerRadius: 13,
    gap: 6,
    dotSize: 10,
  },
  large: {
    height: 32,
    padding: { left: 13, right: 13, top: 5, bottom: 5 },
    fontSize: 18,
    cornerRadius: 16,
    gap: 8,
    dotSize: 12,
  },
}

export function formatBadgeCount({ count, maxCount = 99 }: BadgeFormatOptions): string {
  if (!Number.isFinite(count)) return '0'

  const normalizedCount = Math.max(0, Math.floor(count ?? 0))
  const normalizedMax = Math.max(0, Math.floor(maxCount))

  return normalizedCount > normalizedMax ? `${normalizedMax}+` : `${normalizedCount}`
}

export function getBadgeText(props: Pick<BadgeProps, 'label' | 'count' | 'maxCount'>): string {
  if (props.count !== undefined) return formatBadgeCount(props)
  if (props.label !== undefined) return `${props.label}`
  return ''
}

function resolveBadgeColors(
  tone: BadgeTone,
  variant: BadgeVariant
): {
  backgroundColor: number
  backgroundAlpha: number
  borderColor: number
  borderWidth: number
  textColor: string
} {
  const toneColors = DEFAULT_TONES[tone]

  if (variant === 'outline') {
    return {
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      borderColor: toneColors.borderColor,
      borderWidth: 1,
      textColor: toneColors.outlineTextColor,
    }
  }

  if (variant === 'soft') {
    return {
      backgroundColor: toneColors.softBackgroundColor,
      backgroundAlpha: 1,
      borderColor: toneColors.borderColor,
      borderWidth: 1,
      textColor: toneColors.outlineTextColor,
    }
  }

  return {
    backgroundColor: toneColors.backgroundColor,
    backgroundAlpha: 1,
    borderColor: toneColors.borderColor,
    borderWidth: 0,
    textColor: toneColors.textColor,
  }
}

export interface BadgeTextStyleOptions {
  size: BadgeSize
  textColor: string
  themedTextStyle?: Phaser.Types.GameObjects.Text.TextStyle | undefined
  explicitTextStyle?: Phaser.Types.GameObjects.Text.TextStyle | undefined
}

export function getBadgeSizeConfig(size: BadgeSize): BadgeSizeConfig {
  return DEFAULT_SIZES[size]
}

export function resolveBadgeTextStyle(
  options: BadgeTextStyleOptions
): Phaser.Types.GameObjects.Text.TextStyle {
  const sizeConfig = getBadgeSizeConfig(options.size)

  return {
    color: options.textColor,
    fontSize: `${sizeConfig.fontSize}px`,
    ...(options.themedTextStyle ?? {}),
    ...(options.explicitTextStyle ?? {}),
  }
}

export function Badge(props: BadgeProps): VNodeLike {
  const {
    children,
    label,
    count,
    maxCount,
    dot = false,
    tone: explicitTone,
    variant: explicitVariant,
    size: explicitSize,
    textStyle: explicitTextStyle,
    disabled = false,
    disabledAlpha: explicitDisabledAlpha,
    theme,
    width,
    height,
    padding,
    gap,
    cornerRadius,
    backgroundColor,
    backgroundAlpha,
    borderColor,
    borderWidth,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Badge', localTheme, theme ?? {})
  const tone = explicitTone ?? themed.tone ?? 'neutral'
  const variant = explicitVariant ?? themed.variant ?? 'solid'
  const size = explicitSize ?? themed.size ?? 'medium'
  const sizeConfig = getBadgeSizeConfig(size)
  const colors = resolveBadgeColors(tone, variant)
  const disabledAlpha = explicitDisabledAlpha ?? themed.disabledAlpha ?? 0.5
  const effectiveAlpha = disabled ? disabledAlpha : alpha
  const resolvedMaxCount = maxCount ?? themed.maxCount ?? 99
  const text =
    count !== undefined
      ? formatBadgeCount({ count, maxCount: resolvedMaxCount })
      : label !== undefined
        ? `${label}`
        : ''
  const resolvedTextStyle = resolveBadgeTextStyle({
    size,
    textColor: colors.textColor,
    themedTextStyle: themed.textStyle,
    explicitTextStyle,
  })
  const dotSize = themed.dotSize ?? sizeConfig.dotSize

  if (dot) {
    return (
      <View
        {...viewProps}
        width={width ?? dotSize}
        height={height ?? dotSize}
        backgroundColor={backgroundColor ?? themed.backgroundColor ?? colors.backgroundColor}
        backgroundAlpha={backgroundAlpha ?? themed.backgroundAlpha ?? colors.backgroundAlpha}
        borderColor={borderColor ?? themed.borderColor ?? colors.borderColor}
        borderWidth={borderWidth ?? themed.borderWidth ?? colors.borderWidth}
        cornerRadius={cornerRadius ?? themed.cornerRadius ?? dotSize / 2}
        {...(effectiveAlpha !== undefined ? { alpha: effectiveAlpha } : {})}
        theme={nestedTheme}
      />
    )
  }

  return (
    <View
      {...viewProps}
      width={width ?? themed.width ?? 'auto'}
      height={height ?? themed.height ?? sizeConfig.height}
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={gap ?? themed.gap ?? sizeConfig.gap}
      padding={padding ?? themed.padding ?? sizeConfig.padding}
      backgroundColor={backgroundColor ?? themed.backgroundColor ?? colors.backgroundColor}
      backgroundAlpha={backgroundAlpha ?? themed.backgroundAlpha ?? colors.backgroundAlpha}
      borderColor={borderColor ?? themed.borderColor ?? colors.borderColor}
      borderWidth={borderWidth ?? themed.borderWidth ?? colors.borderWidth}
      cornerRadius={cornerRadius ?? themed.cornerRadius ?? sizeConfig.cornerRadius}
      {...(effectiveAlpha !== undefined ? { alpha: effectiveAlpha } : {})}
      theme={nestedTheme}
    >
      {children ?? <Text text={text} style={resolvedTextStyle} />}
    </View>
  )
}

export function Tag(props: TagProps): VNodeLike {
  const {
    selected = false,
    onRemove,
    closeLabel = 'x',
    tone,
    variant,
    size,
    theme,
    children,
    label,
    textStyle,
    ...badgeProps
  } = props

  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Tag', localTheme, theme ?? {})
  const resolvedTone = tone ?? themed.tone ?? (selected ? 'primary' : 'neutral')
  const resolvedVariant = variant ?? themed.variant ?? (selected ? 'solid' : 'soft')
  const resolvedSize = size ?? themed.size ?? 'medium'
  const colors = resolveBadgeColors(resolvedTone, resolvedVariant)
  const closeSize = themed.closeSize ?? 16
  const resolvedTextStyle = resolveBadgeTextStyle({
    size: resolvedSize,
    textColor: colors.textColor,
    themedTextStyle: themed.textStyle,
    explicitTextStyle: textStyle,
  })
  const text = label !== undefined ? `${label}` : ''

  return (
    <Badge
      {...badgeProps}
      tone={resolvedTone}
      variant={resolvedVariant}
      size={resolvedSize}
      textStyle={resolvedTextStyle}
      theme={nestedTheme}
    >
      {label !== undefined && <Text text={text} style={resolvedTextStyle} />}
      {children}
      {onRemove && (
        <Button
          width={closeSize}
          height={closeSize}
          minWidth={closeSize}
          padding={0}
          cornerRadius={closeSize / 2}
          onClick={onRemove}
          theme={nestedTheme}
          label={closeLabel}
          textStyle={resolvedTextStyle}
        />
      )}
    </Badge>
  )
}
