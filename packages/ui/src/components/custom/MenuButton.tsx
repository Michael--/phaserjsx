/** @jsxImportSource ../.. */
/**
 * MenuButton component
 * A button that opens a context menu / popover with a list of actions.
 */
import { useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button'
import { ContextMenu, type ContextMenuItem, type ContextMenuProps } from './Popover'

export interface MenuButtonTriggerRenderProps {
  isOpen: boolean
  disabled: boolean
}

/**
 * Props for MenuButton component
 */
export interface MenuButtonProps extends Omit<
  ContextMenuProps,
  'items' | 'onSelect' | 'trigger' | 'isOpen'
> {
  /** Unique key for VDOM identification. */
  key?: string | number | undefined
  /** Menu items shown when the button is clicked. */
  items: ContextMenuItem[]
  /** Called when an item is selected. */
  onSelect?: (item: ContextMenuItem) => void
  /** Button content. Takes precedence over icon/label convenience rendering. */
  children?: ChildrenType | undefined
  /** Convenience label for the default button. */
  label?: string | number | undefined
  /** Optional icon/glyph content. */
  icon?: ChildrenType
  /** Custom trigger renderer. Replaces the default Button. */
  trigger?: (props: MenuButtonTriggerRenderProps) => ChildrenType
  /** Controlled open state. */
  open?: boolean
  /** Button visual variant. */
  buttonVariant?: ButtonVariant
  /** Button size variant. */
  buttonSize?: ButtonSize
  /** Additional props for the generated default Button. */
  buttonProps?: Omit<
    ButtonProps,
    'children' | 'label' | 'text' | 'onClick' | 'disabled' | 'variant' | 'size' | 'theme'
  >
}

/**
 * MenuButton component
 */
export function MenuButton(props: MenuButtonProps): VNodeLike {
  const {
    items,
    onSelect,
    children,
    label,
    icon,
    trigger,
    open: explicitOpen,
    defaultOpen,
    onOpenChange,
    placement,
    width,
    buttonVariant,
    buttonSize,
    buttonProps,
    disabled = false,
    theme,
    ...contextMenuProps
  } = props

  const localTheme = useTheme()
  const mergedTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('MenuButton', mergedTheme, {})

  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const isControlled = explicitOpen !== undefined
  const isOpen = isControlled ? explicitOpen : internalOpen

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open)
    }
    onOpenChange?.(open)
  }

  const handleSelect = (item: ContextMenuItem) => {
    onSelect?.(item)
  }

  const renderTrigger = () => {
    if (trigger) {
      return trigger({ isOpen, disabled })
    }

    if (children !== undefined) {
      return (
        <Button
          {...buttonProps}
          variant={buttonVariant ?? themed.buttonVariant ?? 'secondary'}
          size={buttonSize ?? themed.buttonSize ?? 'medium'}
          disabled={disabled}
          theme={nestedTheme}
        >
          {children}
        </Button>
      )
    }

    const hasIcon = icon !== undefined
    const hasLabel = label !== undefined

    return (
      <Button
        {...buttonProps}
        variant={buttonVariant ?? themed.buttonVariant ?? 'secondary'}
        size={buttonSize ?? themed.buttonSize ?? 'medium'}
        disabled={disabled}
        label={!hasIcon ? label : undefined}
        theme={nestedTheme}
      >
        {hasIcon && (
          <View
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={themed.iconGap ?? 8}
          >
            {icon}
            {hasLabel && <Text text={String(label)} />}
          </View>
        )}
      </Button>
    )
  }

  const contextMenuWidth = width ?? themed.width

  return (
    <ContextMenu
      {...contextMenuProps}
      items={items}
      onSelect={handleSelect}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement={placement ?? themed.placement ?? 'bottom-start'}
      {...(contextMenuWidth !== undefined ? { width: contextMenuWidth } : {})}
      disabled={disabled}
      theme={nestedTheme}
      trigger={renderTrigger()}
    />
  )
}
