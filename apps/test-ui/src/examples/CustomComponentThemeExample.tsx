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
      // Nested component themes
      Text?: Partial<import('@phaserjsx/ui').ComponentThemes['Text']>
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
  Text: {
    style: {
      fontSize: '18px',
      color: '#cccccc',
    },
  },
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
  const { props: themedProps } = getThemedProps('Sidebar', undefined, props)
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
 * Step 4: Use the themed component with global, local, and nested theme overrides
 */
import { Text } from '@phaserjsx/ui'

export function UsageExample() {
  return (
    <View direction="column" gap={30}>
      {/* Uses global Sidebar theme (includes nested Text theme with fontSize: 18px) */}
      <Sidebar>
        <Text text="Menu Item 1" />
        <Text text="Menu Item 2" />
        <Text text="Menu Item 3" />
      </Sidebar>

      {/* Override Sidebar's nested Text theme locally */}
      <View
        theme={{
          Sidebar: {
            backgroundColor: 0x2a2a2a,
            width: 300,
            Text: {
              style: {
                fontSize: '24px',
                color: '#ffaa00',
              },
            },
          },
        }}
      >
        <Sidebar>
          <Text text="Large orange text" />
          <Text text="All texts in this sidebar are styled" />
        </Sidebar>
      </View>

      {/* Explicit props on individual Text still override nested theme */}
      <Sidebar backgroundColor={0x003366} width={250}>
        <Text text="Normal sidebar text (18px from global)" />
        <Text text="Explicit override" style={{ fontSize: '12px', color: '#ff0000' }} />
      </Sidebar>
    </View>
  )
}

export {}
