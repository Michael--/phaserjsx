/** @jsxImportSource ../.. */
/**
 * Sidebar component - High-level container with typical sidebar styling
 */
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import { View } from '../index'
import type { ViewProps } from '../view'

/**
 * Props for Sidebar component - extends ViewProps for full flexibility
 */
export type SidebarProps = ViewProps

/**
 * Sidebar component - pre-configured container for navigation/options
 * @param props - Sidebar properties
 * @returns Sidebar JSX element
 */
export function Sidebar(props: SidebarProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Sidebar', localTheme, {})

  return (
    <View
      {...props}
      theme={nestedTheme}
      backgroundColor={themed.backgroundColor ?? props.backgroundColor}
      backgroundAlpha={themed.backgroundAlpha ?? props.backgroundAlpha}
      padding={themed.padding ?? props.padding}
      gap={themed.gap ?? props.gap}
      direction={props.direction ?? 'column'}
      alignItems={props.alignItems ?? 'start'}
    />
  )
}
