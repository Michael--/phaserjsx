/** @jsxImportSource ../.. */
/**
 * Generic Button component with variant and size support
 * Icon-agnostic - accepts children or content slots
 */
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../../effects'
import { useRef } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import { View } from '../index'
import type { ViewProps } from '../view'

/**
 * Button variant theme
 */
export type ButtonVariantTheme = ViewTheme & EffectDefinition

/**
 * Props for Button component
 */
export interface ButtonProps extends ViewProps, EffectDefinition {
  /** Button content - can be text, icons, or any JSX */
  children?: ChildrenType
  /** Click handler */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | string
  /** Size variant */
  size?: 'small' | 'medium' | 'large' | string
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
export function Button(props: ButtonProps) {
  const { children, onClick, disabled, variant, size, width, height, ...restProps } = props
  const { props: themed } = getThemedProps('Button', undefined, {})
  const ref = useRef<Phaser.GameObjects.Container | null>(null)

  // Setup effect system
  const { applyEffect } = useGameObjectEffect(ref)

  // Cast to ButtonVariantTheme for proper access to nested themes
  const themedButton = themed as unknown as ButtonVariantTheme & {
    primary?: ButtonVariantTheme
    secondary?: ButtonVariantTheme
    outline?: ButtonVariantTheme
    small?: ButtonVariantTheme
    medium?: ButtonVariantTheme
    large?: ButtonVariantTheme
    disabledColor?: number
  }

  // Merge base theme with variant and size overrides
  let variantTheme = { ...themedButton }
  if (variant && themedButton[variant as keyof typeof themedButton]) {
    const variantOverrides = themedButton[
      variant as keyof typeof themedButton
    ] as ButtonVariantTheme
    variantTheme = { ...variantTheme, ...variantOverrides }
  }

  let sizeTheme = { ...variantTheme }
  if (size && themedButton[size as keyof typeof themedButton]) {
    const sizeOverrides = themedButton[size as keyof typeof themedButton] as ButtonVariantTheme
    sizeTheme = { ...sizeTheme, ...sizeOverrides }
  }

  // Apply disabled state styling
  const effectiveTheme = disabled
    ? {
        ...sizeTheme,
        backgroundColor: themedButton.disabledColor ?? sizeTheme?.backgroundColor,
        alpha: 0.5,
      }
    : sizeTheme

  const handleTouch =
    !disabled && onClick
      ? () => {
          // Apply effect: props override theme, theme overrides default
          const resolved = resolveEffect(props, themed as ButtonVariantTheme)
          applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
          onClick()
        }
      : undefined

  // Filter out non-View props from theme
  const {
    disabledColor: _disabledColor,
    effect: _effect,
    effectConfig: _effectConfig,
    primary: _primary,
    secondary: _secondary,
    outline: _outline,
    small: _small,
    medium: _medium,
    large: _large,
    ...viewThemeProps
  } = effectiveTheme as ButtonVariantTheme & {
    disabledColor?: number
    primary?: unknown
    secondary?: unknown
    outline?: unknown
    small?: unknown
    medium?: unknown
    large?: unknown
  }

  return (
    <View
      ref={ref}
      width={width}
      height={height}
      enableGestures={!disabled}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...(handleTouch && { onTouch: handleTouch })}
      {...viewThemeProps}
      {...restProps}
    >
      {children}
    </View>
  )
}
