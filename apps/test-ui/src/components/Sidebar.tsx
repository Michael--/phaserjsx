/**
 * Sidebar component - High-level container with typical sidebar styling
 */
import type { EdgeInsets, ViewProps } from '@phaserjsx/ui'
import { getThemedProps, View } from '@phaserjsx/ui'

declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Sidebar: {
      backgroundColor?: number
      backgroundAlpha?: number
      padding?: number | EdgeInsets
      gap?: number
    } & import('@phaserjsx/ui').NestedComponentThemes
  }
}

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
  /** Height of the sidebar */
  height?: number | string
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

  return (
    <View
      height={props.height}
      theme={nestedTheme}
      backgroundColor={themed.backgroundColor}
      backgroundAlpha={themed.backgroundAlpha}
      padding={themed.padding}
      gap={themed.gap}
      direction="column"
      alignItems="start"
    >
      {props.children}
    </View>
  )
}
