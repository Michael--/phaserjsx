/**
 * Bootstrap Icon Button wrapper
 * Specialized Button component with Bootstrap Icons support
 */
import { Button as BaseButton, Text, type ButtonProps as BaseButtonProps } from '@phaserjsx/ui'
import { Icon, type IconType } from './BootstrapIcon'

/**
 * Props for BootstrapButton component
 */
export interface BootstrapButtonProps extends BaseButtonProps {
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
  const { text, icon, ...buttonProps } = props

  // Get iconSize from theme or use default
  const iconSize = 24 // TODO: Get from effective theme

  return (
    <BaseButton {...buttonProps}>
      {icon != null && <Icon type={icon} size={iconSize} />}
      {text != null && <Text text={text} />}
    </BaseButton>
  )
}

export type ButtonProps = BaseButtonProps
export const Button = BootstrapButton
