import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, useRef, View, type ChildrenType } from '@phaserjsx/ui'
import {
  createBounceEffect,
  createFlashEffect,
  createPressEffect,
  createPulseEffect,
  createShakeEffect,
  useGameObjectEffect,
  type EffectFn,
} from '../hooks'

/**
 * Map effect names to effect functions
 */
const EFFECT_MAP: Record<string, EffectFn | null> = {
  pulse: createPulseEffect,
  shake: createShakeEffect,
  bounce: createBounceEffect,
  press: createPressEffect,
  flash: createFlashEffect,
  none: null,
}

// Module augmentation to add Button theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      disabledColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      effect?: 'pulse' | 'shake' | 'bounce' | 'press' | 'flash' | 'none'
      effectConfig?: import('../hooks').EffectConfig
      primary?: PhaserJSX.ViewTheme & {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        effect?: 'pulse' | 'shake' | 'bounce' | 'press' | 'flash' | 'none'
        effectConfig?: import('../hooks').EffectConfig
      }
      secondary?: PhaserJSX.ViewTheme & {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        effect?: 'pulse' | 'shake' | 'bounce' | 'press' | 'flash' | 'none'
        effectConfig?: import('../hooks').EffectConfig
      }
      outline?: PhaserJSX.ViewTheme & {
        textStyle?: Phaser.Types.GameObjects.Text.TextStyle
        effect?: 'pulse' | 'shake' | 'bounce' | 'press' | 'flash' | 'none'
        effectConfig?: import('../hooks').EffectConfig
      }
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
  const { applyEffect } = useGameObjectEffect(ref)

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

  const handleTouch =
    !props.disabled && props.onClick
      ? () => {
          props.onClick?.()

          // Apply effect from theme
          const effectName = effectiveTheme.effect ?? 'pulse'
          const effectConfig = effectiveTheme.effectConfig ?? { intensity: 1.1, time: 100 }
          const effectFn = EFFECT_MAP[effectName]

          if (effectFn) {
            applyEffect(effectFn, effectConfig)
          }
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
