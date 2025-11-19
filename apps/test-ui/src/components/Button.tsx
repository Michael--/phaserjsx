import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, useRef, View, type ChildrenType } from '@phaserjsx/ui'

// Module augmentation to add Button theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      disabledColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      primary?: PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
      secondary?: PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
      outline?: PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
      small?: PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
      medium?: PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
      large?: PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
    } & PhaserJSX.ViewTheme
  }
}

/**
 * Props for Button component
 */
export interface ButtonProps {
  text?: string
  onClick?: () => void
  width?: number
  height?: number
  children?: ChildrenType
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
}

/**
 * Button component with variant support and disabled state
 * @param props - Button properties
 * @returns Button JSX element
 */
export function Button(props: ButtonProps) {
  const { props: themed } = getThemedProps('Button', undefined, {})
  const ref = useRef<Phaser.GameObjects.Container | null>(null)

  type ThemeRecord = Record<
    string,
    PhaserJSX.ViewTheme & { textStyle?: Phaser.Types.GameObjects.Text.TextStyle }
  >

  // Merge base theme with variant and size overrides
  const variantTheme = props.variant
    ? { ...themed, ...(themed as ThemeRecord)[props.variant] }
    : themed

  const sizeTheme = props.size
    ? { ...variantTheme, ...(themed as ThemeRecord)[props.size] }
    : variantTheme

  // Apply disabled state styling
  const effectiveTheme = props.disabled
    ? {
        ...sizeTheme,
        backgroundColor: themed.disabledColor ?? sizeTheme?.backgroundColor,
        alpha: 0.5,
      }
    : sizeTheme

  const shakeEffect = (magnitude: number, time: number) => {
    if (!ref.current) return

    const scene = ref.current.scene
    const start = 0
    const end = 0 + time

    // Store original position on first shake
    const refWithPos = ref.current as Phaser.GameObjects.Container & {
      __originalX?: number
      __originalY?: number
    }
    const originalX = refWithPos.__originalX
    const originalY = refWithPos.__originalY
    const isFirstShake = originalX === undefined || originalY === undefined

    if (isFirstShake) {
      refWithPos.__originalX = ref.current.x
      refWithPos.__originalY = ref.current.y
    }

    scene.tweens.add({
      targets: ref.current,
      duration: time,
      x: 0, // ! without any target, the tween wouldn't start
      onUpdate: () => {
        // decay reducing the shake magnitude over time
        const totalTime = end - start
        const remainingTime = end - 0
        // Exponential decay (Linear decay: const decayFactor = remainingTime / totalTime)
        const decayFactor = Math.pow(remainingTime / totalTime, 2)
        const mag = magnitude * decayFactor

        const baseX = refWithPos.__originalX ?? 0
        const baseY = refWithPos.__originalY ?? 0
        ref.current?.setPosition(
          baseX + Phaser.Math.Between(-mag, mag),
          baseY + Phaser.Math.Between(-mag, mag)
        )
      },
      onComplete: () => {
        if (!ref.current) return

        // Reset to original position only if no other shakes are active
        const activeTweens = scene.tweens
          .getTweensOf(ref.current)
          .filter((tween: Phaser.Tweens.Tween) => tween.isActive())

        if (activeTweens.length === 0) {
          const baseX = refWithPos.__originalX ?? 0
          const baseY = refWithPos.__originalY ?? 0
          ref.current.setPosition(baseX, baseY)

          // Clear stored position when all shakes are done
          delete refWithPos.__originalX
          delete refWithPos.__originalY
        }
      },
    })
  }

  const handleTouch =
    !props.disabled && props.onClick
      ? () => {
          props.onClick?.()
          shakeEffect(5, 200)
        }
      : undefined

  // Extract textStyle from theme for Text component only
  const textStyle = (effectiveTheme as ThemeRecord[string]).textStyle

  return (
    <View
      ref={ref}
      width={props.width}
      height={props.height}
      enableGestures={!props.disabled}
      {...(handleTouch && { onTouch: handleTouch })}
      {...effectiveTheme}
    >
      {props.text != null ? (
        <Text text={props.text} {...(textStyle && { style: textStyle })} />
      ) : (
        props.children
      )}
    </View>
  )
}
