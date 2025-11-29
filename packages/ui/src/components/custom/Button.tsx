/** @jsxImportSource ../.. */
/**
 * Generic Button component with variant and size support
 * Icon-agnostic - accepts children or content slots
 */
import { useRef } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import { View } from '../index'

/**
 * Button variant theme
 */
export type ButtonVariantTheme = ViewTheme & {
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  iconSize?: number
}

/**
 * Props for Button component
 */
export interface ButtonProps {
  /** Button content - can be text, icons, or any JSX */
  children?: ChildrenType
  /** Click handler */
  onClick?: () => void
  /** Button width */
  width?: number
  /** Button height */
  height?: number
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

  type ThemeRecord = Record<string, ButtonVariantTheme>

  // Merge base theme with variant and size overrides
  const variantTheme = variant ? { ...themed, ...(themed as ThemeRecord)[variant] } : themed

  const sizeTheme = size ? { ...variantTheme, ...(themed as ThemeRecord)[size] } : variantTheme

  // Apply disabled state styling
  const effectiveTheme = disabled
    ? {
        ...sizeTheme,
        backgroundColor: (themed as ThemeRecord).disabledColor ?? sizeTheme?.backgroundColor,
        alpha: 0.5,
      }
    : sizeTheme

  const handleTouch =
    !disabled && onClick
      ? () => {
          onClick()
        }
      : undefined

  // Filter out non-View props from theme
  const {
    disabledColor: _disabledColor,
    textStyle: _textStyle,
    iconSize: _iconSize,
    primary: _primary,
    secondary: _secondary,
    outline: _outline,
    small: _small,
    medium: _medium,
    large: _large,
    ...viewThemeProps
  } = effectiveTheme as ThemeRecord

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
