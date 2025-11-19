import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View, type ChildrenType } from '@phaserjsx/ui'

// Module augmentation to add Button theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      disabledColor?: number
      primary?: PhaserJSX.ViewTheme
      secondary?: PhaserJSX.ViewTheme
      outline?: PhaserJSX.ViewTheme
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
}

/**
 * Button component with variant support and disabled state
 * @param props - Button properties
 * @returns Button JSX element
 */
export function Button(props: ButtonProps) {
  const { props: themed, nestedTheme } = getThemedProps('Button', undefined, {})

  // Merge base theme with variant-specific overrides
  const variantTheme = props.variant
    ? { ...themed, ...(themed as Record<string, PhaserJSX.ViewTheme>)[props.variant] }
    : themed

  // Apply disabled state styling
  const effectiveTheme = props.disabled
    ? {
        ...variantTheme,
        backgroundColor: themed.disabledColor ?? variantTheme?.backgroundColor,
        alpha: 0.5,
      }
    : variantTheme

  const handleTouch = !props.disabled && props.onClick ? () => props.onClick?.() : undefined

  return (
    <View
      theme={nestedTheme}
      width={props.width}
      height={props.height}
      enableGestures={!props.disabled}
      {...(handleTouch && { onTouch: handleTouch })}
      {...effectiveTheme}
    >
      {props.text != null ? <Text text={props.text} /> : props.children}
    </View>
  )
}
