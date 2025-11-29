/**
 * Bootstrap Icon Button wrapper
 * Specialized Button component with Bootstrap Icons support
 */
import { Button, Text, type ButtonProps } from '@phaserjsx/ui'
import { Icon, type IconType } from './BootstrapIcon'

/**
 * Props for BootstrapButton component
 */
export interface BootstrapButtonProps extends ButtonProps {
  /** Button text */
  text?: string
  /** Bootstrap icon type */
  icon?: IconType
}

/**
 * Bootstrap Button component
 * Extends generic Button with Bootstrap Icons support
 *
 * @example
 * ```tsx
 * <BootstrapButton
 *   text="Click me"
 *   icon="check"
 *   variant="primary"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
export function BootstrapButton(props: BootstrapButtonProps) {
  const { text, icon, children, ...buttonProps } = props

  // Get iconSize from theme or use default
  const iconSize = 24 // TODO: Get from effective theme

  // If children are provided, use them instead of text/icon
  const content = children ?? (
    <>
      {icon != null && <Icon type={icon} size={iconSize} />}
      {text != null && <Text text={text} />}
    </>
  )

  return <Button {...buttonProps}>{content}</Button>
}
