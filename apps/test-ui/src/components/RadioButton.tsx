/**
 * RadioButton component - Selectable option with circle indicator and label
 */
import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View } from '@phaserjsx/ui'

// Module augmentation to add RadioGroup theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    RadioButton: {
      selectedColor?: number
      color?: number
      labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
      gap?: number
      size?: number
      innerSize?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

/**
 * Props for RadioButton component
 */
export interface RadioButtonProps {
  /** Label text for the radio button */
  label: string
  /** Whether this radio button is selected */
  selected?: boolean
  /** Callback when radio button is clicked */
  onClick?: () => void
}

/**
 * RadioButton component - displays a selectable circle with label
 * @param props - RadioButton properties
 * @returns RadioButton JSX element
 */
export function RadioButton(props: RadioButtonProps) {
  const { props: themed, nestedTheme } = getThemedProps('RadioButton', undefined, {})
  const size = themed.size ?? 16
  const innerSize = themed.innerSize ?? size * 0.75
  const innerRadius = innerSize * 0.5
  const outerRadius = size * 0.5

  return (
    <View
      direction="row"
      alignItems="center"
      enableGestures={true}
      onTouch={() => props.onClick?.()}
      theme={nestedTheme}
      gap={themed.gap}
    >
      <View
        width={size}
        height={size}
        backgroundColor={themed.color}
        alignItems="center"
        justifyContent="center"
        backgroundAlpha={1.0}
        padding={0}
        cornerRadius={outerRadius}
      >
        <View
          width={innerSize}
          height={innerSize}
          backgroundColor={themed.selectedColor}
          visible={props.selected ?? false}
          cornerRadius={innerRadius}
        />
      </View>

      <Text text={props.label} style={themed.labelStyle} />
    </View>
  )
}
