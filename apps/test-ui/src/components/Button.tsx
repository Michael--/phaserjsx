import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, useRef, View, type ChildrenType } from '@phaserjsx/ui'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../hooks'
import { Icon, type IconType } from './BootstrapIcon'

/**
 * Button variant theme with text style and icon size
 */
type ButtonVariantTheme = PhaserJSX.ViewTheme & {
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  iconSize?: number
}

/**
 * Button variant theme and effect support
 */
type ButtonVariantEffectTheme = ButtonVariantTheme & EffectDefinition

// Module augmentation to add Button theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      disabledColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      iconSize?: number
      primary?: ButtonVariantEffectTheme
      secondary?: ButtonVariantEffectTheme
      outline?: ButtonVariantEffectTheme
      small?: ButtonVariantTheme
      medium?: ButtonVariantTheme
      large?: ButtonVariantTheme
    } & PhaserJSX.ViewTheme &
      EffectDefinition
  }
}

/**
 * Props for Button component
 */
export interface ButtonProps extends EffectDefinition {
  text?: string
  icon?: IconType
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

  type ThemeRecord = Record<string, ButtonVariantTheme>

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

          // Apply effect: props override theme, theme overrides default
          const resolved = resolveEffect(props, effectiveTheme)
          applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
        }
      : undefined

  // Extract textStyle from theme for Text component only
  const iconSize = effectiveTheme.iconSize ?? 24
  const textStyle = (effectiveTheme as ThemeRecord[string]).textStyle

  return (
    <View
      ref={ref}
      width={props.width}
      height={props.height}
      enableGestures={!props.disabled}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...(handleTouch && { onTouch: handleTouch })}
      {...effectiveTheme}
    >
      {props.icon != null && <Icon type={props.icon} size={iconSize} />}
      {props.text != null ? (
        <Text text={props.text} {...(textStyle && { style: textStyle })} />
      ) : (
        <>{props.children}</>
      )}
    </View>
  )
}
