/**
 * Example: Extending the Theme System for Custom Components
 *
 * This file demonstrates how to register custom components with the theme system
 * so they can benefit from global and local theme inheritance.
 */

/**
 * Step 1: Extend the CustomComponentThemes interface via module augmentation
 * This makes your custom component's theme type-safe
 */
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Sidebar: {
      backgroundColor?: number
      width?: number | string
      padding?: number
      gap?: number
    }
  }
}

/**
 * Step 2: Register default theme values for your component
 * Do this in your component's initialization code
 */
import { themeRegistry } from '@phaserjsx/ui'

themeRegistry.registerCustomComponent('Sidebar', {
  backgroundColor: 0x1e1e1e,
  width: 200,
  padding: 10,
  gap: 10,
})

/**
 * Step 3: Use getThemedProps in your component to apply theme values
 * This merges global theme, local theme, and explicit props (explicit props win)
 */
import { View, getThemedProps, type ViewProps } from '@phaserjsx/ui'

export interface SidebarProps {
  width?: number | string
  height?: number | string
  backgroundColor?: number
  padding?: number
  gap?: number
  children?: ViewProps['children']
}

function Sidebar(props: SidebarProps) {
  // Get themed props - merges global, local, and explicit props
  const themedProps = getThemedProps('Sidebar', undefined, props)
  const padding = themedProps.padding

  const viewProps: Partial<ViewProps> = {
    direction: 'column',
    alignItems: 'start',
    children: props.children,
  }

  if (themedProps.width !== undefined) viewProps.width = themedProps.width
  if (themedProps.height !== undefined) viewProps.height = themedProps.height
  if (themedProps.backgroundColor !== undefined)
    viewProps.backgroundColor = themedProps.backgroundColor
  if (themedProps.gap !== undefined) viewProps.gap = themedProps.gap
  if (padding !== undefined) {
    viewProps.padding = { top: padding, right: padding, bottom: padding, left: padding }
  }

  return <View {...(viewProps as ViewProps)} />
}

/**
 * Step 4: Use the themed component with global or local overrides
 */
import { Text } from '@phaserjsx/ui'

export function UsageExample() {
  return (
    <View>
      {/* Uses global Sidebar theme */}
      <Sidebar>
        <Text text="Content" />
      </Sidebar>

      {/* Override theme locally */}
      <View
        theme={{
          Sidebar: {
            backgroundColor: 0xff0000,
            width: 300,
          },
        }}
      >
        <Sidebar>
          <Text text="Red sidebar with custom width" />
        </Sidebar>
      </View>

      {/* Explicit props override everything */}
      <Sidebar backgroundColor={0x00ff00} width={250}>
        <Text text="Green sidebar - explicit props win" />
      </Sidebar>
    </View>
  )
}

export {}
