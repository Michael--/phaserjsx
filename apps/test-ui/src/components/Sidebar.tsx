/**
 * Sidebar component - High-level container with typical sidebar styling
 */

import type * as PhaserJSX from '@phaserjsx/ui'
import type { SizeValue, ViewProps } from '@phaserjsx/ui'
import { getThemedProps, useTheme, View } from '@phaserjsx/ui'

// Module augmentation to add Sidebar theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Sidebar: {
      backgroundColor?: number
      backgroundAlpha?: number
      padding?:
        | number
        | {
            top?: number
            right?: number
            bottom?: number
            left?: number
          }
      gap?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
  /** Height of the sidebar */
  height?: SizeValue
  /** Children to display in sidebar */
  children?: ViewProps['children']
}

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
