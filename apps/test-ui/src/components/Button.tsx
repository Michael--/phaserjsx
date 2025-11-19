import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View } from '@phaserjsx/ui'

// Module augmentation to add ScrollSlider theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      backgroundColor?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

/**
 * A simple button component with text and click handler
 */
export interface ButtonProps {
  text: string
  onClick?: () => void
  width?: number
  height?: number
}

export function Button(props: ButtonProps) {
  const { props: themed } = getThemedProps('Button', undefined, {})

  return (
    <View
      width={props.width}
      height={props.height}
      backgroundColor={themed.backgroundColor ?? 0x000088}
      backgroundAlpha={1.0}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      alignItems="center"
      justifyContent="center"
      enableGestures
      onTouch={() => {
        props.onClick?.()
      }}
    >
      <Text text={props.text} style={{ fontSize: 16, color: 'white' }} />
    </View>
  )
}
