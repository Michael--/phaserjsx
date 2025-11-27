import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, useEffect, useRef, useState, View, type ViewProps } from '@phaserjsx/ui'
import { useGameObjectEffect, type EffectDefinition } from '../hooks'

// Module augmentation to add CharText theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    CharText: {
      disabledColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      iconSize?: number
    } & PhaserJSX.ViewTheme &
      EffectDefinition
  }
}

/**
 * Props for CharText component
 */
export interface CharTextProps extends Omit<ViewProps, 'children'>, EffectDefinition {
  /** Input value (controlled) */
  value?: string

  /** Whether input is disabled */
  disabled?: boolean

  textStyle?: Phaser.Types.GameObjects.Text.TextStyle | undefined
  iconSize?: number
}

/**
 * CharText component with variant support and disabled state
 * @param props - CharText properties
 * @returns CharText JSX element
 */
export function CharText(props: CharTextProps) {
  const { props: themed } = getThemedProps('CharText', undefined, {})
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(ref) // not yet used

  // Extract textStyle from theme for Text component only
  const textStyle = props.textStyle ?? themed.textStyle
  const padding = props.padding ?? themed.padding ?? 0
  const padLeft = typeof padding === 'number' ? padding : (padding.left ?? 0)
  const padRight = typeof padding === 'number' ? padding : (padding.right ?? 0)
  const horizontalPadding = padLeft + padRight
  const padTop = typeof padding === 'number' ? padding : (padding.top ?? 0)
  const padBottom = typeof padding === 'number' ? padding : (padding.bottom ?? 0)
  const verticalPadding = padTop + padBottom

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    // for testing purposes only amd ensure basic layout done
    setTimeout(() => {
      if (ref.current == null) return

      // TODO: for every character, measure and accumulate width and height
      // every character should be collected into an array of Text objects
      const char = ref.current.scene.add.text(0, 0, 'A', textStyle ?? {})
      // char.setOrigin(0, 0) // necessary ?
      const b = ref.current.getBounds()
      char.x = b.left + padLeft
      char.y = b.top + padTop
      const newWidth = char.width + horizontalPadding
      const newHeight = char.height + verticalPadding
      setWidth(newWidth)
      setHeight(newHeight)

      // char.destroy() // hint: manage created GameObjects properly
    }, 200)
  }, [])

  return (
    <View
      ref={ref}
      width={width}
      height={height}
      enableGestures={!props.disabled}
      justifyContent="center"
      {...props}
      {...themed}
    />
  )
}
