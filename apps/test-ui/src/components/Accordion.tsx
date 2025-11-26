import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, useState, View, type ChildrenType } from '@phaserjsx/ui'
import { Icon, type IconType } from './Icon'

// Module augmentation to add Accordion theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Accordion: {
      headerTheme?: PhaserJSX.ViewTheme
      contentTheme?: PhaserJSX.ViewTheme
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      iconSize?: number
      iconColor?: number
    } & PhaserJSX.ViewTheme
  }
}

/**
 * Props for Accordion component
 */
export interface AccordionProps {
  /** Title as string or custom JSX element */
  title?: string | ChildrenType
  /** Optional icon displayed in header */
  icon?: IconType
  /** Initial open state (default: false) */
  defaultOpen?: boolean
  /** Controlled open state */
  isOpen?: boolean
  /** Callback when accordion is toggled */
  onToggle?: (isOpen: boolean) => void
  /** AccordionPage children */
  children?: ChildrenType
  /** Additional styling props */
  width?: number
  height?: number
}

/**
 * Accordion component - collapsible header with content
 * @param props - Accordion properties
 * @returns Accordion JSX element
 */
export function Accordion(props: AccordionProps) {
  const { props: themed } = getThemedProps('Accordion', undefined, {})

  const [internalOpen, setInternalOpen] = useState<boolean>(props.defaultOpen ?? false)
  const isOpen = props.isOpen !== undefined ? props.isOpen : internalOpen

  const handleToggle = () => {
    const newState = !isOpen
    setInternalOpen(newState)
    props.onToggle?.(newState)
  }

  const headerTheme = themed.headerTheme ?? {}
  const contentTheme = themed.contentTheme ?? {}
  const iconSize = themed.iconSize ?? 24
  const textStyle = themed.textStyle

  return (
    <View width={props.width} height={props.height} direction="column" {...themed}>
      {/* Header */}
      <View
        direction="row"
        alignItems="center"
        gap={10}
        enableGestures={true}
        onTouch={handleToggle}
        {...headerTheme}
      >
        {props.icon && <Icon type={props.icon} size={iconSize} />}
        {typeof props.title === 'string' ? (
          <Text text={props.title} {...(textStyle && { style: textStyle })} />
        ) : (
          props.title
        )}
      </View>

      {/* Content */}
      <View
        direction="column"
        maxHeight={isOpen ? undefined : 0}
        overflow="hidden"
        {...contentTheme}
      >
        {props.children}
      </View>
    </View>
  )
}
