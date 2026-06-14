/** @jsxImportSource ../.. */
/**
 * Generic Button component with variant and size support
 * Icon-agnostic - accepts children or content slots
 */
import type { ViewProps } from '..'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../../effects'
import { useRef, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'

/**
 * Button variant theme
 */
export type ButtonVariantTheme = ViewTheme &
  EffectDefinition & {
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    iconSize?: number
    disabledColor?: number
    disabledTextColor?: string
    disabledIconTint?: number
    disabledAlpha?: number
  }
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

export type ButtonTheme = ButtonVariantTheme & {
  variant?: ButtonVariant
  size?: ButtonSize
  variants?: Partial<Record<ButtonVariant, ButtonVariantTheme>>
  sizes?: Partial<Record<ButtonSize, ButtonVariantTheme>>
} & Partial<Record<ButtonVariant, ButtonVariantTheme>> &
  Partial<Record<ButtonSize, ButtonVariantTheme>>

/**
 * Props for Button component
 */
export interface ButtonProps extends ViewProps, EffectDefinition {
  /** Button content - can be text, icons, or any JSX */
  children?: ChildrenType | undefined
  /** Convenience text label. Children take precedence when provided. */
  label?: string | number | undefined
  /** Backward-compatible alias for label. */
  text?: string | number | undefined
  /** Click handler */
  onClick?: (() => void) | undefined
  /** Disabled state */
  disabled?: boolean | undefined
  /** Visual variant */
  variant?: ButtonVariant | undefined
  /** Size variant */
  size?: ButtonSize | undefined
  /** Text style for generated label/text content and nested Text defaults. */
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle | undefined
  /** Icon size for nested Icon defaults. */
  iconSize?: number | undefined
  /** Alpha applied while disabled. */
  disabledAlpha?: number | undefined
}

function mergeButtonTheme(
  base: ButtonTheme,
  override: ButtonVariantTheme | undefined
): ButtonTheme {
  return override
    ? ({
        ...base,
        ...override,
        textStyle:
          base.textStyle || override.textStyle
            ? { ...(base.textStyle ?? {}), ...(override.textStyle ?? {}) }
            : undefined,
        Text:
          base.Text || override.Text
            ? {
                ...(base.Text ?? {}),
                ...(override.Text ?? {}),
                style:
                  base.Text?.style || override.Text?.style
                    ? { ...(base.Text?.style ?? {}), ...(override.Text?.style ?? {}) }
                    : undefined,
              }
            : undefined,
        Icon:
          base.Icon || override.Icon
            ? { ...(base.Icon ?? {}), ...(override.Icon ?? {}) }
            : undefined,
      } as ButtonTheme)
    : base
}

function resolveButtonSlotTheme<TName extends ButtonVariant | ButtonSize>(
  theme: ButtonTheme,
  group: 'variants' | 'sizes',
  name: TName | undefined
): ButtonVariantTheme | undefined {
  if (!name) return undefined

  return {
    ...(theme[group]?.[name as never] ?? {}),
    ...(theme[name] ?? {}),
  } as ButtonVariantTheme
}

function buildButtonContentTheme(theme: ButtonTheme): PartialTheme {
  const textTheme = theme.Text ?? {}
  const iconTheme = theme.Icon ?? {}
  const mergedTextStyle =
    theme.textStyle || textTheme.style
      ? {
          ...(textTheme.style ?? {}),
          ...(theme.textStyle ?? {}),
        }
      : undefined

  return {
    Text: mergedTextStyle ? { ...textTheme, style: mergedTextStyle } : textTheme,
    Icon: {
      ...iconTheme,
      ...(theme.iconSize !== undefined ? { size: theme.iconSize } : {}),
    },
  }
}

/**
 * Generic Button component
 * Provides variant, size, and disabled state support
 * Content is fully customizable via children prop
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 *
 * <Button variant="outline" size="small">
 *   <Icon type="check" />
 *   <Text text="Confirm" />
 * </Button>
 * ```
 */
export function Button(props: ButtonProps): VNodeLike {
  const {
    children,
    label,
    text,
    onClick,
    disabled = false,
    variant,
    size,
    width,
    height,
    textStyle,
    iconSize,
    disabledAlpha,
    alpha,
    theme,
    onTouch,
    ...restProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('Button', mergedLocalTheme, {})
  const ref = useRef<Phaser.GameObjects.Container | null>(null)

  // Setup effect system
  const { applyEffect } = useGameObjectEffect(ref)

  const themedButton = themed as unknown as ButtonTheme

  // Merge base theme with variant and size overrides
  const resolvedVariant = variant ?? themedButton.variant ?? 'primary'
  const resolvedSize = size ?? themedButton.size ?? 'medium'
  const variantTheme = mergeButtonTheme(
    { ...themedButton },
    resolveButtonSlotTheme(themedButton, 'variants', resolvedVariant)
  )
  const sizeTheme = mergeButtonTheme(
    variantTheme,
    resolveButtonSlotTheme(themedButton, 'sizes', resolvedSize)
  )

  const resolvedTextStyle =
    sizeTheme.textStyle || textStyle
      ? { ...(sizeTheme.textStyle ?? {}), ...(textStyle ?? {}) }
      : undefined
  const resolvedIconSize = iconSize ?? sizeTheme.iconSize
  const resolvedDisabledAlpha = disabledAlpha ?? sizeTheme.disabledAlpha ?? 0.5
  const resolvedDisabledTextColor =
    sizeTheme.disabledTextColor ?? themedButton.disabledTextColor ?? resolvedTextStyle?.color
  const resolvedDisabledIconTint =
    sizeTheme.disabledIconTint ?? themedButton.disabledIconTint ?? sizeTheme.Icon?.tint
  const effectiveTextStyle =
    disabled && resolvedDisabledTextColor
      ? { ...(resolvedTextStyle ?? {}), color: resolvedDisabledTextColor }
      : resolvedTextStyle
  const contentStyleProps: Partial<ButtonTheme> = {
    ...(effectiveTextStyle ? { textStyle: effectiveTextStyle } : {}),
    ...(resolvedIconSize !== undefined ? { iconSize: resolvedIconSize } : {}),
    ...(disabled && resolvedDisabledIconTint !== undefined
      ? { Icon: { ...(sizeTheme.Icon ?? {}), tint: resolvedDisabledIconTint } }
      : {}),
  }

  // Apply disabled state styling
  const effectiveTheme = disabled
    ? {
        ...sizeTheme,
        backgroundColor:
          sizeTheme.disabledColor ?? themedButton.disabledColor ?? sizeTheme.backgroundColor,
        backgroundAlpha: resolvedDisabledAlpha,
        ...(alpha !== undefined ? { alpha } : {}),
        ...contentStyleProps,
      }
    : {
        ...sizeTheme,
        ...(alpha !== undefined ? { alpha } : {}),
        ...contentStyleProps,
      }

  const handleTouch: ViewProps['onTouch'] | undefined = !disabled
    ? (event) => {
        // Apply effect: props override theme, theme overrides default
        const resolved = resolveEffect(props, effectiveTheme)
        applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
        onTouch?.(event)
        onClick?.()
      }
    : undefined

  const generatedText = label ?? text
  const content =
    children ??
    (generatedText !== undefined ? (
      <Text
        text={`${generatedText}`}
        {...(effectiveTextStyle ? { style: effectiveTextStyle } : {})}
      />
    ) : null)

  const contentTheme = mergeThemes(nestedTheme, buildButtonContentTheme(effectiveTheme))

  // Filter out non-View props from theme
  const {
    disabledColor: _disabledColor,
    disabledTextColor: _disabledTextColor,
    disabledIconTint: _disabledIconTint,
    disabledAlpha: _disabledAlpha,
    effect: _effect,
    effectConfig: _effectConfig,
    textStyle: _textStyle,
    iconSize: _iconSize,
    variant: _variant,
    size: _size,
    variants: _variants,
    sizes: _sizes,
    primary: _primary,
    secondary: _secondary,
    outline: _outline,
    ghost: _ghost,
    danger: _danger,
    small: _small,
    medium: _medium,
    large: _large,
    Text: _Text,
    Icon: _Icon,
    ...viewThemeProps
  } = effectiveTheme

  return (
    <View
      ref={ref}
      enableGestures={!disabled}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...viewThemeProps}
      width={width ?? effectiveTheme.width}
      height={height ?? effectiveTheme.height}
      {...restProps}
      {...(handleTouch && { onTouch: handleTouch })}
      theme={contentTheme}
    >
      {content}
    </View>
  )
}
