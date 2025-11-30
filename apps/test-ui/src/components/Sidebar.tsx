/**
 * Sidebar component - High-level container with typical sidebar styling
 */

import type * as PhaserJSX from '@phaserjsx/ui'
import type { ViewProps } from '@phaserjsx/ui'
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
