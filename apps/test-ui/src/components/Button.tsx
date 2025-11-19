import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View, type ChildrenType } from '@phaserjsx/ui'

// Module augmentation to add ScrollSlider theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      dummy?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

/**
 * A simple button component with text and click handler
 */
export interface ButtonProps {
  text?: string
  onClick?: () => void
  width?: number
  height?: number
  children?: ChildrenType
}

export function Button(props: ButtonProps) {
  const { props: themed, nestedTheme } = getThemedProps('Button', undefined, {})

  // Example usage of themed prop & avoid unused variable warning for a while
  if (themed.dummy == 42) console.log(themed.dummy)

  return (
    <View
      theme={nestedTheme}
      width={props.width}
      height={props.height}
      enableGestures
      onTouch={() => {
        props.onClick?.()
      }}
    >
      {props.text != null && <Text text={props.text} />}
      {props.children}
    </View>
  )
}
