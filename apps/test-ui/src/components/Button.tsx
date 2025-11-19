import { Text, View } from '@phaserjsx/ui'

/**
 * A simple button component with text and click handler
 */
export interface ButtonProps {
  text: string
  onClick?: () => void
  width?: number
  height?: number
  backgroundColor?: number
}

export function Button(props: ButtonProps) {
  return (
    <View
      width={props.width}
      height={props.height}
      backgroundColor={props.backgroundColor ?? 0x000088}
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
