/**
 * Sidebar component - High-level container with typical sidebar styling
 */
import type { ViewProps } from '@phaserjsx/ui'
import { getThemedProps, View } from '@phaserjsx/ui'

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
  /** Width of the sidebar (default: 200) */
  width?: number | string
  /** Height of the sidebar */
  height?: number | string
  /** Padding inside sidebar (default: 10 on all sides) */
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
  /** Gap between children (default: 10) */
  gap?: number
  /** Children to display in sidebar */
  children?: ViewProps['children']
}

/**
 * Sidebar component - pre-configured container for navigation/options
 * @param props - Sidebar properties
 * @returns Sidebar JSX element
 */
export function Sidebar(props: SidebarProps) {
  const { props: themed, nestedTheme } = getThemedProps('Sidebar', undefined, {})
  const width = props.width ?? undefined
  const gap = props.gap ?? 10

  let padding: ViewProps['padding']
  if (typeof props.padding === 'number') {
    padding = {
      top: props.padding,
      right: props.padding,
      bottom: props.padding,
      left: props.padding,
    }
  } else if (props.padding) {
    padding = props.padding
  } else {
    padding = { top: 10, right: 10, bottom: 10, left: 10 }
  }

  return (
    <View
      width={width}
      height={props.height}
      theme={nestedTheme}
      backgroundColor={themed.backgroundColor}
      backgroundAlpha={themed.backgroundAlpha}
      padding={padding}
      gap={gap}
      direction="column"
      alignItems="start"
    >
      {props.children}
    </View>
  )
}
