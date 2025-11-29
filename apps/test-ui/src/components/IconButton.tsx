/**
 * Icon Button wrapper
 * Specialized Button component with Icons support
 */
import { Button, getThemedProps, Text, type ButtonProps } from '@phaserjsx/ui'
import { Icon, type IconType } from './Icon'

// Module augmentation to add IconButton theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    IconButton: {
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      iconSize?: number
      primary?: {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        iconSize?: number
      }
      secondary?: {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        iconSize?: number
      }
      outline?: {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        iconSize?: number
      }
      small?: {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        iconSize?: number
      }
      medium?: {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        iconSize?: number
      }
      large?: {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        iconSize?: number
      }
    }
  }
}

/**
 * Props for IconButton component
 */
export interface IconButtonProps extends ButtonProps {
  /** Button text */
  text?: string
  /** icon type */
  icon?: IconType
  /** Icon size (from theme or explicit) */
  iconSize?: number
  /** Text style (from theme or explicit) */
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
}

/**
 * Icon Button component
 * Extends generic Button with Icons support
 *
 * @example
 * ```tsx
 * <IconButton
 *   text="Click me"
 *   icon="check"
 *   variant="primary"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
export function IconButton(props: IconButtonProps) {
  const { text, icon, children, iconSize, textStyle, variant, size, ...buttonProps } = props

  // Get theme values for iconSize and textStyle based on variant/size
  const { props: themed } = getThemedProps('IconButton', undefined, {})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const themedButton = themed as any

  // Resolve effective values: props > variant > size > base theme
  let effectiveIconSize = iconSize ?? themedButton.iconSize ?? 24
  let effectiveTextStyle = textStyle ?? themedButton.textStyle

  // Apply variant overrides
  if (variant && themedButton[variant]) {
    effectiveIconSize = iconSize ?? themedButton[variant].iconSize ?? effectiveIconSize
    effectiveTextStyle = textStyle ?? themedButton[variant].textStyle ?? effectiveTextStyle
  }

  // Apply size overrides
  if (size && themedButton[size]) {
    effectiveIconSize = iconSize ?? themedButton[size].iconSize ?? effectiveIconSize
    effectiveTextStyle = textStyle ?? themedButton[size].textStyle ?? effectiveTextStyle
  }

  // If children are provided, use them instead of text/icon
  const content = children ?? (
    <>
      {icon != null && <Icon type={icon} size={effectiveIconSize} />}
      {text != null && (
        <Text text={text} {...(effectiveTextStyle && { style: effectiveTextStyle })} />
      )}
    </>
  )

  return (
    <Button {...(variant && { variant })} {...(size && { size })} {...buttonProps}>
      {content}
    </Button>
  )
}
